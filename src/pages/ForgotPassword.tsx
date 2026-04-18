import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { handleApiError } from "@/store/utils/errorHandling";
import "../login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailID = email.trim();
    if (!emailID) return;

    try {
      await forgotPassword({ emailID }).unwrap();
      toast.success(
        "If an account exists for that email, you will receive reset instructions shortly."
      );
      setEmail("");
    } catch (error) {
      handleApiError(error as FetchBaseQueryError);
    }
  };

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
            <CardHeader className="space-y-4 sm:space-y-6 px-0">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
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
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">
                  Reset your password
                </CardTitle>
                <p className="text-slate-500 text-base sm:text-lg leading-relaxed px-2 mt-2">
                  Enter your email and we will send you reset instructions if an
                  account exists.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>

              <div className="space-y-1 pt-2">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto px-2 text-center">
                  By continuing, you agree to our{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
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
            Secure account recovery
          </h2>
          <p className="text-lg xl:text-xl text-white/85 mb-8 xl:mb-10">
            We will email you a link to choose a new password when your email
            matches an account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
