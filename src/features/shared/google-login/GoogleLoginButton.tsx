import GoogleIcon from "@/assets/google-icon.svg";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();

    setIsLoading(false);
    console.log("Google sign in clicked");
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-2.5 transition-colors flex items-center justify-center space-x-3"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      aria-label="Sign in with Google"
    >
      <img src={GoogleIcon} alt="Google" className="h-5 w-5" />
      <span>Continue with Google</span>
    </Button>
  );
}
