import { LogoutButton } from "@/features/logout/LogoutButton";
import { Github, Search, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">
                GitHub
              </span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/gists"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Your gists
              </Link>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                All gists
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Starred
              </a>
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search gists..."
                className="pl-10 w-64 bg-gray-50 border-gray-300 focus:bg-white"
              />
            </div>
            <Link
              to="/create"
              className={cn(
                buttonVariants(),
                "bg-green-600 hover:bg-green-700 text-white"
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              New gist
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
