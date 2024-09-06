import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//Skriv in användarnamn och lösenord
//Handlesubmit hämtar användarnamn skickar den till apin för registrering

type User = {
  username: string;
  password: string;
};

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userData: User = { username, password };
    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error("Error");
      }
      const data = await response.json();
      console.log(data);
      navigate("/");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></input>

        <label>Lösenord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
