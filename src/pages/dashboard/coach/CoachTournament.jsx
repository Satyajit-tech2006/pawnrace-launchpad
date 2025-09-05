import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../components/Dashbordnavbar";

const CoachTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    name: "",
    date: "",
    link: "",
  });

  const API_URL = "http://localhost:5000/api/tournaments"; // <-- Backend endpoint

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };
    fetchTournaments();
  }, []);

  // Add new tournament
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTournament),
      });
      const data = await res.json();
      setTournaments([...tournaments, data]); // update UI
      setNewTournament({ name: "", date: "", link: "" }); // reset form
    } catch (error) {
      console.error("Error adding tournament:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar />
      <div className="max-w-6xl mx-auto pt-28 px-6">
        <h1 className="text-2xl font-bold mb-6">Manage Tournaments</h1>

        {/* Create Tournament Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Tournament Name"
              value={newTournament.name}
              onChange={(e) =>
                setNewTournament({ ...newTournament, name: e.target.value })
              }
              required
              className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="datetime-local"
              value={newTournament.date}
              onChange={(e) =>
                setNewTournament({ ...newTournament, date: e.target.value })
              }
              required
              className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="url"
              placeholder="Tournament Link"
              value={newTournament.link}
              onChange={(e) =>
                setNewTournament({ ...newTournament, link: e.target.value })
              }
              required
              className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 px-5 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
          >
            Add Tournament
          </button>
        </form>

        {/* List of Tournaments */}
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
                <p className="text-gray-400 text-sm">
                  Link:{" "}
                  <a
                    href={tournament.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {tournament.link}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachTournament;
