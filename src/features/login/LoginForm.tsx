import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuth } from "@/context/auth";

const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Email or username is required")
    .refine(
      (value) => {
        // If it contains @, validate as email
        if (value.includes("@")) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        // Otherwise, validate as username (at least 3 characters)
        return value.length >= 3;
      },
      {
        message:
          "Please enter a valid email address or username (at least 3 characters)",
      }
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Firebase error code to user-friendly message mapping
const getFirebaseErrorMessage = (
  errorCode: string
): { field?: keyof LoginFormValues; message: string } => {
  switch (errorCode) {
    // Authentication errors
    case "auth/user-not-found":
      return {
        field: "emailOrUsername",
        message: "No account found with this email or username.",
      };
    case "auth/wrong-password":
      return {
        field: "password",
        message: "Incorrect password. Please try again.",
      };
    case "auth/invalid-email":
      return {
        field: "emailOrUsername",
        message: "Please enter a valid email address.",
      };
    case "auth/user-disabled":
      return {
        message: "This account has been disabled. Please contact support.",
      };
    case "auth/too-many-requests":
      return {
        message: "Too many failed attempts. Please try again later.",
      };
    case "auth/network-request-failed":
      return {
        message:
          "Network error. Please check your internet connection and try again.",
      };
    // Firestore errors
    case "firestore/permission-denied":
      return {
        message:
          "Permission denied. Unable to verify user. Please contact support.",
      };
    case "firestore/unavailable":
      return {
        message:
          "Database service is temporarily unavailable. Please try again later.",
      };
    case "firestore/deadline-exceeded":
      return {
        message:
          "Request timed out. Please check your connection and try again.",
      };
    default:
      return {
        message: "An unexpected error occurred. Please try again.",
      };
  }
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");

  const { login } = useAuth();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      emailOrUsername: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Clear any previous errors
        setGeneralError("");

        // First, verify user exists in Firestore
        const usersRef = collection(db, "users");

        const userQuery = query(
          usersRef,
          or(
            where("email", "==", values.emailOrUsername),
            where("username", "==", values.emailOrUsername)
          )
        );

        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          setGeneralError(
            "Invalid credentials. Please check your email/username and password."
          );
          return;
        }

        // Get the user document
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Use the email from Firestore for authentication
        const emailForAuth = userData.email;

        // Proceed with Firebase authentication
        const result = await signInWithEmailAndPassword(
          auth,
          emailForAuth,
          values.password
        );

        login({ user: result.user });
      } catch (error) {
        if (error instanceof FirebaseError) {
          const { field, message } = getFirebaseErrorMessage(error.code);

          if (field) {
            // Set field-specific error
            setFieldError(field, message);
          } else {
            // Set general error for non-field-specific errors
            setGeneralError(message);
          }
        } else {
          // Handle non-Firebase errors
          setGeneralError("An unexpected error occurred. Please try again.");
        }

        console.error("Login error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* General Error Message */}
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600" role="alert">
            {generalError}
          </p>
        </div>
      )}

      {/* Email/Username Field */}
      <div className="space-y-2">
        <Label
          htmlFor="emailOrUsername"
          className="text-sm font-medium text-gray-700"
        >
          Email or username
        </Label>
        <Input
          id="emailOrUsername"
          name="emailOrUsername"
          type="text"
          value={formik.values.emailOrUsername}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`transition-colors ${
            formik.touched.emailOrUsername && formik.errors.emailOrUsername
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder="Enter your email or username"
          disabled={formik.isSubmitting}
          aria-describedby={
            formik.touched.emailOrUsername && formik.errors.emailOrUsername
              ? "emailOrUsername-error"
              : undefined
          }
        />
        {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
          <p
            id="emailOrUsername-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {formik.errors.emailOrUsername}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`pr-10 transition-colors ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
            placeholder="Enter your password"
            disabled={formik.isSubmitting}
            aria-describedby={
              formik.touched.password && formik.errors.password
                ? "password-error"
                : undefined
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={formik.isSubmitting}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p id="password-error" className="text-sm text-red-600" role="alert">
            {formik.errors.password}
          </p>
        )}
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white font-medium py-2.5 transition-colors"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
