import { LogoutButton } from "@/features/logout/LogoutButton";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="gap-y-6 flex items-center flex-col">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to GitHub Gist
        </h1>
        <p className="text-gray-600">You are successfully logged in!</p>
        <LogoutButton />
      </div>
    </div>
  );
}
