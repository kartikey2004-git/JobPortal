import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const Users = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
      <Card className="card hover:-translate-y-3 transition-all duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>For candidates</CardTitle>
        </CardHeader>
        <CardContent>
          Browse opportunities, submit applications, and track your progress—all
          in one place.
        </CardContent>
      </Card>

      <Card className="card hover:-translate-y-3 transition-all duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>For recruiters</CardTitle>
        </CardHeader>
        <CardContent>
          Post openings, review applications, and connect with qualified
          candidates.
        </CardContent>
      </Card>
    </section>
  );
};

export default Users;
