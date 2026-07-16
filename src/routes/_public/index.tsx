import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: Landing,
});

function Landing() {
  return (
    <main className="h-screen w-screen bg-blue-100 p-8 flex flex-col items-center justify-center">

      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-blue-700">Assignment Tracker</h1>
          <p className="text-lg text-neutral-700">
            Keep track of all your assignment deadlines in one place.
          </p>
        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906334.png"
          alt="Assignments"
          className="w-24 mx-auto opacity-90"
        />

        <ul className="list-disc pl-5 space-y-1 text-neutral-800">
          <li>Add assignments with due dates</li>
          <li>See what's due next at a glance</li>
          <li>Check things off as you finish them</li>
          <li>Stay ahead of every deadline</li>
        </ul>

        <div className="text-center space-y-2">
          <p className="text-neutral-700">Ready to get started?</p>

          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign up
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
