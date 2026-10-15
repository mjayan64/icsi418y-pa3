import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CreateProject from "./components/CreateProject";
import ProjectList from "./components/ProjectList";
import ProjectMembers from "./components/ProjectMembers";

function App() {
  const [view, setView] = useState("signup");

  return (
    <main>
      <nav>
        <button type="button" onClick={() => setView("signup")}>
          Sign Up
        </button>

        <button type="button" onClick={() => setView("login")}>
          Log In
        </button>

        <button type="button" onClick={() => setView("createProject")}>
          Create Project
        </button>

        <button type="button" onClick={() => setView("projects")}>
          View Projects
        </button>

        <button type="button" onClick={() => setView("members")}>
          Project Members
        </button>
      </nav>

      {view === "signup" && <Signup />}
      {view === "login" && <Login />}
      {view === "createProject" && <CreateProject />}
      {view === "projects" && <ProjectList />}
      {view === "members" && <ProjectMembers />}
    </main>
  );
}

export default App;