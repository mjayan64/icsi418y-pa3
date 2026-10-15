import { useEffect, useState } from "react";

function ProjectMembers() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  const [memberships, setMemberships] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [memberMessage, setMemberMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  // Load projects and users for the dropdowns
  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:9000/projects", {
            signal: controller.signal,
          }),
          fetch("http://localhost:9000/users", {
            signal: controller.signal,
          }),
        ]);

        const [projectsData, usersData] = await Promise.all(
          responses.map((response) => response.json())
        );

        if (!responses[0].ok) {
          throw new Error(
            projectsData.message || "Could not retrieve projects"
          );
        }

        if (!responses[1].ok) {
          throw new Error(usersData.message || "Could not retrieve users");
        }

        setProjects(projectsData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage(error.message);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  // Cancel the previous request when another project is selected
  useEffect(() => {
    if (!projectId) {
      return;
    }

    const controller = new AbortController();

    async function loadMembers() {
      try {
        const response = await fetch(
          `http://localhost:9000/projects/${projectId}/members`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not retrieve members");
        }

        setMemberships(data);
        setLoadingMembers(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMemberMessage(error.message);
          setLoadingMembers(false);
        }
      }
    }

    loadMembers();

    return () => controller.abort();
  }, [projectId]);

  function handleProjectChange(event) {
    const selectedId = event.target.value;

    setProjectId(selectedId);
    setUserId("");
    setMemberships([]);
    setMemberMessage("");
    setFeedback("");
    setLoadingMembers(Boolean(selectedId));
  }

  // Update the member list after the backend accepts the addition
  async function handleAddMember(event) {
    event.preventDefault();
    setFeedback("");
    setIsError(false);

    if (!projectId || !userId) {
      setIsError(true);
      setFeedback("Select a project and a user");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:9000/projects/${projectId}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const data = await response.json();

      setIsError(!response.ok);
      setFeedback(data.message);

      if (response.ok) {
        setMemberships((current) => [...current, data.membership]);
        setUserId("");
      }
    } catch (error) {
      setIsError(true);
      setFeedback("Could not connect to the server");
    } finally {
      setSubmitting(false);
    }
  }

  // Remove the member from state only after successful deletion
  async function handleRemoveMember(memberUserId) {
    setFeedback("");
    setIsError(false);
    setSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:9000/projects/${projectId}/members/${memberUserId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      setIsError(!response.ok);
      setFeedback(data.message);

      if (response.ok) {
        setMemberships((current) =>
          current.filter(
            (membership) => membership.user_id !== memberUserId
          )
        );
      }
    } catch (error) {
      setIsError(true);
      setFeedback("Could not connect to the server");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedProject = projects.find(
    (project) => project._id === projectId
  );

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (message) {
    return (
      <p role="alert" style={{ color: "crimson" }}>
        {message}
      </p>
    );
  }

  return (
    <section>
      <h2>Project Members</h2>

      <label>
        Project
        <select
          value={projectId}
          onChange={handleProjectChange}
          disabled={submitting}
        >
          <option value="">Select a project</option>

          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      {projects.length === 0 && <p>Create a project first.</p>}

      {projectId && (
        <div>
          <h3>Current Members</h3>

          {loadingMembers ? (
            <p>Loading members...</p>
          ) : memberMessage ? (
            <p role="alert" style={{ color: "crimson" }}>
              {memberMessage}
            </p>
          ) : (
            <>
              {memberships.length === 0 ? (
                <p>No members found.</p>
              ) : (
                <ul>
                  {memberships.map((membership) => {
                    const user = users.find(
                      (user) => user._id === membership.user_id
                    );

                    const isLead =
                      membership.user_id === selectedProject?.project_lead_id;

                    return (
                      <li key={membership._id}>
                        {user ? user.username : "User not found"}
                        {isLead && " (Project Lead)"}{" "}

                        <button
                          type="button"
                          disabled={isLead || submitting}
                          onClick={() =>
                            handleRemoveMember(membership.user_id)
                          }
                        >
                          {isLead ? "Lead cannot be removed" : "Remove"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <form onSubmit={handleAddMember}>
                <h3>Add Member</h3>

                <label>
                  Registered User
                  <select
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    disabled={submitting}
                  >
                    <option value="">Select a user</option>

                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  disabled={submitting || users.length === 0}
                >
                  {submitting ? "Please wait..." : "Add Member"}
                </button>
              </form>
            </>
          )}

          {feedback && (
            <p
              role="status"
              style={{ color: isError ? "crimson" : "green" }}
            >
              {feedback}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default ProjectMembers;