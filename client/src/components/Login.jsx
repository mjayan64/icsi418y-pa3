import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!username.trim() || !password) {
      setIsError(true);
      setMessage("Username and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setIsError(!response.ok);
      setMessage(data.message);

      if (response.ok) {
        setPassword("");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Could not connect to the server");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>

      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button type="submit">Log In</button>

      {message && (
        <p role="status" style={{ color: isError ? "crimson" : "green" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default Login;