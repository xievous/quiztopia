import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//Skriv in namnet på mitt quiz
//Skicka in det till apin och vidare med navigationen

const AddQuizForm: React.FC = () => {
  const [quizName, setQuizName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ name: quizName }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not create quiz");
      }

      const data = await response.json();
      const quizId = data.quizId;

      navigate(`/createquiz/${quizId}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="create-quiz">
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreateQuiz}>
        <label htmlFor="quizName">Quiz Name:</label>
        <input
          type="text"
          id="quizName"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          required
        />
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
};

export default AddQuizForm;
