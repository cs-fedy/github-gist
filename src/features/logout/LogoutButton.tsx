import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { auth } from "@/firebase";

export function LogoutButton() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
    } catch (error) {
      /* empty */
    } finally {
      logout();
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2 px-4 py-2"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
