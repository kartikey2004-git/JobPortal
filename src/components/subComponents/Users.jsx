import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const Users = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
      <Card className="card hover:-translate-y-3 transition-all border-gray-900 duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>For Job Seekers</CardTitle>
        </CardHeader>
        <CardContent>
          Discover and apply for job opportunities, manage your applications,
          and track your progress—all in one place.
        </CardContent>
      </Card>

      <Card className="card hover:-translate-y-3 transition-all duration-300 border-gray-900 ease-in-out">
        <CardHeader>
          <CardTitle>For Employers</CardTitle>
        </CardHeader>
        <CardContent>
          Post job listings, manage applications, and find the ideal candidate
          with ease.
        </CardContent>
      </Card>
    </section>
  );
};

export default Users;
