import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "./create_quiz.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//Skriv in fråga och svar
//Lägg till fråga eller skicka in en fråga
//Om det är en fråga lägg in i en lista annars skicka direkt till api
//Skicka in listan till apin

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const MapHandler = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

const CreateQuestions: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [addedQuestions, setAddedQuestions] = useState<
    {
      question: string;
      answer: string;
      location: { lat: number; lng: number } | null;
    }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGeolocationSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
    };

    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess);
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });
    return null;
  };

  const handleAddQuestion = async (finalize: boolean) => {
    if (!question.trim() || !answer.trim()) {
      setError("Question and answer cannot be empty.");
      return;
    }

    if (finalize && !location) {
      setError("Please select a location on the map to finalize the quiz.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: quizId,
            question,
            answer,
            location: location
              ? {
                  latitude: location.lat.toString(),
                  longitude: location.lng.toString(),
                }
              : undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add question.");
      }

      setAddedQuestions([...addedQuestions, { question, answer, location }]);

      if (finalize) {
        navigate("/quiz");
      } else {
        setQuestion("");
        setAnswer("");
        setLocation(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="add-question">
      {error && <p className="error">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddQuestion(false);
        }}
      >
        <label htmlFor="question">Question:</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <label htmlFor="answer">Answer:</label>
        <input
          type="text"
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />

        {/* Leaflet Map */}
        <div>
          <MapContainer
            center={location || [57.6908, 11.98]}
            zoom={13}
            style={{ height: "300px", width: "100%", margin: "10px 0" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {location && (
              <Marker
                position={[location.lat, location.lng]}
                icon={markerIcon}
              ></Marker>
            )}
            <MapClickHandler />
            <MapHandler center={location || { lat: 57.6908, lng: 11.98 }} />
          </MapContainer>
        </div>

        <div className="buttons">
          <button type="button" onClick={() => handleAddQuestion(false)}>
            Add Question
          </button>
          <button type="button" onClick={() => handleAddQuestion(true)}>
            Finalize Quiz
          </button>
        </div>
      </form>

      {/* Visa frågor */}
      <div className="added-questions">
        {addedQuestions.map((q, index) => (
          <div key={index} className="question-card">
            <h3>Question {index + 1}</h3>
            <p>
              <strong>Question:</strong> {q.question}
            </p>
            <p>
              <strong>Answer:</strong> {q.answer}
            </p>
            <p>
              <strong>Location:</strong> Latitude {q.location?.lat || "N/A"},
              Longitude {q.location?.lng || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateQuestions;
