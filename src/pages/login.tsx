import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "./../store/hooks/useAuth";

const Login = () => {
  const { login, isLoggingIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back! You have been successfully logged in.");
    } catch (error) {
      // Error handling is done in the useAuth hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // return (
  //   <div className="min-h-screen flex">
  //     {/* Left Side - Form */}
  //     <div className="flex-1 flex items-center justify-center p-8 bg-background">
  //       <div className="w-full max-w-md space-y-8">
  //         {/* Logo */}
  //         <div className="text-center">
  //           <div className="flex items-center justify-center space-x-2 mb-6">
  //             <div className="w-10 h-10 bg-gradient-to-r from-[#2462f1] to-purple-600 rounded-lg flex items-center justify-center">
  //               <MapPin className="h-6 w-6 text-white" />
  //             </div>
  //             <span className="text-2xl font-bold gradient-text">
  //               MapExtractor Pro
  //             </span>
  //           </div>
  //           <h1 className="text-3xl font-bold">Welcome back</h1>
  //           <p className="text-[#8b949f] mt-2">
  //             Sign in to your account to continue
  //           </p>
  //         </div>

  //         {/* Form */}
  //         <Card className="border-0 shadow-lg">
  //           <CardHeader className="space-y-1">
  //             <CardTitle className="text-2xl text-center">Sign In</CardTitle>
  //             <CardDescription className="text-center">
  //               Enter your credentials to access your account
  //             </CardDescription>
  //           </CardHeader>
  //           <CardContent>
  //             <form onSubmit={handleSubmit} className="space-y-4">
  //               <div className="space-y-2">
  //                 <Label htmlFor="email">Email</Label>
  //                 <Input
  //                   id="email"
  //                   name="email"
  //                   type="email"
  //                   placeholder="Enter your email"
  //                   value={formData.email}
  //                   onChange={handleInputChange}
  //                   required
  //                   className="h-12 border-gray-200 focus:border-[#2462f1] focus:ring-2 focus:ring-[#2462f1]  dark:focus:ring-[#2462f1]/5"
  //                 />
  //               </div>

  //               <div className="space-y-2">
  //                 <Label htmlFor="password">Password</Label>
  //                 <div className="relative">
  //                   <Input
  //                     id="password"
  //                     name="password"
  //                     type={showPassword ? "text" : "password"}
  //                     placeholder="Enter your password"
  //                     value={formData.password}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="h-12 pr-10 border-gray-200 focus:border-[#2462f1] focus:ring-2 focus:ring-[#2462f1]  dark:focus:ring-[#2462f1]/5"
  //                   />
  //                   <button
  //                     type="button"
  //                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
  //                     onClick={() => setShowPassword(!showPassword)}
  //                   >
  //                     {showPassword ? (
  //                       <EyeOff className="h-4 w-4 text-[#8b949f]" />
  //                     ) : (
  //                       <Eye className="h-4 w-4 text-[#8b949f]" />
  //                     )}
  //                   </button>
  //                 </div>
  //               </div>

  //               <div className="flex items-center justify-between">
  //                 <div className="flex items-center space-x-2">
  //                   <Checkbox
  //                     id="remember"
  //                     checked={rememberMe}
  //                     onCheckedChange={(checked) =>
  //                       setRememberMe(checked === true)
  //                     }
  //                     className="border-gray-500"
  //                   />
  //                   <label
  //                     htmlFor="remember"
  //                     className="text-sm text-[#8b949f] cursor-pointer"
  //                   >
  //                     Remember me
  //                   </label>
  //                 </div>
  //                 <Link
  //                   to="/forgot-password"
  //                   className="text-sm text-[#2462f1] hover:underline"
  //                 >
  //                   Forgot password?
  //                 </Link>
  //               </div>

  //               <Button
  //                 type="submit"
  //                 className="w-full h-12 bg-[#2462f1] hover:bg-[#2462f1]/90 text-white cursor-pointer"
  //                 disabled={isLoggingIn}
  //               >
  //                 {isLoggingIn ? (
  //                   <>
  //                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                     Signing in...
  //                   </>
  //                 ) : (
  //                   "Sign In"
  //                 )}
  //               </Button>
  //             </form>

  //             <div className="mt-6">
  //               <div className="relative">
  //                 <div className="absolute inset-0 flex items-center">
  //                   <div className="w-full border-t border-border" />
  //                 </div>
  //                 <div className="relative flex justify-center text-xs uppercase">
  //                   <span className="bg-[white] px-2 text-[#8b949f]">
  //                     Or continue with
  //                   </span>
  //                 </div>
  //               </div>

  //               <div className="mt-6 grid grid-cols-2 gap-3">
  //                 <Button variant="outline" className="h-12">
  //                   <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
  //                     <path
  //                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
  //                       fill="#4285F4"
  //                     />
  //                     <path
  //                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
  //                       fill="#34A853"
  //                     />
  //                     <path
  //                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
  //                       fill="#FBBC05"
  //                     />
  //                     <path
  //                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
  //                       fill="#EA4335"
  //                     />
  //                   </svg>
  //                   Google
  //                 </Button>
  //                 <Button variant="outline" className="h-12">
  //                   <svg
  //                     className="mr-2 h-4 w-4"
  //                     fill="currentColor"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <path d="M23.5 12.5c0-.8-.1-1.6-.2-2.4H12v4.5h6.5c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.5-5 3.5-8.3z" />
  //                     <path d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.8c-1.1.7-2.5 1.1-4.2 1.1-3.2 0-5.9-2.2-6.9-5.1H1.4v2.9C3.4 21.8 7.4 24 12 24z" />
  //                   </svg>
  //                   Microsoft
  //                 </Button>
  //               </div>
  //             </div>

  //             <p className="text-center text-sm text-[#8b949f] mt-6">
  //               Don't have an account?{" "}
  //               <Link
  //                 to="/signup"
  //                 className="text-[#2462f1] hover:underline font-medium"
  //               >
  //                 Sign up here
  //               </Link>
  //             </p>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>

  //     {/* Right Side - Brand Image */}
  //     <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-8 text-white">
  //       <div className="max-w-md text-center">
  //         <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
  //           <MapPin className="h-16 w-16" />
  //         </div>
  //         <h2 className="text-3xl font-bold mb-4">
  //           Extract Business Data Like Never Before
  //         </h2>
  //         <p className="text-xl text-white/90 mb-8">
  //           Join thousands of businesses using MapExtractor Pro to supercharge
  //           their lead generation and market research.
  //         </p>
  //         <div className="flex items-center justify-center space-x-8 text-white/80">
  //           <div className="text-center">
  //             <div className="text-2xl font-bold">50K+</div>
  //             <div className="text-sm">Businesses</div>
  //           </div>
  //           <div className="text-center">
  //             <div className="text-2xl font-bold">10M+</div>
  //             <div className="text-sm">Data Points</div>
  //           </div>
  //           <div className="text-center">
  //             <div className="text-2xl font-bold">99.9%</div>
  //             <div className="text-sm">Accuracy</div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                MapExtractor Pro
              </span>
            </div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-12">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.5 12.5c0-.8-.1-1.6-.2-2.4H12v4.5h6.5c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.5-5 3.5-8.3z" />
                      <path d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.8c-1.1.7-2.5 1.1-4.2 1.1-3.2 0-5.9-2.2-6.9-5.1H1.4v2.9C3.4 21.8 7.4 24 12 24z" />
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Brand Image */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-8 text-white">
        <div className="max-w-md text-center">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <MapPin className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Extract Business Data Like Never Before
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses using MapExtractor Pro to supercharge
            their lead generation and market research.
          </p>
          <div className="flex items-center justify-center space-x-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm">Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
