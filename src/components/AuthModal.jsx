// Authentication Modal Component for PawnRace Chess Academy
// Handles user login and registration with role selection

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Lock, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Authentication modal with login and registration tabs
function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });

  // Registration form state
  const [registrationFormData, setRegistrationFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  // Handle login form submission
  async function handleLoginSubmit(event) {
    event.preventDefault();
    try {
      await login(loginFormData.email, loginFormData.password, loginFormData.role);
      toast({
        title: "Login successful!",
        description: "Welcome back to PawnRace.",
      });
      onClose();
      navigate(loginFormData.role === 'student' ? '/student-dashboard' : '/coach-dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  }

  // Handle registration form submission
  async function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    // Check if passwords match
    if (registrationFormData.password !== registrationFormData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await register(
        registrationFormData.name, 
        registrationFormData.email, 
        registrationFormData.password, 
        registrationFormData.role
      );
      toast({
        title: "Registration successful!",
        description: "Welcome to PawnRace! Let's start your chess journey.",
      });
      onClose();
      navigate(registrationFormData.role === 'student' ? '/student-dashboard' : '/coach-dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Update login form data
  function updateLoginData(field, value) {
    setLoginFormData(prev => ({ ...prev, [field]: value }));
  }

  // Update registration form data
  function updateRegistrationData(field, value) {
    setRegistrationFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-gradient">Welcome to PawnRace</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={loginFormData.email}
                    onChange={(e) => updateLoginData('email', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginFormData.password}
                    onChange={(e) => updateLoginData('password', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="login-role">Login as</Label>
                <Select 
                  value={loginFormData.role} 
                  onValueChange={(value) => updateLoginData('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full btn-hero" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={registrationFormData.name}
                    onChange={(e) => updateRegistrationData('name', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={registrationFormData.email}
                    onChange={(e) => updateRegistrationData('email', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="register-role">I want to join as</Label>
                <Select
                  value={registrationFormData.role}
                  onValueChange={(value) => updateRegistrationData('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registrationFormData.password}
                    onChange={(e) => updateRegistrationData('password', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registrationFormData.confirmPassword}
                    onChange={(e) => updateRegistrationData('confirmPassword', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full btn-hero" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;