import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Skriva in inloggning
//Handle submit fetchar från apin inloggaren

type User = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData: User = { username, password };
    const API_URL =
      "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        setError("");
        navigate("/quiz");
      } else {
        throw new Error("Failed to login.");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        <p onClick={() => navigate("/signup")}>Sign up</p>
      </form>
    </div>
  );
}
