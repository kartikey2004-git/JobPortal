# Architecture

Vite + React 18 (JavaScript/JSX, typed with JSDoc), Tailwind CSS v4, Radix (`radix-ui`), Clerk (auth), Supabase (data + storage). Visual design: see DESIGN_SYSTEM.md.

## Folder structure

```
src/
  main.jsx · App.jsx · routes.jsx   Entry, providers, route table (lazy-loaded pages)
  config/constants.js               Roles, statuses, MIME types, route paths, bucket names
  lib/                              utils.js (cn) · supabase.js (client, storage URLs, unwrap)
  hooks/                            useFetch (data access) · useUserRole (Clerk role)
  styles/                           fonts · tokens · base · typography · layout · utilities · vendor
  layout/                           AppLayout · Navbar · Footer
  components/ui/                    Design-system primitives (no app knowledge)
  components/shared/                PageHeader, PathnameDisplay, PageSkeleton, AsyncList,
                                    FormField, UnderlineLink, MarkdownContent
  features/
    auth/          ProtectedRoute
    theme/         ThemeProvider, ModeToggle
    jobs/          api.js, JobCard, MyPostedJobs
    applications/  api.js, ApplicationCard, ApplyJobDialog, MyApplications
    companies/     api.js, AddCompanyDialog
    landing/       HeroSection, AudienceRows, Features, Faqs, data/
  pages/                            Route-level compositions (thin; no data logic of their own
                                    beyond wiring features together)
```

Four layers, with imports flowing downward only:
`pages → features → components/shared → components/ui`, and everything may use `config`, `lib`, `hooks`.
Features do not import from each other's internals, except pages composing them
(`pages/Job.jsx` uses both `jobs` and `applications`).

## Data flow

```
page/feature component
   └─ useFetch(apiFn)            hooks/useFetch.js
        └─ Clerk session.getToken({template:"supabase"})
        └─ createSupabaseClient(token)      lib/supabase.js
        └─ apiFn(supabase, ...args)         features/*/api.js
              └─ unwrap({data,error})  → returns data or THROWS
```

Conventions:
- API functions are `(supabase, ...args) => Promise<data>` and **throw** on failure.
- `useFetch(...).fn(...args)` resolves with the data, or `undefined` on failure
  (failure is in `error`). Write `if (await fn(x)) { …success… }`.
- `fn` is referentially stable → safe in `useEffect` dependency arrays.
- Only the latest call updates state (no stale-response overwrites).

## Decisions

| Decision | Reason |
| --- | --- |
| Stay on JS + JSDoc (no TypeScript) | Chosen by the project owner; TS can be a later phase. |
| `react/prop-types` lint rule turned **off** | No PropTypes in the codebase; props are documented with JSDoc. This removes ~70 false errors, but it also means prop shapes are not machine-checked. A TS migration would restore that. |
| Route-level code splitting | Entry bundle 2.46 MB → 508 KB; the markdown editor only loads on Job/PostJob. |
| `ROUTES` / `ROLES` constants | Removes string literals duplicated across router, header, footer, pages. |
| `ApplicationCard` updates by application `id` | Previously updated every application of the job (bug). |

## Database security (Supabase)

Policies live in the database; `supabase/migrations/` records what was applied (project JobSaga,
applied with the Supabase CLI). `requesting_user_id()` returns the Clerk user id from the JWT.

- `applications`: candidates read their own; recruiters read applicants of their own jobs; inserts must
  use the caller's own `candidate_id`; only the job's recruiter can update status.
- `jobs` / `saved_jobs`: inserts must use the caller's own id (`recruiter_id` / `user_id`).
  Whether a user *is* a recruiter is Clerk metadata and is not enforced in Postgres.
- Storage: `resumes` is **private** (5 MB, PDF/Word only). Files are opened through 60-second signed URLs,
  which Supabase only issues to the uploader or the recruiter of that job
  (`getResumeSignedUrl` in `features/applications/api.js`). Uploaded names must end with `-<user id>`.
  `company-logo` stays public (2 MB, PNG/JPEG).
- Because of these policies a candidate only sees their own application on a job page, so the
  applicant total is shown to the job's owner only.

## Known limitations / follow-ups

- No automated tests exist; verification was lint + production build + manual browser check of public pages.
  Authenticated flows (Clerk/Supabase) were **not** exercised at runtime (no credentials available).
- `index.html` references `/logo.png`, which is not in `public/`.
- Supabase row types are untyped; generating them needs access to the project schema.
- The drawer chunk (~1.2 MB) contains the markdown editor and Radix/vaul; could be split further.
