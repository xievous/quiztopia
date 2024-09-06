import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import SignUpPage from "../pages/SignUp/SignUpPage";
import CreateQuiz from "../pages/CreateQuiz/CreateQuiz";
import QuizPage from "../pages/Quiz/QuizPage";
import AddQuiz from "../pages/AddQuiz/AddQuiz";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/quiz",
    element: <QuizPage />,
  },
  {
    path: "/addquiz",
    element: <AddQuiz />,
  },
  {
    path: "/createquiz/:quizId",
    element: <CreateQuiz />,
  },
]);

export default router;
