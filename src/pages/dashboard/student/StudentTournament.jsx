import React, { useEffect, useState } from "react";

import DashboardNavbar from "../../../components/Dashboradnavbar";

const StudentTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/tournaments"; // <-- Backend endpoint

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar />
      <div className="max-w-6xl mx-auto pt-28 px-6">
        <h1 className="text-2xl font-bold mb-6">Upcoming Tournaments</h1>

        {loading ? (
          <p className="text-gray-400">Loading tournaments...</p>
        ) : tournaments.length === 0 ? (
          <p className="text-gray-400">No upcoming tournaments.</p>
        ) : (
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-gray-800 rounded-xl p-5 shadow-md flex items-center justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold">{tournament.name}</h2>
                  <p className="text-gray-400">
                    {new Date(tournament.date).toLocaleDateString()} -{" "}
                    {new Date(tournament.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <a
                  href={tournament.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Join
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTournament;
