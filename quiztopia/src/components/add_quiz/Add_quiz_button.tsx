import "./add_quiz_button.css";
import { useNavigate } from "react-router-dom";

export default function Add_quiz_button() {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      <button onClick={() => navigate("/addquiz")}>Add Quiz!</button>
    </div>
  );
}
