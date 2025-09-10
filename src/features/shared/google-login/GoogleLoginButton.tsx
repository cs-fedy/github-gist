import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from "@/assets/google-icon.svg";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth";

export function GoogleLoginButton() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const provider = new GoogleAuthProvider();

  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(userQuery);

      // If user doesn't exist, create a new document
      if (querySnapshot.empty) {
        // Extract username from email (part before @) or use displayName
        const username =
          user.displayName || user.email?.split("@")[0] || "user";

        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          username: username,
          createdAt: new Date().toISOString(),
        });
      }

      // Log in the user
      login({ user });
    } catch (error) {
      if (error instanceof FirebaseError)
        if (error.code !== "auth/popup-closed-by-user")
          setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-col flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        className="w-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-2.5 transition-colors flex items-center justify-center space-x-3"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        aria-label="Sign in with Google"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        ) : (
          <img src={GoogleIcon} alt="Google" className="h-5 w-5" />
        )}
        <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
      </Button>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
