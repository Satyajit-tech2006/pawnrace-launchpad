import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, Mail, Lock, Crown, GraduationCap, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { countries } from "../data/countries.js";

const ChessPawnIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M320 96c0-53-43-96-96-96S128 43 128 96s43 96 96 96 96-43 96-96zM224 224c-79.5 0-144 64.5-144 144v32h288v-32c0-79.5-64.5-144-144-144zm-96 96c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v32H128v-32zm192 64H128v64h192v-64z" />
  </svg>
);

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
    role: "student",
    countryCode: "+91",
    number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
    setFormData({
      email: "",
      password: "",
      username: "",
      fullname: "",
      role: "student",
      countryCode: "+91",
      number: "",
    });
  }, [isOpen, initialMode]);

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const loggedInUser = await login(formData.email, formData.password);
        toast.success(`Welcome back, ${loggedInUser.fullname}!`);
        navigate(loggedInUser.role === "coach" ? "/coach-dashboard" : "/student-dashboard");
        onClose();
      } else {
        await register(
          formData.username,
          formData.fullname,
          formData.email,
          formData.password,
          formData.role,
          formData.countryCode,
          formData.number
        );
        toast.success("Account created successfully! Please log in.");
        setMode("login");
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 30 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Blur */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-md bg-gradient-to-b from-gray-950 via-black to-gray-900 border border-yellow-500/20 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.2)] overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-yellow-400 transition-colors z-10"
            >
              <X size={22} />
            </button>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                >
                  <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                    {mode === "login" ? (
                      <User className="w-8 h-8 text-yellow-400" />
                    ) : (
                      <ChessPawnIcon className="w-8 h-8 text-yellow-400" />
                    )}
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-white">
                  {mode === "login" ? "Welcome Back" : "Join PawnRace"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mode === "login"
                    ? "Continue your chess journey"
                    : "Start your chess mastery today"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "signup" && (
                  <>
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={(e) => handleInputChange(e, "username")}
                          required
                          className="pl-12 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="fullname"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullname}
                          onChange={(e) => handleInputChange(e, "fullname")}
                          required
                          className="pl-12 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange(e, "email")}
                      required
                      className="pl-12 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange(e, "password")}
                      required
                      className="pl-12 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                    >
                      {/* {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-gray-300">Phone Number</Label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => handleInputChange(e, "countryCode")}
                        className="w-1/3 bg-gray-800 border border-gray-700 rounded-xl text-white px-2"
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.dialCode} className="bg-gray-800">
                            {c.flag} {c.dialCode}
                          </option>
                        ))}
                      </select>
                      <div className="relative w-2/3">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="number"
                          type="tel"
                          placeholder="9876543210"
                          value={formData.number}
                          onChange={(e) => handleInputChange(e, "number")}
                          required
                          className="pl-12 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Role Selection */}
                {mode === "signup" && (
                  <div className="space-y-3">
                    <Label className="text-gray-300">I want to join as:</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "student" })}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
                          formData.role === "student"
                            ? "border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                            : "border-gray-700 bg-gray-800 text-gray-300 hover:border-yellow-400/40"
                        }`}
                      >
                        <GraduationCap className="w-5 h-5 mb-2" />
                        <span className="text-sm font-medium">Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "coach" })}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
                          formData.role === "coach"
                            ? "border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                            : "border-gray-700 bg-gray-800 text-gray-300 hover:border-yellow-400/40"
                        }`}
                      >
                        <Crown className="w-5 h-5 mb-2" />
                        <span className="text-sm font-medium">Coach</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:shadow-[0_0_20px_rgba(255,215,0,0.7)] transition-all"
                >
                  {isSubmitting
                    ? mode === "login"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>

              {/* Switch Mode */}
              <div className="text-center pt-4 border-t border-gray-800">
                <p className="text-gray-400">
                  {mode === "login" ? "" : "Already have an account?"}
                  <button
                    onClick={() => handleSwitchMode(mode === "login" ? "signup" : "login")}
                    className="ml-2 text-yellow-400 hover:underline font-medium"
                  >
                    {mode === "login" ? "" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
