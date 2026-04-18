import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  // Shield,
  // Zap,
  // Lock,
} from "lucide-react";
import { useAuth } from "@/store/hooks/useAuth";
import {
  initializeGoogleAuth,
  signInWithGooglePopup,
} from "@/utils/googleAuth";
import "../login.css";

const Signup = () => {
  const { signup, googleAuth, isSigningUp, isGoogleLoggingIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    // Initialize Google Auth when component mounts
    initializeGoogleAuth().catch(() => {
      // Failed to initialize Google Auth
    });
  }, []);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions to continue.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (passwordStrength < 3) {
      toast.error("Password too weak");
      return;
    }

    try {
      // API call would go here
      // const response = await fetch('/api/v1/users/signup', { ... });

      await signup(
        formData.email,
        formData.fullName,
        formData.password,
        formData.confirmPassword
      );
      toast.success("Account created successfully!");
    } catch {
      // API error toasts are handled centrally via useAuth -> handleApiError.
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignup = async () => {
    try {
      const googleToken = await signInWithGooglePopup();
      try {
        await googleAuth(googleToken);
      } catch {
        // API error toasts are handled centrally via useAuth -> handleApiError.
        return;
      }

      toast.success(
        "Welcome! Your account has been created successfully with Google."
      );
    } catch {
      // Popup/provider failure before the API call.
      toast.error("Google signup failed. Please try again.");
    }
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Very Weak", color: "text-red-500" };
      case 2:
        return { text: "Weak", color: "text-orange-500" };
      case 3:
        return { text: "Good", color: "text-yellow-500" };
      case 4:
        return { text: "Strong", color: "text-green-500" };
      case 5:
        return { text: "Very Strong", color: "text-green-600" };
      default:
        return { text: "", color: "" };
    }
  };

  const strengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className="login-bg flex flex-col lg:flex-row min-h-screen">
      <div className="grid-bg" />
      <div className="hex-pattern" />
      <div className="dot-grid" />
      <div className="geo-shape geo-circle-1" />
      <div className="geo-shape geo-circle-2" />
      <div className="geo-shape geo-circle-3" />
      <div className="geo-shape geo-square-1" />
      <div className="geo-shape geo-square-2" />
      <div className="geo-triangle" />
      <div className="accent-line accent-line-1" />
      <div className="accent-line accent-line-2" />
      <div className="accent-line accent-line-3" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <Card className="login-card-light border-0 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
            <CardHeader className="space-y-3 sm:space-y-4 px-0">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div
                    onClick={() => navigate("/")}
                    className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105"
                  >
                    <MapPin className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <span
                    onClick={() => navigate("/")}
                    className="text-2xl sm:text-3xl cursor-pointer font-bold gradient-text-light tracking-tight"
                  >
                    CazaLead
                  </span>
                </div>
                <p className="text-slate-500 text-base sm:text-lg leading-relaxed px-2 py-2">
                  Sign up securely with email or Google.
                </p>
                {/* <CardTitle className="text-xl sm:text-xl text-slate-800">
                  Create your account
                </CardTitle> */}
                {/* <CardDescription className="text-slate-500 mt-2 text-sm sm:text-base">
                  Create your account
                </CardDescription> */}
              </div>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="h-12 bg-white/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 bg-white/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-12 pr-10 bg-white/80"
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
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Password strength:</span>
                        <span className={strengthInfo.color}>
                          {strengthInfo.text}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength <= 2
                              ? "bg-red-500"
                              : passwordStrength === 3
                              ? "bg-yellow-500"
                              : passwordStrength === 4
                              ? "bg-green-500"
                              : "bg-green-600"
                          }`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="h-12 pr-10 bg-white/80"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className="flex items-center space-x-2 text-xs">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">
                            Passwords match
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500">
                            Passwords do not match
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setAgreeToTerms(checked === true)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-slate-500 cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 sm:h-14 cursor-pointer text-sm sm:text-base font-semibold"
                  disabled={
                    isSigningUp ||
                    !agreeToTerms ||
                    !passwordsMatch ||
                    passwordStrength < 3
                  }
                >
                  {isSigningUp ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="login-card-light px-2 text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="google-btn-light h-12 cursor-pointer text-slate-700 hover:text-slate-900"
                    onClick={handleGoogleSignup}
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
                    {isGoogleLoggingIn ? "Creating account..." : "Continue with Google"}
                  </Button>
                </div>
              </div>

              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 brand-side-light items-center justify-center p-6 xl:p-8 relative">
        <div className="brand-geo brand-hex-1" />
        <div className="brand-geo brand-hex-2" />
        <div className="brand-geo brand-line-1" />
        <div className="brand-geo brand-line-2" />

        <div className="max-w-sm xl:max-w-md text-center relative z-10">
          <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 xl:mb-8 backdrop-blur-sm border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <MapPin className="h-12 w-12 xl:h-16 xl:w-16 text-white" />
          </div>
          <h2 className="text-2xl xl:text-3xl text-white font-bold mb-3 xl:mb-4">
            Launch Your Lead Engine
          </h2>
          <p className="text-lg xl:text-xl text-white/85 mb-8 xl:mb-10">
            Create your account to unlock high-quality business leads and start
            scaling outreach faster.
          </p>
          <div className="flex items-center justify-center space-x-6 xl:space-x-10">
            <div className="text-center group">
              <div className="text-2xl xl:text-3xl font-bold text-white group-hover:scale-110 transition-transform">
                500+
              </div>
              <div className="text-xs xl:text-sm text-white/70 mt-1">
                Businesses
              </div>
            </div>
            <div className="h-10 xl:h-12 w-px bg-white/20" />
            {/* <div className="text-center group">
              <div className="text-2xl xl:text-3xl font-bold text-white group-hover:scale-110 transition-transform">
                10M+
              </div>
              <div className="text-xs xl:text-sm text-white/70 mt-1">
                Data Points
              </div>
            </div> */}
            {/* <div className="h-10 xl:h-12 w-px bg-white/20" /> */}
            <div className="text-center group">
              <div className="text-2xl xl:text-3xl font-bold text-white group-hover:scale-110 transition-transform">
                99.9%
              </div>
              <div className="text-xs xl:text-sm text-white/70 mt-1">
                Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
