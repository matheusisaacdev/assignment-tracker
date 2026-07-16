import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

import { Spinner, buttonClass } from "#/components/spinner";
import { createAssignment, getAssignments, deleteAssignment, editAssignment } from "#/lib/assignments";

export const Route = createFileRoute("/_auth/dashboard")({
  loader: async ({ context }) => {
    const assignments = await getAssignments();
    return { user: context.user, assignments };
  },
  component: Dashboard,
});

const inputClass =
  "block w-full border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-transparent";

function Dashboard() {
  const { user, assignments } = Route.useLoaderData();
  const router = useRouter();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pending, setPending] = useState(false);

  function handleEditClick(a: { id: number; title: string; dueDate: Date }) {
    setEditingId(a.id);
    setTitle(a.title);

  const formatted = new Date(a.dueDate).toISOString().slice(0, 16);
  setDueDate(formatted);

  }


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);

    if (editingId === null) {
      await createAssignment({ data: { title, dueDate } });
    } else {
      await editAssignment({ data: { id: editingId, title, dueDate } });
    }

    setTitle("");
    setDueDate("");
    setEditingId(null);

    await router.invalidate();
    setPending(false);
  }

  async function handleDelete(id: number) {
    await deleteAssignment({ data: { id } });
    await router.invalidate();
  }

  function isDueSoon(dueDate: Date) {
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  }

  return (
    <div className="p-8 max-w-md space-y-6">
      <h1 className="text-4xl font-bold">Welcome, {user.name}</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <h2 className="text-2xl font-semibold">
          {editingId === null ? "New assignment" : "Edit assignment"}
        </h2>

        <input
          className={inputClass}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className={inputClass}
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <button disabled={pending} className={buttonClass}>
          {pending && <Spinner />}
          {editingId === null ? "Add assignment" : "Update assignment"}
        </button>
      </form>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Your assignments</h2>

        {assignments.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          <ul className="space-y-1">
            {assignments.map((a) => (
              <li
                key={a.id}
                className="border-b border-neutral-200 dark:border-neutral-800 py-1 flex items-center justify-between"
              >
              <div>
                <span className="font-medium">{a.title}</span> — due{" "}
                <span className={isDueSoon(a.dueDate) ? "text-red-600" : ""}>
                  {new Date(a.dueDate).toLocaleString()}
                </span>
              </div>


                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(a)}
                    className="cursor-pointer bg-transparent border-none"
                  >
                    <FaEdit color="blue" size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="cursor-pointer bg-transparent border-none"
                  >
                    <FaTrash color="red" size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
