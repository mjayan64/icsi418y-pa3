import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";

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
      </nav>

      {view === "signup" ? <Signup /> : <Login />}
    </main>
  );
}

export default App;