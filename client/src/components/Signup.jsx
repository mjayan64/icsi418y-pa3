import { useState } from "react";

function Signup() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!fName.trim() || !lName.trim() || !username.trim() || !password) {
      setIsError(true);
      setMessage("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          f_name: fName,
          l_name: lName,
          username,
          password,
        }),
      });

      const data = await response.json();
      setIsError(!response.ok);
      setMessage(data.message);

      if (response.ok) {
        setFName("");
        setLName("");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Could not connect to the server");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      <label>
        First Name
        <input value={fName} onChange={(e) => setFName(e.target.value)} />
      </label>

      <label>
        Last Name
        <input value={lName} onChange={(e) => setLName(e.target.value)} />
      </label>

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

      <button type="submit">Create Account</button>

      {message && (
        <p role="status" style={{ color: isError ? "crimson" : "green" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default Signup;