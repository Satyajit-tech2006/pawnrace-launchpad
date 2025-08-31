import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import Navbar from "./Navbar";
const coaches = [
  {
    name: "Dipti Ranjan Nayak",
    image:
      "https://i.ibb.co/ZzW0MGqC/Whats-App-Image-2025-08-31-at-00-25-17-4cb7a091.jpg",
    title: "Experienced Chess Coach & Player",
    description:
      "With over 8 years of playing experience and 3+ years of coaching experience, Dipti Ranjan Nayak is a highly accomplished chess coach and player.",
    achievements: [
      "🏆 National Team Event: 2nd Runner-up",
      "🥉 State School Championship: 3rd place",
      "🌍 KIIT International Chess Tournament: Multiple top 10 finishes",
      "🎯 Participated in various International Chess Tournaments",
    ],
    coaching: [
      "S.R. Chess Centre – 1 year",
      "Aryavant Academy, Khordha",
      "PM Shri Navodaya Vidyalaya",
    ],
    students: [
      {
        name: "Sanal Vaibhav",
        achievement: "U-9 State Championship, 3rd place",
        photo: "https://via.placeholder.com/100?text=Sanal",
      },
      {
        name: "Amruta Priyalaxmi",
        achievement: "U-13 State Champion",
        photo:
          "https://i.ibb.co/Swz8ZJPJ/Whats-App-Image-2025-08-31-at-00-25-49-960433d2.jpg",
      },
      {
        name: "PM Shri Navodaya Vidyalaya Team",
        achievement: "Bhopal Region Meet Champion",
        photo: "https://via.placeholder.com/100?text=Team",
      },
    ],
    fideId: "25638785",
  },
  {
    name: "Dikshant Dash",
    image:
      "https://i.ibb.co/5NmvSsm/Whats-App-Image-2025-08-31-at-00-30-25-b81d64b6.jpg",
    title: "International Chess Sensation",
    description:
      "With over 14 years of playing experience and a remarkable rating of 1800+, Dikshant Dash is a force to be reckoned with in the chess world.",
    achievements: [
      "🏆 U-7 National Champion: 7th place",
      "🏆 U-9 National Championship: 10th place",
      "🏆 U-11 National Championship: 7th place",
      "🎯 Multiple top 10 finishes in various age categories",
      "🥇 U-11 State Champion",
      "🥈 U-13 State Championship: 5th place",
      "🥈 U-15 State Championship: 5th place",
      "🌍 Commonwealth Junior Championship: 5th and 9th place",
      "🌍 KIIT International Tournament (Category B): 42nd place",
      "🌍 SOA International Tournament (Category B): 2nd place (rating category)",
    ],
    coaching: ["Independent Chess Coaching"],
    students: [],
    fideId: "25091433",
  },
  {
    name: "Pratyush Mohapatra",
    image:
      "https://i.ibb.co/CKw1bJf7/Whats-App-Image-2025-08-31-at-00-39-39-ef66f27e.jpg",
    title: "Renowned Chess Coach & Player",
    description:
      "With over 10 years of playing experience and a stellar coaching record, Pratyush Mohapatra is a highly sought-after chess coach.",
    achievements: [
      "🏆 SGFI U-17 Champion (2019)",
      "🏆 State School Champion (2018)",
      "🎯 Regularly featured in merit list of open state championships",
      "🎯 Selected for National U-17 (2022)",
      "🥇 Gold Medalist in Far East Zone Team CBSE Chess Clusters (2019)",
      "🥇 Champion in Far East Zone Team Chess Clusters (2021)",
      "🏆 National Schools: 8th in Merit List",
      "🏆 Represented State Schools in National Team Championship (SGFI 2019)",
      "🏆 Represented school in National Team Championship for CBSE Cluster (2022)",
      "🌍 Participated in Bhopal GM Tournament (2019)",
      "🌍 Participated in Delhi GM Tournament (2020)",
      "🌍 Merit list finish in KIIT International Chess Event (Category A)",
    ],
    coaching: [
      "Private Coaching",
      "Proven track record of improving students' skills",
    ],
    students: [],
    fideId: "25620673",
  },
  {
    name: "Majhi Fakir",
    image:
      "https://i.ibb.co/bMTxrk9d/Whats-App-Image-2025-08-31-at-00-48-29-b62b0359.jpg",
    title: "FIDE-Rated Chess Coach & Player",
    description:
      "With over 10 years of playing experience and a FIDE rating of 1900, Majhi Fakir is a highly accomplished chess player and coach.",
    achievements: [
      "🏆 Odisha Inter University Games 2024: Champion",
      "🥉 Odisha Senior State Championship 2023: 4th place",
      "🥉 Odisha Senior State Championship 2022: 5th place",
      "🥈 Odisha State Blitz Chess Championship 2023-24: 1st Runner-up",
      "🥉 Odisha State Rapid Chess Championship 2024-25: 2nd Runner-up",
      "🎯 60th National Chess Championship 2023: Participant",
      "🎯 Senior Team National Chess Championship 2024: Participant",
      "🎯 University National 2024: Participant",
      "🌍 SOA International FIDE Rating 2024: Champion (Category B)",
      "🌍 KIIT International Chess Festival 2021: 3rd place (Category C)",
      "🌍 All India FIDE Chess Rating Tournament 2025: 2nd place",
    ],
    coaching: ["Over 2 years of coaching experience"],
    students: [],
    fideId: "25712195",
  },
  {
    name: "Manindra Karjee",
    image:
      "https://i.ibb.co/k62M2sN7/Whats-App-Image-2025-08-31-at-00-51-47-eecaec59.jpg",
    title: "Experienced Chess Coach & Player",
    description:
      "With over 12 years of playing experience and a proven track record of successful students, Manindra Karjee is a highly accomplished chess coach and player.",
    achievements: [
      "🥈 SGFI U-17 Runners-up (2019)",
      "🥈 State School Runners-up (2018)",
      "🏆 RSP State Open Champion (2024)",
      "🥉 SGFI National (2019), Bronze Medalist (Board Category)",
      "🎯 East Zone University Team Chess Championship (2024): 4th Place",
      "🎯 National Team Chess Championship (2017): 4th Place",
      "🎯 Senior National Chess Championship (2024): Participant",
      "🎯 Senior National Team Chess Championship (2024): Participant",
      "🌍 Represented India in Asian Cities Team Chess Championship (2017)",
      "🌍 Participated in KIIT Chess Festival (2024), Category A",
    ],
    coaching: ["Proven track record of successful students"],
    students: [],
    fideId: "46690077",
  },
];

