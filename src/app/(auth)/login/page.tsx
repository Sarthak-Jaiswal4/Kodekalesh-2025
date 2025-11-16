'use client'
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Brain, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, SignInResponse } from "next-auth/react"
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const SPECIALTY_OPTIONS = [
  'Civil-Corporate',
  'Criminal-Appellate',
  'Family Law',
  'Intellectual Property',
  'Tax Law',
  'Labor Law',
  'Others'
];

const Page = () => {
  const [issubmitting, setissubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    specialties: [] as string[],
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"clerk" | "judge">("judge");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSpecialtyChange = (value: string) => {
    if (activeTab === 'judge') {
      setFormData((prev) => ({
        ...prev,
        specialties: [value],
      }));
    }
  };

  const handleSubmit = async () => {
    const submitData = {
      ...formData,
      specialties: activeTab === 'judge' ? formData.specialties : [],
      role: activeTab
    };

    try {
      setissubmitting(true)
      const signInAttempt = await signIn('credentials', {
        identifier: submitData.identifier,
        password: submitData.password,
        specialties: submitData.specialties,
        role: submitData.role,
        redirect: false,
        callbackUrl: '/',
      }) as SignInResponse;
      if (signInAttempt?.status === 200) {
        setissubmitting(false)
        router.push('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        setissubmitting(false)
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setissubmitting(false)
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-4 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to continue your AI experience
          </p>
        </div>
        {/* Auth Card */}
        <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as "clerk" | "judge")} className="w-full">
            <TabsList className="w-full flex mb-4 bg-transparent border-b border-gray-700 px-0">
              <TabsTrigger
                value="clerk"
                className={cn(
                  "w-full py-4 text-lg font-semibold border-b-2 transition-colors",
                  activeTab === "clerk" ? "border-blue-400 text-blue-400 bg-transparent" : "border-transparent text-gray-400 bg-transparent"
                )}
              >
                Clerk
              </TabsTrigger>
              <TabsTrigger
                value="judge"
                className={cn(
                  "w-full py-4 text-lg font-semibold border-b-2 transition-colors",
                  activeTab === "judge" ? "border-blue-400 text-blue-400 bg-transparent" : "border-transparent text-gray-400 bg-transparent"
                )}
              >
                Judge
              </TabsTrigger>
            </TabsList>
            {/* Shared content - OAuth & divider */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-800/50 border border-gray-600 text-[#F4F1ED] py-6 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                onClick={() => signIn("google", { redirectTo: "/" })}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>
            <div className="my-2 flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-gray-800/50 border border-gray-600 text-[#F4F1ED] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-700/50 hover:text-white transition-all duration-200">
                    <span>For Recruiter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border border-gray-700 text-gray-100 min-w-[170px]">
                  <DropdownMenuLabel>Sample</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Email - sarthakjazz8@gmail.com</DropdownMenuItem>
                  <DropdownMenuItem>Password - sarthak</DropdownMenuItem>
                  <DropdownMenuItem>Specialties - Tax Law</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator className="my-2 bg-white/10" />
            {/* Tab panes */}
            <TabsContent value="clerk">
              <form className="space-y-6" onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}>
                <div className="space-y-2">
                  <Label htmlFor="clerk-email" className="text-gray-200">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="clerk-email"
                      type="email"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-6 bg-gray-800/50 border border-gray-600 text-[#F4F1ED] placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clerk-password" className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="clerk-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 py-6 bg-gray-800/50 border border-gray-600 text-[#F4F1ED] placeholder-gray-400"
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black bg-transparent"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <Button type="button" variant="link" className="text-sm text-blue-400 p-0">
                    Forgot password?
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-[#F4F1ED] py-6 px-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                  disabled={issubmitting}
                >
                  {issubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="judge">
              <form className="space-y-6" onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}>
                <div className="space-y-2">
                  <Label htmlFor="judge-email" className="text-gray-200">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="judge-email"
                      type="email"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-6 bg-gray-800/50 border border-gray-600 text-[#F4F1ED] placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="judge-password" className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="judge-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 py-6 bg-gray-800/50 border border-gray-600 text-[#F4F1ED] placeholder-gray-400"
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black bg-transparent"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="judge-specialties" className="text-gray-200 pb-2">
                    Specialty <span className="text-gray-400">(Select one)</span>
                  </Label>
                  <div>
                    <div className="w-full">
                      <Select
                        value={formData.specialties[0] || ""}
                        onValueChange={(value) => {
                          if (!value) return;
                          handleSpecialtyChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full bg-gray-800/50 border border-gray-600 rounded-xl text-[#F4F1ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 py-6">
                          {formData.specialties[0]
                            ? formData.specialties[0]
                            : <span className="text-gray-400">Select specialty...</span>
                          }
                        </SelectTrigger>
                        <SelectContent className='bg-gray-800'>
                          {SPECIALTY_OPTIONS.map(option => (
                            <SelectItem
                              key={option}
                              value={option}
                              className='py-2 text-white'
                            >
                              <div className="flex items-center">
                                <input
                                  // type=""
                                  readOnly
                                  checked={formData.specialties[0] === option}
                                  className="mr-2 pointer-events-none"
                                  tabIndex={-1}
                                  style={{ accentColor: "#38bdf8", width: 16, height: 16 }}
                                />
                                {option}
                              </div>
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
                <div className="text-right">
                  <Button type="button" variant="link" className="text-sm text-blue-400 p-0">
                    Forgot password?
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-[#F4F1ED] py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                  disabled={issubmitting}
                >
                  {issubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign Up
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

export default Page;