import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginHeader } from "@/features/login/LoginHeader";
import { Divider } from "@/features/shared/ui/divider";
import { GoogleLoginButton } from "@/features/shared/google-login/GoogleLoginButton";
import { LoginForm } from "@/features/login/LoginForm";

export default function LoginPage() {
  const handleCreateAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Create account clicked");
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LoginHeader />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg border-gray-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Sign in to GitHub Gist
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <LoginForm />
            <Divider />
            <GoogleLoginButton />

            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-2.5 transition-colors"
              onClick={handleCreateAccount}
            >
              Create account
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
