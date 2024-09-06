import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./card.css";

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

interface Location {
  longitude: string;
  latitude: string;
}

interface Question {
  question: string;
  answer: string;
  location?: Location;
}

interface Quiz {
  questions: Question[];
  username: string;
  quizId: string;
  userId: string;
}

interface CardProps {
  quiz: Quiz;
}

const Card: React.FC<CardProps> = ({ quiz }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="card">
      <p>Quiz ID: {quiz.quizId}</p>
      <p>User ID: {quiz.userId}</p>
      <p>Username: {quiz.username}</p>
      <button onClick={toggleDetails}>
        {showDetails ? "Hide Quiz" : "Show Quiz"}
      </button>

      {showDetails && (
        <div className="quiz-details">
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((q, index) => (
              <div key={index}>
                <p>
                  Question {index + 1}: {q.question}
                </p>
                <p>Answer: {q.answer}</p>

                {/* Leaflet Map */}
                {q.location ? (
                  <MapContainer
                    center={[
                      parseFloat(q.location.latitude),
                      parseFloat(q.location.longitude),
                    ]}
                    zoom={13}
                    style={{ height: "300px", width: "100%", margin: "10px 0" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[
                        parseFloat(q.location.latitude),
                        parseFloat(q.location.longitude),
                      ]}
                      icon={markerIcon}
                    >
                      <Popup>
                        {`Lat: ${q.location.latitude}, Long: ${q.location.longitude}`}
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <p>No location available for this question.</p>
                )}
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
