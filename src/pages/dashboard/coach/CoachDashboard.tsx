import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import {
  Users,
  Calendar,
  ClipboardCheck,
  FileBarChart,
  Trophy,
  MessageSquare,
  Settings,
  Database,
  Gamepad,
  Brain, // Brain icon import kar rahe hain
} from "lucide-react";

// --- COACH MENU ITEMS ---
const coachMenuItems = [
  {
    name: "My Students",
    icon: Users,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Classes",
    icon: Calendar,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Assignments",
    icon: ClipboardCheck,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Test Results",
    icon: FileBarChart,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Tournaments",
    icon: Trophy,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Chats",
    icon: MessageSquare,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Database",
    icon: Database,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  // Naya "Play Game" button yahan add kiya hai
  {
    name: "Play Game",
    icon: Gamepad, // Aap icon change kar sakte hain
    color: "bg-gradient-to-br from-yellow-400 to-orange-500", // Alag color diya hai
  },
].map((item) => ({
  ...item,
  path: item.name.toLowerCase().replace(/\s+/g, "-"),
}));

// MenuCard Component (Ismein koi change nahi)
const MenuCard = ({ name, icon: Icon, color, index, onClick }) => {
  return (
    <motion.div
      role="button"
      aria-label={`Maps to ${name}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center group"
    >
      <div
        className={`flex items-center justify-center rounded-2xl ${color} shadow-xl group-hover:shadow-2xl transition-all duration-300 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 backdrop-blur-md bg-opacity-90 border border-white/10`}
      >
        <Icon className="stroke-white stroke-[2px] w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
      </div>
      <p className="text-gray-300 mt-3 sm:mt-4 font-semibold text-center transition-all duration-300 group-hover:text-white text-sm sm:text-base lg:text-lg">
        {name}
      </p>
    </motion.div>
  );
};

// CoachDashboard Component
const CoachDashboard = () => {
  const navigate = useNavigate();

  // ***** YAHAN BADLAAV KIYA GAYA HAI *****
  const handleMenuClick = (path) => {
    if (path === "play-game") {
      // Jab "Play Game" par click ho, toh lobby page par jao
      navigate(`/play`);
    } else {
      // Baaki buttons pehle jaise hi kaam karenge
      navigate(`/coach-dashboard/${path}`);
    }
  };
  // ****************************************

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-black"></div>

      {/* Foreground */}
      <div className="relative z-10">
        <DashboardNavbar />
        <main className="pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Welcome Coach!
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your students, classes, and activities below.
              </p>
            </div>

            {/* Menu Grid (Ismein koi change nahi) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-10"
            >
              {coachMenuItems.map((item, index) => (
                <MenuCard
                  key={item.path}
                  name={item.name}
                  icon={item.icon}
                  color={item.color}
                  index={index}
                  onClick={() => handleMenuClick(item.path)}
                />
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachDashboard;