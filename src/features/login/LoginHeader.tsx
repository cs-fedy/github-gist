import { Github } from "lucide-react";

export function LoginHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center">
        <div className="flex items-center space-x-2">
          <Github className="h-8 w-8 text-gray-900" />
          <span className="text-xl font-semibold text-gray-900">
            GitHub Gist
          </span>
        </div>
      </div>
    </header>
  );
}