export default function Coaches() {
  const [open, setOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);

  const handleOpen = (coach) => {
    setSelectedCoach(coach);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCoach(null);
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center p-4 sm:p-6 bg-gradient-to-b from-zinc-50">
        <Typography
          variant="h4"
          className="text-center font-extrabold text-gray-900 pb-12 sm:mb-8"
        >
          Our{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
            Coaches
          </span>
        </Typography>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {coaches.map((coach, index) => (
            <Card
              key={index}
              className="rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2"
              sx={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1e293b, #0f172a)",
                border: "2px solid #3b82f6",
                padding: "10px",
                color: "white",
              }}
            >
              <CardMedia
                component="img"
                image={coach.image}
                alt={coach.name}
                sx={{
                  height: { xs: 280, sm: 220, md: 300, lg: 360 }, // more height in desktop
                  objectFit: "cover",
                  borderRadius: "15px",
                  border: "3px solid #3b82f6",
                }}
              />
              <CardContent className="text-center space-y-3">
                <Typography
                  variant="h6"
                  className="font-extrabold text-white"
                  gutterBottom
                >
                  {coach.name}
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-300 font-semibold"
                >
                  {coach.title}
                </Typography>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    background: "linear-gradient(135deg, #facc15, #3b82f6)",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    padding: "8px 20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #eab308, #2563eb)",
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => handleOpen(coach)}
                >
                  Know More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background: "linear-gradient(180deg, #1e293b, #0f172a)",
              border: "2px solid #3b82f6",
              p: { xs: 1, sm: 2 },
              color: "white",
            },
          }}
        >
          {selectedCoach && (
            <DialogContent className="flex flex-col items-center space-y-4">
              {/* Main Coach Photo */}
              <img
                src={selectedCoach.image}
                alt={selectedCoach.name}
                className="rounded-xl shadow-lg w-44 sm:w-56 border-4 border-blue-500"
              />
              {/* FIDE Photo */}
              {selectedCoach.fideId && (
                <img
                  src={`https://ratings.fide.com/pinfo?pid=${selectedCoach.fideId}`}
                  alt="FIDE Profile"
                  className="rounded-lg shadow-md w-32 border-2 border-yellow-400"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/150?text=No+FIDE+Photo";
                  }}
                />
              )}

              <Typography
                variant="h6"
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-400 to-indigo-400"
              >
                {selectedCoach.name}
              </Typography>
              <Typography
                variant="body1"
                className="text-center text-gray-300 font-medium"
              >
                {selectedCoach.description}
              </Typography>

              <div className="w-full space-y-3 mt-2 text-gray-200">
                <Typography
                  variant="subtitle1"
                  className="font-bold text-white"
                >
                  Achievements:
                </Typography>
                <ul className="list-disc pl-5">
                  {selectedCoach.achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>

                <Typography
                  variant="subtitle1"
                  className="font-bold text-white mt-3"
                >
                  Coaching Experience:
                </Typography>
                <ul className="list-disc pl-5">
                  {selectedCoach.coaching.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>

                <Typography
                  variant="subtitle1"
                  className="font-bold text-white mt-3"
                >
                  Students' Glory:
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {selectedCoach.students.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-4 bg-gray-800 rounded-lg p-3"
                    >
                      <img
                        src={s.photo}
                        alt={s.name}
                        className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover shadow-md"
                      />
                      <div>
                        <p className="font-semibold text-white">{s.name}</p>
                        <p className="text-gray-400 text-sm">{s.achievement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FIDE Profile Button */}
              {selectedCoach.fideId && (
                <Button
                  variant="contained"
                  component="a"
                  href={`https://ratings.fide.com/profile/${selectedCoach.fideId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    mt: 2,
                    borderRadius: "10px",
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2563eb, #0891b2)",
                    },
                  }}
                >
                  View FIDE Profile
                </Button>
              )}

              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  mt: 2,
                  borderRadius: "10px",
                  color: "#3b82f6",
                  fontWeight: "bold",
                  borderColor: "#3b82f6",
                  "&:hover": {
                    background: "#3b82f6",
                    color: "white",
                  },
                }}
              >
                Close
              </Button>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </>
  );
}
