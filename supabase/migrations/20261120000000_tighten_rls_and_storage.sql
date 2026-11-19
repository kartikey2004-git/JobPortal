-- Tighten row-level security and storage for the job portal.
--
-- Problems fixed:
--   1. `applications` was readable by anyone (SELECT ... USING (true) for role public).
--   2. Inserts on applications / jobs / saved_jobs used WITH CHECK (true), so any
--      signed-in user could write rows on behalf of someone else.
--   3. The `resumes` bucket was public with no size/type limits, and any signed-in
--      user could read or upload under any name.
--
-- `requesting_user_id()` returns the Clerk user id (the JWT `sub` claim).
-- Resume objects are named `resume-<random>-<clerk user id>` (see src/features/applications/api.js).

begin;

-- ---------------------------------------------------------------- applications
drop policy if exists "Enable read access for auth users" on public.applications;

create policy "Candidates read own applications"
  on public.applications for select to authenticated
  using (candidate_id = requesting_user_id());

create policy "Recruiters read applicants for own jobs"
  on public.applications for select to authenticated
  using (exists (
    select 1 from public.jobs j
    where j.id = applications.job_id and j.recruiter_id = requesting_user_id()
  ));

drop policy if exists "Enable insert for authenticated users only" on public.applications;

create policy "Candidates apply as themselves"
  on public.applications for insert to authenticated
  with check (candidate_id = requesting_user_id());

-- ------------------------------------------------------------------------ jobs
drop policy if exists "Enable insert for authenticated users only" on public.jobs;

create policy "Recruiters post as themselves"
  on public.jobs for insert to authenticated
  with check (recruiter_id = requesting_user_id());

-- ------------------------------------------------------------------ saved_jobs
drop policy if exists "Enable insert for authenticated users only" on public.saved_jobs;

create policy "Users save as themselves"
  on public.saved_jobs for insert to authenticated
  with check (user_id = requesting_user_id());

-- ------------------------------------------------------------- storage: resumes
-- Resumes become private: access is through short-lived signed URLs, and only
-- the candidate who uploaded a file or the recruiter of the job it was sent to
-- can create one.
drop policy if exists "Auth users can upload i5g8va_0" on storage.objects;
drop policy if exists "Auth users can upload i5g8va_1" on storage.objects;

create policy "Candidates upload their own resumes"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'resumes'
    and right(name, length(requesting_user_id()) + 1) = '-' || requesting_user_id()
  );

create policy "Owners and recruiters read resumes"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'resumes'
    and (
      right(name, length(requesting_user_id()) + 1) = '-' || requesting_user_id()
      or exists (
        select 1
        from public.applications a
        join public.jobs j on j.id = a.job_id
        where j.recruiter_id = requesting_user_id()
          and right(a.resume, length(objects.name) + 1) = '/' || objects.name
      )
    )
  );

update storage.buckets
set public = false,
    file_size_limit = 5242880, -- 5 MB
    allowed_mime_types = array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
where id = 'resumes';

-- ------------------------------------------------------- storage: company logos
-- Logos stay public (they are shown on job listings) but get the limits the UI promises.
update storage.buckets
set file_size_limit = 2097152, -- 2 MB
    allowed_mime_types = array['image/png', 'image/jpeg']
where id = 'company-logo';

commit;
