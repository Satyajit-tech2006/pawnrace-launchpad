import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";



const coaches = [
  {
    name: "Tapan Badamundi",
    image: "https://i.ibb.co/RGGxB5kz/455e7661-1fc9-4385-94c2-717bbda15d27.jpg",
    title: "FIDE Rated Chess Coach & Player",
    description:
      "Tapan Badamundi is a highly respected FIDE-rated chess player and coach with a peak FIDE rating of 2000. Known for his deep positional understanding and tournament experience, he brings elite-level training to his students.",
    achievements: [
      "♟️ FIDE Rating: 2000",
      "🏆 Multiple National & International Tournament Performances",
      "🎯 Known for strong positional & endgame mastery",
      "🌍 Active participant in FIDE-rated events",
    ],
    coaching: [
      "Professional Chess Coaching",
      "Advanced Tournament Preparation",
      "Opening Repertoire & Endgame Training",
    ],
    students: [],
    fideId: "XXXXXXX",
  },
  {
    name: "Dikshant Dash",
    image:
      "https://i.ibb.co/21kBv1dK/Whats-App-Image-2025-09-08-at-19-51-53-ab248d0c.jpg",
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
      "https://i.ibb.co/DX7xbkf/Whats-App-Image-2025-09-07-at-03-33-15-a8445611.jpg",
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
  {
    name: "Anshuman Barik",
    image:
      "https://i.ibb.co/Cp9Fst6H/Whats-App-Image-2025-09-07-at-03-25-57-01220eea.jpg",
    title:
      "International Rated Chess Player | FIDE Arena International Master & Certified Instructor",
    description:
      "With over 5 years of playing experience and proven coaching expertise, Anshuman Barik is a passionate and certified chess instructor recognized by AICF & FIDE.",
    achievements: [
      "🏆 Represented Nationals SGFI (School Games Federation of India) 3 times",
      "🏆 Awarded Champion’s Trophy in U-17 Open UT Chess Championship",
      "🥈 Secured Runners-up at Rofel Grims Open Chess Championship (twice)",
      "🏅 Awarded by Lions English School as Chess Champion & Top Rank holder (3 years)",
      "⭐ Best Player in Union Territory of DNH & Daman & Diu (2022), felicitated by the Administrator",
      "🎓 Current Captain of Ravenshaw University Chess Team (Odisha)",
      "🎯 Played in multiple National & International Rated Chess Tournaments across India",
      "🌍 Represented National & International Chess Events",
    ],
    coaching: [
      "1 year of professional coaching with Genius Kid (Online & Offline)",
      "Beginner & Intermediate level training expertise",
      "Focused training on Openings & Middle Game strategies",
      "Guided by expert mentorship programs",
    ],
    students: [],
    fideId: "48769738",
    aicfId: "1700169D2022",
    fideRating: "1620",
    rapidRating: "1687",
    languages: ["English", "Hindi", "Odia"],
  },
  {
    name: "Dipti Ranjan Nayak",
    image: "https://i.ibb.co/7J8hYpj0/857e4e5d-6b53-4911-b91e-da1a0635e5b0.jpg",
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-4 sm:p-6 flex flex-col items-center">
      <Typography
        variant="h4"
        className="text-center font-extrabold text-gray-900 mb-8 pt-4"
      >
        Our <span className="text-black">Star Coaches</span>
      </Typography>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {coaches.map((coach, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            sx={{
              borderRadius: "20px",
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              border: "2px solid #EAB308",
              padding: "12px",
              color: "white",
            }}
          >
            <div>
              <CardMedia
                component="img"
                image={coach.image}
                alt={coach.name}
                sx={{
                  height: { xs: 280, sm: 240, md: 300 },
                  objectFit: "cover",
                  borderRadius: "15px",
                  border: "2px solid #EAB308",
                }}
              />
              <CardContent className="text-center space-y-2 px-2 py-4">
                <Typography
                  variant="h6"
                  className="font-extrabold text-white"
                >
                  {coach.name}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-300 font-semibold"
                >
                  {coach.title}
                </Typography>
              </CardContent>
            </div>

            <div className="text-center pb-2">
              <Button
                variant="contained"
                size="medium"
                sx={{
                  background: "#EAB308",
                  color: "black",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  padding: "8px 24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  "&:hover": {
                    background: "#CA8A04",
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => handleOpen(coach)}
              >
                Know More
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Fixed Scrollable Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "linear-gradient(180deg, #1e293b, #0f172a)",
            border: "2px solid #EAB308",
            color: "white",
            maxHeight: "90vh", // Key fix: Viewport overflow restrict karega
            margin: "16px",
          },
        }}
      >
        {selectedCoach && (
          <div className="relative flex flex-col max-h-[90vh]">
            {/* Top Close Icon */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                color: "#EAB308",
                backgroundColor: "rgba(0,0,0,0.4)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                zIndex: 10,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Scrollable Content Container */}
            <DialogContent className="overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
              <div className="flex justify-center pt-2">
                <img
                  src={selectedCoach.image}
                  alt={selectedCoach.name}
                  className="rounded-xl shadow-lg w-40 sm:w-48 h-48 sm:h-56 object-cover border-4 border-yellow-500"
                />
              </div>

              <Typography
                variant="h5"
                className="font-extrabold text-yellow-400 text-center"
              >
                {selectedCoach.name}
              </Typography>

              <Typography
                variant="body2"
                className="text-center text-gray-300 font-medium leading-relaxed"
              >
                {selectedCoach.description}
              </Typography>

              <div className="w-full space-y-3 mt-4 text-gray-200">
                {/* Achievements List */}
                {selectedCoach.achievements?.length > 0 && (
                  <div>
                    <Typography
                      variant="subtitle1"
                      className="font-bold text-yellow-400 mb-1"
                    >
                      Key Achievements:
                    </Typography>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-200">
                      {selectedCoach.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Coaching Experience */}
                {selectedCoach.coaching?.length > 0 && (
                  <div className="pt-2">
                    <Typography
                      variant="subtitle1"
                      className="font-bold text-yellow-400 mb-1"
                    >
                      Coaching Experience:
                    </Typography>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-200">
                      {selectedCoach.coaching.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Student Glory Section */}
                {selectedCoach.students?.length > 0 && (
                  <div className="pt-2">
                    <Typography
                      variant="subtitle1"
                      className="font-bold text-yellow-400 mb-2"
                    >
                      Students' Glory:
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCoach.students.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-lg p-2.5"
                        >
                          <img
                            src={s.photo}
                            alt={s.name}
                            className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {s.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {s.achievement}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-slate-700/60">
                {selectedCoach.fideId && (
                  <Button
                    variant="contained"
                    component="a"
                    href={`https://ratings.fide.com/profile/${selectedCoach.fideId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderRadius: "10px",
                      fontWeight: "bold",
                      background: "#EAB308",
                      color: "black",
                      textTransform: "none",
                      "&:hover": { background: "#CA8A04" },
                    }}
                  >
                    View FIDE Profile
                  </Button>
                )}

                <Button
                  onClick={handleClose}
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    color: "#EAB308",
                    fontWeight: "bold",
                    borderColor: "#EAB308",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#CA8A04",
                      backgroundColor: "rgba(234, 179, 8, 0.1)",
                    },
                  }}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </div>
        )}
      </Dialog>
    </div>
  );
}