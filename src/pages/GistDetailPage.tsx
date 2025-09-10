import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { doc, getDoc, collection, query, orderBy, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/auth";
import Header from "@/components/layout/Header";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Star,
  GitFork,
  Eye,
  Lock,
  Globe,
  ArrowLeft,
  Calendar,
  User,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as z from "zod";

interface Gist {
  id: string;
  filename: string;
  code: string;
  description?: string;
  status: "public" | "private";
  createdAt: any;
  userId: string;
  userEmail?: string;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorEmail: string;
  createdAt: any;
  gistId: string;
}

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export function GistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [gist, setGist] = useState<Gist | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchGist = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const gistDoc = await getDoc(doc(db, "gists", id));
        
        if (gistDoc.exists()) {
          setGist({
            id: gistDoc.id,
            ...gistDoc.data(),
          } as Gist);
        } else {
          setError("Gist not found");
        }
      } catch (err) {
        console.error("Error fetching gist:", err);
        setError("Failed to load gist");
      } finally {
        setLoading(false);
      }
    };

    fetchGist();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gistComments: Comment[] = [];
      snapshot.forEach((doc) => {
        const commentData = doc.data();
        if (commentData.gistId === id) {
          gistComments.push({
            id: doc.id,
            ...commentData,
          } as Comment);
        }
      });
      setComments(gistComments);
    });

    return () => unsubscribe();
  }, [id]);

  const formik = useFormik<CommentFormValues>({
    initialValues: {
      content: "",
    },
    validate: (values) => {
      try {
        commentSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0] as string] = err.message;
            }
          });
          return errors;
        }
        return {};
      }
    },
    onSubmit: async (values, { resetForm }) => {
      if (!user || !id) return;

      try {
        setIsSubmittingComment(true);
        await addDoc(collection(db, "comments"), {
          content: values.content,
          authorId: user.uid,
          authorEmail: user.email,
          gistId: id,
          createdAt: new Date(),
        });
        resetForm();
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setIsSubmittingComment(false);
      }
    },
  });

  const getLanguageFromFilename = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      xml: "xml",
      sql: "sql",
      sh: "bash",
      md: "markdown",
    };
    return languageMap[extension || ""] || "text";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering - in a real app, you'd use a proper markdown library
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading gist...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !gist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error || "Gist not found"}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/gists"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to gists
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Gist Header */}
            <div className="bg-white border border-gray-200 rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {gist.filename}
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Created {formatDate(gist.createdAt)}
                        </span>
                        <span className="flex items-center">
                          {gist.status === "private" ? (
                            <>
                              <Lock className="h-4 w-4 mr-1" />
                              Secret
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 mr-1" />
                              Public
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Star
                    </Button>
                    <Button variant="outline" size="sm">
                      <GitFork className="h-4 w-4 mr-2" />
                      Fork
                    </Button>
                  </div>
                </div>
                
                {gist.description && (
                  <p className="text-gray-700">{gist.description}</p>
                )}
              </div>

              {/* Code Content */}
              <div className="p-0">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {gist.filename}
                  </span>
                  <span className="text-xs text-gray-500">
                    {gist.code.length} characters
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <SyntaxHighlighter
                    language={getLanguageFromFilename(gist.filename)}
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: "#ffffff",
                    }}
                    showLineNumbers
                  >
                    {gist.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comments ({comments.length})
                </h2>
              </div>

              {/* Comment Form */}
              <div className="px-6 py-4 border-b border-gray-200">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          !showPreview
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          showPreview
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                    
                    {!showPreview ? (
                      <textarea
                        name="content"
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Leave a comment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                      />
                    ) : (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px] bg-gray-50">
                        {formik.values.content ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(formik.values.content),
                            }}
                          />
                        ) : (
                          <span className="text-gray-500 italic">
                            Nothing to preview
                          </span>
                        )}
                      </div>
                    )}
                    
                    {formik.errors.content && formik.touched.content && (
                      <div className="text-red-600 text-sm mt-1">
                        {formik.errors.content}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <strong>Markdown</strong> is supported
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmittingComment || !formik.values.content.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmittingComment ? "Commenting..." : "Comment"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="divide-y divide-gray-200">
                {comments.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.authorEmail?.split("@")[0] || "Anonymous"}
                            </span>
                            <span className="text-sm text-gray-500">
                              commented on {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <div
                            className="text-gray-700 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(comment.content),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Gist Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File type</span>
                  <span className="font-medium text-gray-900">
                    {getLanguageFromFilename(gist.filename)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-gray-900">
                    {gist.code.length} bytes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility</span>
                  <span className="font-medium text-gray-900">
                    {gist.status === "private" ? "Secret" : "Public"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-medium text-gray-900">
                    {comments.length}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}