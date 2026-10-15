import { useEffect, useState } from "react";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load projects and users to display readable lead names
  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:9000/projects", {
            signal: controller.signal,
          }),
          fetch("http://localhost:9000/users", {
            signal: controller.signal,
          }),
        ]);

        const [projectsData, usersData] = await Promise.all([
          projectsResponse.json(),
          usersResponse.json(),
        ]);

        if (!projectsResponse.ok) {
          throw new Error(
            projectsData.message || "Could not retrieve projects"
          );
        }

        if (!usersResponse.ok) {
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

    loadProjects();

    return () => controller.abort();
  }, []);

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
      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects have been created yet.</p>
      ) : (
        projects.map((project) => {
          const lead = users.find(
            (user) => user._id === project.project_lead_id
          );

          return (
            <article key={project._id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p>
                <strong>Status:</strong> {project.status}
              </p>
              <p>
                <strong>Project Lead:</strong>{" "}
                {lead ? lead.username : "User not found"}
              </p>
            </article>
          );
        })
      )}
    </section>
  );
}

export default ProjectList;