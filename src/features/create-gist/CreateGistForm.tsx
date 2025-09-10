import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/auth";

// Zod validation schema
const gistSchema = z.object({
  filename: z.string().min(1, "Gist name is required"),
  code: z.string().min(1, "Code content is required"),
  description: z.string().optional(),
  status: z.enum(["public", "private"]),
});

type GistFormValues = z.infer<typeof gistSchema>;

// Helper function to get language from file extension
const getLanguageFromExtension = (filename: string): string => {
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

export function CreateGistForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const initialValues: GistFormValues = {
    filename: "",
    code: "",
    description: "",
    status: "public",
  };

  const handleSubmit = async (values: GistFormValues) => {
    if (!user) {
      setSubmitMessage({
        type: "error",
        text: "You must be logged in to create a gist",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await addDoc(collection(db, "gists"), {
        filename: values.filename,
        code: values.code,
        description: values.description || "",
        status: values.status,
        userId: user.uid,
        createdAt: new Date(),
      });

      setSubmitMessage({ type: "success", text: "Gist created successfully!" });
      // Reset form after successful submission
      setTimeout(() => setSubmitMessage(null), 3000);
    } catch (error) {
      console.error("Error creating gist:", error);
      setSubmitMessage({
        type: "error",
        text: "Failed to create gist. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (values: GistFormValues) => {
    try {
      gistSchema.parse(values);
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
  };

  const formik = useFormik({
    initialValues,
    validate: validateForm,
    onSubmit: handleSubmit,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-8">
      {/* Success/Error Messages */}
      {submitMessage && (
        <div
          className={`p-4 rounded-md ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {(() => {
          const language = getLanguageFromExtension(formik.values.filename);
          const hasExtension = formik.values.filename.includes(".");

          return (
            <>
              {/* Filename Input */}
              <div>
                <input
                  name="filename"
                  type="text"
                  placeholder="Filename including extension..."
                  value={formik.values.filename}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.errors.filename && formik.touched.filename
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {formik.errors.filename && formik.touched.filename && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.filename}
                  </div>
                )}
              </div>

              {/* Code Editor Area with Syntax Highlighting */}
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    {hasExtension && (
                      <span className="text-xs text-gray-600 font-mono">
                        {language}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  {hasExtension && formik.values.code ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        language={language}
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          padding: "16px",
                          background: "transparent",
                          fontSize: "14px",
                          lineHeight: "1.5",
                          minHeight: "384px",
                        }}
                        showLineNumbers={true}
                      >
                        {formik.values.code}
                      </SyntaxHighlighter>
                      <textarea
                        name="code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="absolute inset-0 w-full h-full p-4 font-mono text-sm resize-none focus:outline-none border-none bg-transparent text-transparent caret-white z-10"
                        style={{ lineHeight: "1.5", minHeight: "384px" }}
                        placeholder="Enter your code here..."
                      />
                    </div>
                  ) : (
                    <textarea
                      name="code"
                      value={formik.values.code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none border-none ${
                        formik.errors.code && formik.touched.code
                          ? "border-red-300"
                          : ""
                      }`}
                      placeholder="Enter your code here..."
                      style={{ lineHeight: "1.5" }}
                    />
                  )}
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {formik.values.code.length} characters
                  </div>
                </div>
                {formik.errors.code && formik.touched.code && (
                  <div className="text-red-600 text-sm p-2">
                    {formik.errors.code}
                  </div>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gist description (optional)
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What does this gist do?"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formik.values.description?.length || 0} characters
                </div>
              </div>

              {/* Status Options */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="public"
                    id="public"
                    checked={formik.values.status === "public"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label
                    htmlFor="public"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Public
                    </span>
                    <span className="block text-xs text-gray-500 ml-6">
                      Anyone on the internet can see this gist
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="private"
                    id="private"
                    checked={formik.values.status === "private"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                  />
                  <label
                    htmlFor="private"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Private
                    </span>
                    <span className="block text-xs text-gray-500 ml-6">
                      You choose who can see this gist
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    formik.values.status === "public"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                  }`}
                >
                  {isSubmitting
                    ? "Creating..."
                    : `Create ${formik.values.status} gist`}
                </button>
              </div>
            </>
          );
        })()}
      </form>
    </div>
  );
}
