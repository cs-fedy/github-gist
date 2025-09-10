import { buttonVariants } from "@/components/ui/button";
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
import { RegistrationForm } from "@/features/registration/RegistrationForm";
import { Link } from "react-router";

export function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LoginHeader />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Join us today and get started with your journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <RegistrationForm />

            <Divider />
            <GoogleLoginButton />

            <div className="text-center">
              <Link
                to="/login"
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-sm text-blue-600 hover:text-blue-500 hover:bg-blue-50 font-medium",
                })}
              >
                Already have an account? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
