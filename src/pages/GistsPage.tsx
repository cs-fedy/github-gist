import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/auth";
import Header from "@/components/layout/Header";
import {
  Star,
  GitFork,
  Eye,
  Lock,
  Globe,
  Code,
  User,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface Gist {
  id: string;
  filename: string;
  code: string;
  description?: string;
  status: "public" | "private";
  createdAt: Date;
  userId: string;
}

export function GistsPage() {
  const { user } = useAuth();
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGists = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const gistsRef = collection(db, "gists");
        const q = query(
          gistsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const userGists: Gist[] = [];

        querySnapshot.forEach((doc) => {
          userGists.push({
            id: doc.id,
            ...doc.data(),
          } as Gist);
        });

        setGists(userGists);
      } catch (err) {
        console.error("Error fetching gists:", err);
        setError("Failed to load gists");
      } finally {
        setLoading(false);
      }
    };

    fetchUserGists();
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getLanguageFromFilename = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "JavaScript",
      jsx: "React",
      ts: "TypeScript",
      tsx: "React TypeScript",
      py: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      cs: "C#",
      php: "PHP",
      rb: "Ruby",
      go: "Go",
      rs: "Rust",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      json: "JSON",
      xml: "XML",
      sql: "SQL",
      sh: "Shell",
      md: "Markdown",
    };
    return languageMap[extension || ""] || "Text";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading your gists...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Your Gists
                </h1>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Starred
                  </Button>
                  <Button variant="outline" size="sm">
                    Sort: Recently created
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">
                Instantly share code, notes, and snippets.
              </p>
            </div>

            {/* Gist List */}
            <div className="space-y-4">
              {gists.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    You don't have any gists yet.
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Gists are a great way to share your work. Use gists to share
                    a snippet, a full document, or any code you'd like.
                  </p>
                  <Link
                    to="/create"
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first gist
                  </Link>
                </div>
              ) : (
                gists.map((gist) => (
                  <div
                    key={gist.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {gist.filename}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Created {formatDate(gist.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {gist.status === "private" ? (
                          <>
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Secret
                            </span>
                          </>
                        ) : (
                          <>
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Public
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {gist.description && (
                      <p className="text-gray-700 mb-4">{gist.description}</p>
                    )}

                    <div className="bg-gray-50 rounded-md p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          {getLanguageFromFilename(gist.filename)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {gist.code.length} characters
                        </span>
                      </div>
                      <pre className="text-sm text-gray-800 overflow-x-auto">
                        <code>
                          {gist.code.slice(0, 200)}
                          {gist.code.length > 200 ? "..." : ""}
                        </code>
                      </pre>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <Link
                          to={`/gist/${gist.id}`}
                          className="flex items-center hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        <button className="flex items-center hover:text-blue-600">
                          <Star className="h-4 w-4 mr-1" />
                          Star
                        </button>
                        <button className="flex items-center hover:text-blue-600">
                          <GitFork className="h-4 w-4 mr-1" />
                          Fork
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/create"
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-start flex items-center px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create new gist
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Search all gists
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    View starred gists
                  </Button>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Your Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total gists</span>
                    <span className="font-medium text-gray-900">
                      {gists.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Public gists</span>
                    <span className="font-medium text-gray-900">
                      {gists.filter((g) => g.status === "public").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Secret gists</span>
                    <span className="font-medium text-gray-900">
                      {gists.filter((g) => g.status === "private").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
