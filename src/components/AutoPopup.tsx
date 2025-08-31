import React, { useState } from "react";
// ✨ Added a new icon for a premium touch
import {
  X,
  Mail,
  User,
  Phone,
  Calendar,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface AutoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Refined animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

// ✨ Self-contained SVG component for the chess knight
const ChessKnightArt = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M73.5 163.333H126.5"
      stroke="white"
      strokeOpacity="0.5"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M79.6667 136.667H120.333V163.333H79.6667V136.667Z"
      stroke="white"
      strokeOpacity="0.5"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M93.5 35C93.5 35 97.471 47.971 106 50.5C114.529 53.029 123 52.5 123 52.5C123 52.5 131.5 54 133 63.5C134.5 73 131.5 82 126.5 87C121.5 92 114.5 94.5 114.5 94.5C114.5 94.5 125.5 96.5 129.5 106.5C133.5 116.5 126.5 136.5 126.5 136.5H73.5C73.5 136.5 68.5 107.5 73.5 96.5C78.5 85.5 90.5 87 90.5 87C90.5 87 88.5 77.5 82.5 73C76.5 68.5 68.5 65.5 68.5 65.5C68.5 65.5 63.5 62.5 63.5 55.5C63.5 48.5 68.5 41.5 68.5 35C68.5 35 77.1667 33.3333 82.5 35C87.8333 36.6667 93.5 35 93.5 35Z"
      stroke="white"
      strokeOpacity="0.9"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M96 65.5C98.5 63.5 100 58.5 99 56.5C98 54.5 95 56.5 95 56.5"
      stroke="white"
      strokeOpacity="0.9"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AutoPopup: React.FC<AutoPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    age: "",
    role: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Premium form submitted:", formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormComplete =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.age &&
    formData.role;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className=" fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-blue-500 rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden border border-slate-200/30"
          >
            {/* 🎨 PREMIUM LEFT SIDE: New look with SVG Art */}
            <div className="hidden md:block md:w-1/2 p-10 relative overflow-hidden bg-gradient-to-br from-[#1c1f2b] to-[#12141d]">
              <div className="relative z-10 flex flex-col justify-center h-full text-center items-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="w-40 h-40 mb-6"
                >
                  <ChessKnightArt />
                </motion.div>
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl font-bold text-white leading-tight"
                >
                  Your Next Move is Your Best Move
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-slate-400 mt-4 max-w-sm text-sm"
                >
                  Join an elite community of players and coaches on the premier
                  platform for chess mastery.
                </motion.p>
              </div>
            </div>

            {/* Right side with the form */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col bg-slate-50">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col h-full"
              >
                {/* Header */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Book Your Free Demo
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Start your journey to chess mastery!
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full flex-shrink-0 text-slate-500 hover:bg-slate-200/80 hover:text-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 mt-6 flex-grow"
                >
                  {/* Name */}
                  <motion.div variants={itemVariants} className="space-y-1.5">
                    <Label
                      htmlFor="popup-name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="popup-name"
                        type="text"
                        placeholder="e.g. Magnus Carlsen"
                        className="pl-10 bg-white"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="space-y-1.5">
                    <Label
                      htmlFor="popup-email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="popup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 bg-white"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </motion.div>

                  {/* Phone Number */}
                  <motion.div variants={itemVariants} className="space-y-1.5">
                    <Label
                      htmlFor="popup-phone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) =>
                          handleInputChange("countryCode", value)
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-white">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        {/* ✅ FIX: Added z-[100] to ensure the dropdown appears on top of the popup */}
                        <div className="bg-black ">
                          {" "}
                          <SelectContent className="bg-slate-900  text-slate-50 border-slate-700">
                            <SelectItem
                              value="+91"
                              className=" bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇮🇳</span>
                                <span>IN +91</span>
                              </div>
                            </SelectItem>

                            <SelectItem
                              value="+44"
                              className="bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇬🇧</span>
                                <span>UK +44</span>
                              </div>
                            </SelectItem>

                            <SelectItem
                              value="+1"
                              className="bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇺🇸</span>
                                <span>US +1</span>
                              </div>
                            </SelectItem>

                            <SelectItem
                              value="+1"
                              className="bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇨🇦</span>
                                <span>Canada +1</span>
                              </div>
                            </SelectItem>

                            <SelectItem
                              value="+86"
                              className="bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇨🇳</span>
                                <span>China +86</span>
                              </div>
                            </SelectItem>

                            <SelectItem
                              value="+977"
                              className="bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇳🇵</span>
                                <span>Nepal +977</span>
                              </div>
                            </SelectItem>

                            <SelectItem
                              value="+880"
                              className="bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇧🇩</span>
                                <span>Bangladesh +880</span>
                              </div>
                            </SelectItem>

                            <SelectItem
                              value="+852"
                              className="bg-black text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span>🇭🇰</span>
                                <span>Hong Kong +852</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </div>
                      </Select>
                      <div className="relative flex-grow">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="popup-phone"
                          type="number"
                          placeholder="98765 43210"
                          className="pl-10 bg-white"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* ✨ Grid for Age & Role */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Age */}
                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <Label
                        htmlFor="popup-age"
                        className="text-sm font-medium text-slate-700"
                      >
                        Your Age
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="popup-age"
                          type="number"
                          placeholder="e.g. 18"
                          className="pl-10 bg-white"
                          value={formData.age}
                          onChange={(e) =>
                            handleInputChange("age", e.target.value)
                          }
                        />
                      </div>
                    </motion.div>
                    {/* Role */}
                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">
                        Join as a
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleInputChange("role", value)
                        }
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Choose your role" />
                        </SelectTrigger>
                        {/* ✅ FIX: Added z-[100] here as well for consistency */}
                        <SelectContent className="">
                          <SelectItem value="student">🎯 Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="!mt-6 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-14 font-bold text-base text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/30 transform transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={!isFormComplete}
                    >
                      Book My Free Trial
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  variants={itemVariants}
                  className="text-xs text-center text-slate-500 mt-6 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />{" "}
                  <span>Your data is safe and encrypted.</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoPopup;
