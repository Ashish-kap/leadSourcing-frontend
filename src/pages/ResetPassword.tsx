import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { handleApiError } from "@/store/utils/errorHandling";
import "../login.css";

const getPasswordStrength = (value: string) => {
  let strength = 0;
  if (value.length >= 8) strength++;
  if (/[a-z]/.test(value)) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;
  return strength;
};

const getPasswordStrengthLabel = (strength: number) => {
  if (strength <= 2) return { text: "Weak", color: "text-red-500", bar: "bg-red-500" };
  if (strength === 3)
    return { text: "Good", color: "text-yellow-600", bar: "bg-yellow-500" };
  return { text: "Strong", color: "text-green-600", bar: "bg-green-500" };
};

function BackgroundDecor() {
  return (
    <>
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
    </>
  );
}

function BrandPanel() {
  return (
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
          Choose a strong password to protect your workspace and keep your lead
          data safe.
        </p>
      </div>
    </div>
  );
}

function TermsFooter() {
  return (
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
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token")?.trim() ?? "",
    [searchParams]
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const passwordStrength = getPasswordStrength(password);
  const strengthLabel = getPasswordStrengthLabel(passwordStrength);
  const passwordsMatch =
    password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (passwordStrength < 3) {
      toast.error("Password too weak.");
      return;
    }

    try {
      await resetPassword({
        token,
        password,
        passwordConfirm: confirmPassword,
      }).unwrap();
      toast.success("Your password has been updated. You can sign in now.");
      navigate("/login", { replace: true });
    } catch (err) {
      handleApiError(err as FetchBaseQueryError);
    }
  };

  const invalidTokenCard = (
    <Card className="login-card-light border-0 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
      <CardHeader className="space-y-4 px-0">
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
            Link not valid
          </CardTitle>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed px-2 mt-2">
            This reset link is missing or expired. Request a new one from the
            forgot password page.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/forgot-password">Request a new link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
        <TermsFooter />
      </CardContent>
    </Card>
  );

  const formCard = (
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
            Set a new password
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-slate-700">
              New password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Password strength</span>
                  <span className={strengthLabel.color}>{strengthLabel.text}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${strengthLabel.bar}`}
                    style={{
                      width: `${Math.min(100, (passwordStrength / 5) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-slate-700">
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <div className="flex items-center space-x-2 text-xs">
                {passwordsMatch ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Passwords match</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base"
            disabled={
              isLoading ||
              !passwordsMatch ||
              passwordStrength < 3 ||
              !password
            }
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              "Update password"
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

        <TermsFooter />
      </CardContent>
    </Card>
  );

  return (
    <div className="login-bg flex flex-col lg:flex-row min-h-screen">
      <BackgroundDecor />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {!token ? invalidTokenCard : formCard}
        </div>
      </div>

      <BrandPanel />
    </div>
  );
}
