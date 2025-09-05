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
  LucideIcon,
} from "lucide-react";

// --- COACH MENU ITEMS ---
const coachMenuItems = [
  { name: "My Students", icon: Users, color: "from-blue-500 to-indigo-600" },
  { name: "Classes", icon: Calendar, color: "from-green-400 to-emerald-600" },
  { name: "Assignments", icon: ClipboardCheck, color: "from-pink-500 to-rose-500" },
  { name: "Test Results", icon: FileBarChart, color: "from-yellow-400 to-orange-500" },
  { name: "Tournaments", icon: Trophy, color: "from-purple-500 to-indigo-500" },
  { name: "Chats", icon: MessageSquare, color: "from-cyan-400 to-blue-500" },
  { name: "Database", icon: Database, color: "from-orange-400 to-red-500" },
  { name: "Settings", icon: Settings, color: "from-gray-400 to-gray-600" },
].map((item) => ({ ...item, path: item.name.toLowerCase().replace(/\s+/g, "-") }));

// MenuCard Component
const MenuCard = ({ name, icon: Icon, color, index, onClick }) => {
  return (
    <motion.div
      role="button"
      aria-label={`Navigate to ${name}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center group"
    >
      <div
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-all duration-300 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28`}
      >
        <Icon className="stroke-white stroke-[2px] w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
      </div>
      <p className="text-gray-200 mt-3 sm:mt-4 font-semibold text-center transition-all duration-300 group-hover:text-white text-sm sm:text-base lg:text-lg">
        {name}
      </p>
    </motion.div>
  );
};

// CoachDashboard Component
const CoachDashboard = () => {
  const navigate = useNavigate();
  const handleMenuClick = (path) => {
    navigate(`/coach-dashboard/${path}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1a173d] to-black"></div>

      {/* Foreground */}
      <div className="relative z-10">
        <DashboardNavbar />
        <main className="pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome Coach!
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your students and activities below.
              </p>
            </div>

            {/* Menu Grid */}
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
