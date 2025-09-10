import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { HomePage } from "./pages/HomePage";
import AuthProvider from "./context/auth";
import { LoggedInGuard } from "./guards/LoggedInGuard";
import { NotLoggedInGuard } from "./guards/NotLoggedInGuard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <NotLoggedInGuard />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <NotLoggedInGuard />,
    children: [
      {
        index: true,
        element: <RegistrationPage />,
      },
    ],
  },
  {
    path: "/",
    element: <LoggedInGuard />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
