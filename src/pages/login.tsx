import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Loader2, Shield, Zap, Lock } from "lucide-react";
import { useAuth } from "./../store/hooks/useAuth";
import {
  initializeGoogleAuth,
  signInWithGooglePopup,
} from "@/utils/googleAuth";
import { setCookie } from "@/utils/cookies";
import "../login.css";

const Login = () => {
  const {
    // login,
    googleAuth,
    // isLoggingIn,
    isGoogleLoggingIn,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Capture and store referral code from query parameter
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      // Detect production environment
      const isProduction = window.location.hostname.includes("cazalead.com");
      
      // Store ref code in cookie for 30 days
      // Set secure and sameSite for production compatibility
      setCookie("ref", refCode, 30, {
        path: "/",
        secure: window.location.protocol === "https:",
        sameSite: "lax",
        ...(isProduction && { domain: ".cazalead.com" }),
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // Initialize Google Auth when component mounts
    initializeGoogleAuth().catch(() => {
      // Failed to initialize Google Auth
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
    } catch {
      // Google login error
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="login-bg flex flex-col lg:flex-row min-h-screen">
      {/* Geometric Background Elements */}
      <div className="grid-bg" />
      <div className="hex-pattern" />
      <div className="dot-grid" />
      
      {/* Floating Geometric Shapes */}
      <div className="geo-shape geo-circle-1" />
      <div className="geo-shape geo-circle-2" />
      <div className="geo-shape geo-circle-3" />
      <div className="geo-shape geo-square-1" />
      <div className="geo-shape geo-square-2" />
      <div className="geo-triangle" />
      
      {/* Accent Lines */}
      <div className="accent-line accent-line-1" />
      <div className="accent-line accent-line-2" />
      <div className="accent-line accent-line-3" />

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Premium Card */}
          <Card className="login-card-light border-0 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
            <CardHeader className="space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-0">
              <div className="text-center">
                {/* Logo */}
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
                  <div
                    onClick={() => navigate("/")}
                    className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105"
                  >
                    <MapPin className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <span
                    onClick={() => navigate("/")}
                    className="text-2xl sm:text-3xl md:text-4xl cursor-pointer font-bold gradient-text-light tracking-tight"
                  >
                    CazaLead
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-slate-800">
                  Welcome Back
                </h1>
                <p className="text-slate-500 text-base sm:text-lg leading-relaxed px-2">
                  Sign in securely with your Google account
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 px-0">
              <Button
                size="lg"
                className="google-btn-light cursor-pointer w-full h-12 sm:h-14 rounded-xl text-slate-700 font-semibold text-sm sm:text-base hover:text-slate-900"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoggingIn}
              >
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                  {isGoogleLoggingIn ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
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
                  <span>
                    {isGoogleLoggingIn ? "Signing in..." : "Continue with Google"}
                  </span>
                </div>
              </Button>

              {/* Trust Indicators */}
              <div className="text-center space-y-4 sm:space-y-6 pt-2 sm:pt-4">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <div className="trust-badge-light flex items-center gap-1.5 sm:gap-2">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                    <span className="text-xs sm:text-sm font-medium text-emerald-600">Secure</span>
                  </div>
                  <div className="trust-badge-light flex items-center gap-1.5 sm:gap-2">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                    <span className="text-xs sm:text-sm font-medium text-amber-600">Instant</span>
                  </div>
                  <div className="trust-badge-light flex items-center gap-1.5 sm:gap-2">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                    <span className="text-xs sm:text-sm font-medium text-indigo-600">Private</span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4 space-y-2">
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto px-2">
                    By continuing, you agree to our{" "}
                    <a href="/terms"  target="_blank" className="text-indigo-500 hover:text-indigo-600 transition-colors">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy"  target="_blank" className="text-indigo-500 hover:text-indigo-600 transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Stats */}
          <div className="lg:hidden text-center space-y-4 py-4">
            <p className="text-sm text-slate-500">
              Trusted by <span className="font-semibold text-indigo-600">50K+</span> businesses worldwide
            </p>
            <div className="flex items-center justify-center gap-6 text-slate-600">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">10M+</div>
                <div className="text-xs text-slate-400">Data Points</div>
              </div>
              <div className="h-8 w-px bg-indigo-100" />
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">99.9%</div>
                <div className="text-xs text-slate-400">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Brand Panel */}
      <div className="hidden lg:flex flex-1 brand-side-light items-center justify-center p-6 xl:p-8 relative">
        {/* Brand Geometric Elements */}
        <div className="brand-geo brand-hex-1" />
        <div className="brand-geo brand-hex-2" />
        <div className="brand-geo brand-line-1" />
        <div className="brand-geo brand-line-2" />
        
        <div className="max-w-sm xl:max-w-md text-center relative z-10">
          <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 xl:mb-8 backdrop-blur-sm border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <MapPin className="h-12 w-12 xl:h-16 xl:w-16 text-white" />
          </div>
          <h2 className="text-2xl xl:text-3xl text-white font-bold mb-3 xl:mb-4">
            Extract Business Data Like Never Before
          </h2>
          <p className="text-lg xl:text-xl text-white/85 mb-8 xl:mb-10">
            Join thousands of businesses using CazaLead to supercharge their
            lead generation and market research.
          </p>
          <div className="flex items-center justify-center space-x-6 xl:space-x-10">
            <div className="text-center group">
              <div className="text-2xl xl:text-3xl font-bold text-white group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-xs xl:text-sm text-white/70 mt-1">Businesses</div>
            </div>
            <div className="h-10 xl:h-12 w-px bg-white/20" />
            <div className="text-center group">
              <div className="text-2xl xl:text-3xl font-bold text-white group-hover:scale-110 transition-transform">10M+</div>
              <div className="text-xs xl:text-sm text-white/70 mt-1">Data Points</div>
            </div>
            <div className="h-10 xl:h-12 w-px bg-white/20" />
            <div className="text-center group">
              <div className="text-2xl xl:text-3xl font-bold text-white group-hover:scale-110 transition-transform">99.9%</div>
              <div className="text-xs xl:text-sm text-white/70 mt-1">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
