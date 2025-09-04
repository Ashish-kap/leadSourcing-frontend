import {
  // useState,
  useEffect,
} from "react";
import {
  //  Link,
  useNavigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  // Eye, EyeOff,
  MapPin,
  Loader2,
} from "lucide-react";
import { useAuth } from "./../store/hooks/useAuth";
import {
  initializeGoogleAuth,
  signInWithGooglePopup,
} from "@/utils/googleAuth";

const Login = () => {
  const {
    // login,
    googleAuth,
    // isLoggingIn,
    isGoogleLoggingIn,
  } = useAuth();
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });
  // const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Initialize Google Auth when component mounts
    initializeGoogleAuth().catch((error) => {
      console.error("Failed to initialize Google Auth:", error);
    });
  }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     await login(formData.email, formData.password);
  //     toast.success("Welcome back! You have been successfully logged in.");
  //   } catch (error) {
  //     // Error handling is done in the useAuth hook
  //   }
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleGoogleLogin = async () => {
    try {
      const googleToken = await signInWithGooglePopup();
      await googleAuth(googleToken);
      toast.success(
        "Welcome! You have been successfully logged in with Google."
      );
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          {/* <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div
                onClick={() => navigate("/home")}
                className="w-10 h-10 cursor-pointer bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center"
              >
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span
                onClick={() => navigate("/home")}
                className="text-2xl cursor-pointer font-bold gradient-text"
              >
                LeadHuntr
              </span>
            </div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div> */}

          {/* Form */}
          {/* <Card className="border-0 shadow-lg">
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

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="h-12"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoggingIn}
                  >
                    {isGoogleLoggingIn ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
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
                    )}
                    {isGoogleLoggingIn ? "Signing in..." : "Google"}
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
          </Card> */}
          {/* Elegant Auth Card */}
          <Card className="card-elegant border-0 p-8">
            <CardHeader className="space-y-6 pb-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <div
                    onClick={() => navigate("/home")}
                    className="w-12 h-12 cursor-pointer bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <span
                    onClick={() => navigate("/home")}
                    className="text-3xl cursor-pointer font-bold gradient-text tracking-tight"
                  >
                    LeadHuntr
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-2 pb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Sign in with Google
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Access your account securely and instantly
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <Button
                variant="secondary"
                size="lg"
                className="w-full cursor-pointer relative overflow-hidden group"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoggingIn}
              >
                <div className="flex items-center justify-center space-x-4">
                  {isGoogleLoggingIn ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <svg
                      className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                      viewBox="0 0 24 24"
                    >
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
                  )}
                  <span className="text-lg font-semibold">
                    {isGoogleLoggingIn
                      ? "Signing in..."
                      : "Continue with Google"}
                  </span>
                </div>
              </Button>

              {/* Trust Indicators */}
              <div className="text-center space-y-6 pt-6">
                <div className="flex items-center justify-center space-x-8">
                  <div className="trust-indicator text-sm font-medium">
                    <div className="trust-dot bg-emerald-500"></div>
                    <span className="text-emerald-700 dark:text-emerald-400">
                      Secure
                    </span>
                  </div>
                  <div className="trust-indicator text-sm font-medium">
                    <div className="trust-dot bg-blue-500"></div>
                    <span className="text-blue-700 dark:text-blue-400">
                      Fast
                    </span>
                  </div>
                  <div className="trust-indicator text-sm font-medium">
                    <div className="trust-dot bg-purple-500"></div>
                    <span className="text-purple-700 dark:text-purple-400">
                      Private
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    By continuing, you agree to our{" "}
                    <span className="text-primary font-medium hover:underline cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-primary font-medium hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                    .
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    Your data is protected and never shared.
                  </p>
                </div>
              </div>
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
            Join thousands of businesses using LeadHuntr to supercharge their
            lead generation and market research.
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
