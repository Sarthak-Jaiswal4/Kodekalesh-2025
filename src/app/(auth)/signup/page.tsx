'use client'
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Brain, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // shadcn/ui tabs
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const SPECIALTY_OPTIONS = [
  'Civil-Corporate',
  'Criminal-Appellate',
  'Family Law',
  'Intellectual Property',
  'Tax Law',
  'Labor Law',
  'Others'
];

const defaultClerk = {
  name: "",
  email: "",
  password: "",
  agreeToTerms: false,
};
const defaultJudge = {
  name: "",
  email: "",
  password: "",
  specialties: [],
  agreeToTerms: false,
};

const AuthPages = () => {
  const [role, setRole] = useState<'clerk' | 'judge'>('judge');
  const [issubmitting, setIssubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [clerkData, setClerkData] = useState({ ...defaultClerk });
  const [judgeData, setJudgeData] = useState({ ...defaultJudge });

  const router = useRouter();

  const handleClerkSubmit = async () => {
    if (!clerkData.name || !clerkData.email || !clerkData.password) return;
    if (!clerkData.agreeToTerms) {
      alert('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setIssubmitting(true);
    try {
      const res = await axios.post('/api/signIn', {
        ...clerkData,
        role: "clerk",
      });
      if (res.data.status === 200) {
        // You probably want to proceed to verify here as in the original code
        sessionStorage.setItem(
          "verifycode",
          JSON.stringify({
            userId: res.data.createdUser._id,
            email: res.data.createdUser.email,
          })
        );
        await axios.post("/api/send", {
          email: clerkData.email,
          verificationCode: res.data.createdUser.verificationcode,
        });
        router.push('/verify');
      } else {
        throw new Error("Signup error");
      }
    } catch (error) {
      console.log(error)
      alert("Signup failed.");
    }
    setIssubmitting(false);
  };

  const handleJudgeSubmit = async () => {
    if (!judgeData.name || !judgeData.email || !judgeData.password) return;
    if (!judgeData.specialties[0]) {
      alert("Please select specialty.");
      return;
    }
    if (!judgeData.agreeToTerms) {
      alert('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setIssubmitting(true);
    try {
      const res = await axios.post('/api/signIn', {
        ...judgeData,
        role: "judge",
        specialties:
          judgeData.specialties.length === 1
            ? judgeData.specialties[0]
            : judgeData.specialties,
      });
      if (res.data.status === 200) {
        sessionStorage.setItem(
          "verifycode",
          JSON.stringify({
            userId: res.data.createdUser._id,
            email: res.data.createdUser.email,
          })
        );
        await axios.post("/api/send", {
          email: judgeData.email,
          verificationCode: res.data.createdUser.verificationcode,
        });
        router.push('/verify');
      } else {
        throw new Error("Signup error");
      }
    } catch (error) {
      alert("Signup failed.");
    }
    setIssubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl shadow-2xl">
              <Brain className="w-8 h-8 text-[#F4F1ED]" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-400 ml-2 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-[#F4F1ED] mb-2">
            Join RAG AI
          </h1>
          <p className="text-gray-400">
            Create your account to start your AI journey
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          <Tabs defaultValue={role} className="" onValueChange={tab => setRole(tab as 'clerk' | 'judge')}>
            <TabsList className="w-full bg-gray-800/60 rounded-xl mb-7 grid grid-cols-2">
              <TabsTrigger
                value="clerk"
                className={cn(
                  "w-full text-lg font-semibold border-b-2 transition-colors",
                  role === "clerk" ? "border-blue-400 text-blue-400 bg-transparent" : "border-transparent text-gray-400 bg-transparent"
                )}
              >
                Clerk
              </TabsTrigger>
              <TabsTrigger
                value="judge"
                className={cn(
                  "w-full text-lg font-semibold border-b-2 transition-colors",
                  role === "judge" ? "border-blue-400 text-blue-400 bg-transparent" : "border-transparent text-gray-400 bg-transparent"
                )}
              >
                Judge
              </TabsTrigger>
            </TabsList>
            {/* -------- CLERK TAB -------- */}
            <TabsContent value="clerk">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault(); handleClerkSubmit();
                }}
              >
                {/* Name field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={clerkData.name}
                      onChange={e => setClerkData(d => ({ ...d, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={clerkData.email}
                      onChange={e => setClerkData(d => ({ ...d, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={clerkData.password}
                      onChange={e => setClerkData(d => ({ ...d, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#F4F1ED] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Agree to Terms */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="clerk-agreeToTerms"
                    checked={clerkData.agreeToTerms}
                    onChange={e => setClerkData(d => ({ ...d, agreeToTerms: e.target.checked }))}
                    className="accent-blue-600 w-5 h-5 mt-1 rounded border-gray-600 bg-gray-800/50"
                    required
                  />
                  <label htmlFor="clerk-agreeToTerms" className="text-sm text-gray-300 select-none">
                    I agree to the{' '}
                    <a href="#" className="underline text-blue-400 hover:text-blue-300">Terms of Service</a>{" "}and{" "}
                    <a href="#" className="underline text-blue-400 hover:text-blue-300">Privacy Policy</a>
                  </label>
                </div>

                <button
                  disabled={issubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-[#F4F1ED] py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  {issubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Clerk Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </TabsContent>

            {/* -------- JUDGE TAB -------- */}
            <TabsContent value="judge">
              <form
                className="space-y-6"
                onSubmit={e => {
                  e.preventDefault(); handleJudgeSubmit();
                }}
              >
                {/* Name field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={judgeData.name}
                      onChange={e => setJudgeData(d => ({ ...d, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={judgeData.email}
                      onChange={e => setJudgeData(d => ({ ...d, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={judgeData.password}
                      onChange={e => setJudgeData(d => ({ ...d, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#F4F1ED] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {/* Specialties field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Specialties <span className="text-gray-400">(Select one)</span>
                  </label>
                  <div>
                    <div className="w-full">
                      <Select
                        value={judgeData.specialties[0] || ""}
                        onValueChange={(val: string) =>
                          setJudgeData(d => ({ ...d, specialties: [val] as typeof d.specialties }))
                        }
                      >
                        <SelectTrigger className="w-full bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-6">
                          {judgeData.specialties.length > 0
                            ? judgeData.specialties.join(", ")
                            : <span className="text-gray-400">Select specialty...</span>
                          }
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white">
                          {SPECIALTY_OPTIONS.map(option => (
                            <SelectItem key={option} value={option} className="py-2">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      E.g., 'Civil-Corporate', 'Criminal-Appellate', 'Family Law'
                    </div>
                  </div>
                </div>
                {/* Agree to Terms */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="judge-agreeToTerms"
                    checked={judgeData.agreeToTerms}
                    onChange={e => setJudgeData(d => ({ ...d, agreeToTerms: e.target.checked }))}
                    className="accent-blue-600 w-5 h-5 mt-1 rounded border-gray-600 bg-gray-800/50"
                    required
                  />
                  <label htmlFor="judge-agreeToTerms" className="text-sm text-gray-300 select-none">
                    I agree to the{' '}
                    <a href="#" className="underline text-blue-400 hover:text-blue-300">Terms of Service</a>{" "}and{" "}
                    <a href="#" className="underline text-blue-400 hover:text-blue-300">Privacy Policy</a>
                  </label>
                </div>

                <button
                  disabled={issubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-[#F4F1ED] py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  {issubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Judge Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">or</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mt-6">
            <button
              type="button"
              onClick={() => signIn("google", { redirectTo: "/" })}
              className="w-full bg-gray-800/50 border border-gray-600 text-[#F4F1ED] py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-700/50 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;