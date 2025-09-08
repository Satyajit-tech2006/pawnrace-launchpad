import React, { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.tsx";
import { motion, AnimatePresence } from "framer-motion";

// Props
interface AutoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Animation Variants
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
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// Chess Pawn SVG
const ChessPawnIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className={className}
    fill="currentColor"
  >
    <path d="M320 96c0-53-43-96-96-96S128 43 128 96s43 96 96 96 96-43 96-96zM224 224c-79.5 0-144 64.5-144 144v32h288v-32c0-79.5-64.5-144-144-144zm-96 96c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v32H128v-32zm192 64H128v64h192v-64z" />
  </svg>
);

const AutoPopup: React.FC<AutoPopupProps> = ({ isOpen, onClose }) => {
  // The form data is no longer needed as we are redirecting to a Google Form.
  // We keep the state just to allow the inputs to be typed in, preserving the UI.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    age: "",
    role: "student",
  });

  // Handle form input changes (to allow typing)
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // The new handleSubmit function simply opens the Google Form link.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from submitting in the traditional way
    
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd368-GnfJjgbQdIeAiU6ro68983N8OPo6upy5n0kDI9YClkA/viewform?usp=dialog";
    
    // Open the URL in a new tab
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
    
    onClose(); // Close the popup after opening the link
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-transparent backdrop-blur-lg z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0b0e17] rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden border border-yellow-400/20"
          >
            {/* Left side */}
            <div className="hidden md:flex md:w-1/2 p-10 relative bg-gradient-to-br from-[#12141d] to-[#0b0e17] flex-col justify-center items-center text-center">
              <motion.div className="w-44 h-44 mb-6">
                <ChessPawnIcon className="text-yellow-400" />
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-yellow-400 leading-tight"
              >
                Your Next Move is Golden ♟️
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-slate-300 mt-4 max-w-sm text-sm"
              >
                Join our elite chess academy and book your free demo today.
              </motion.p>
            </div>

            {/* Right side form */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col bg-[#10131d]">
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
                    <h2 className="text-2xl font-bold text-white">
                      Book Your Free Demo
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Start your journey to chess mastery.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition"
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
                    <Label className="text-sm font-medium text-slate-300">
                      Full Name
                    </Label>
                    <div className="relative"> 
                      <Input
                        placeholder="e.g. Magnus Carlsen"
                        className="pl-4 bg-black border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-yellow-400 transition-all"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="you@gmail.com"
                        className="pl-4 bg-black border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-yellow-400 transition-all"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={itemVariants} className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Phone Number
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) =>
                          handleInputChange("countryCode", value)
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-black border border-slate-700 text-white">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-slate-700">
                          {/* Options remain the same */}
                          <SelectItem value="+91">🇮🇳 IN +91</SelectItem>
                          <SelectItem value="+1">🇺🇸 US +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 UK +44</SelectItem>
                          <SelectItem value="+977">🇳🇵 NP +977</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-grow">
                        <Input
                          type="number"
                          placeholder="98765 43210"
                          className="pl-4 bg-black border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-yellow-400 transition-all"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Age & Role */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-300">
                        Your Age
                      </Label>
                      <div className="relative"> 
                        <Input
                          type="number"
                          placeholder="e.g. 18"
                          className="pl-4 bg-black border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-yellow-400 transition-all"
                          value={formData.age}
                          onChange={(e) =>
                            handleInputChange("age", e.target.value)
                          }
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-300">
                        Join as a
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleInputChange("role", value)
                        }
                      >
                        <SelectTrigger className="w-full bg-[#0d111a] border border-slate-700 text-white">
                          <SelectValue placeholder="Choose your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-slate-700">
                          <SelectItem value="student">🎯 Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="!mt-6 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-14 font-bold text-lg text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] rounded-xl"
                    >
                      Book My Free Trial
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  variants={itemVariants}
                  className="text-xs text-center text-slate-400 mt-6 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-yellow-400" />
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

