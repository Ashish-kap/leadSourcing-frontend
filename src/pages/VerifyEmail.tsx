import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Loader2, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyEmailMutation } from "@/store/api/authApi";
import { handleApiError } from "@/store/utils/errorHandling";
import "../login.css";

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

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token")?.trim() ?? "",
    [searchParams]
  );
  const hasAttemptedRef = useRef(false);
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (hasAttemptedRef.current) {
      return;
    }

    hasAttemptedRef.current = true;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    verifyEmail({ token })
      .unwrap()
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((error) => {
        handleApiError(error as FetchBaseQueryError);
        navigate("/login", { replace: true });
      });
  }, [navigate, token, verifyEmail]);

  return (
    <div className="login-bg flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
      <BackgroundDecor />

      <div className="relative z-10 w-full max-w-md">
        <Card className="login-card-light border-0 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
          <CardHeader className="space-y-4 px-0">
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center space-x-2 sm:space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 sm:h-12 sm:w-12 sm:rounded-xl">
                  <MapPin className="h-5 w-5 text-white sm:h-7 sm:w-7" />
                </div>
                <span className="gradient-text-light text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  CazaLead
                </span>
              </div>
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-500" />
              <CardTitle className="mt-4 text-xl font-bold text-slate-800 sm:text-2xl">
                Verifying your email
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <p className="text-center text-base leading-relaxed text-slate-500 sm:text-lg">
              Please wait while we confirm your account and redirect you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
