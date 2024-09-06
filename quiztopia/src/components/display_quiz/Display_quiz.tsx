import React, { useEffect, useState } from "react";
import Card from "./card/Card";

//Fetchar quizzes från apin
//Rendera ut alla quizzes

interface Location {
  longitude: string;
  latitude: string;
}

interface Question {
  question: string;
  answer: string;
  location: Location;
}

interface Quiz {
  questions: Question[];
  username: string;
  quizId: string;
  userId: string;
}

interface ApiResponse {
  success: boolean;
  quizzes: Quiz[];
}

const DisplayQuiz: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }

      try {
        const response = await fetch(
          "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quiz data.");
        }

        const data: ApiResponse = await response.json();
        setQuizzes(data.quizzes);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchQuizData();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!quizzes || quizzes.length === 0) {
    return <p>No quiz data available.</p>;
  }

  return (
    <div className="quiz-container">
      {quizzes.map((quiz) => (
        <div key={quiz.quizId} className="quiz">
          <Card quiz={quiz} />
        </div>
      ))}
    </div>
  );
};

export default DisplayQuiz;
