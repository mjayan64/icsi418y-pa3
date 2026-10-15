import { useEffect, useState } from "react";

function CreateProject() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [projectLeadId, setProjectLeadId] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Load registered users for the project lead dropdown
  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch("http://localhost:9000/users", {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not retrieve users");
        }

        setUsers(data);
        setLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          setIsError(true);
          setMessage("Could not load users. Check that the server is running.");
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => controller.abort();
  }, []);

  // Validate the form and send the project to the backend
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (!name.trim() || !description.trim() || !status || !projectLeadId) {
      setIsError(true);
      setMessage("All project fields are required");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:9000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          status,
          project_lead_id: projectLeadId,
        }),
      });

      const data = await response.json();

      setIsError(!response.ok);
      setMessage(data.message);

      if (response.ok) {
        setName("");
        setDescription("");
        setStatus("Planning");
        setProjectLeadId("");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Could not connect to the server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Project</h2>

      <fieldset disabled={loading || submitting}>
        <label>
          Project Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label>
          Project Lead
          <select
            value={projectLeadId}
            onChange={(event) => setProjectLeadId(event.target.value)}
            disabled={users.length === 0}
          >
            <option value="">
              {loading ? "Loading users..." : "Select a project lead"}
            </option>

            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={users.length === 0}>
          {submitting ? "Creating..." : "Create Project"}
        </button>
      </fieldset>

      {!loading && users.length === 0 && !isError && (
        <p>No registered users found. Create an account first.</p>
      )}

      {message && (
        <p role="status" style={{ color: isError ? "crimson" : "green" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default CreateProject;