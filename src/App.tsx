import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { HomePage } from "./pages/HomePage";
import CreateGistPage from "./pages/CreateGistPage";
import { GistsPage } from "./pages/GistsPage";
import { GistDetailPage } from "./pages/GistDetailPage";
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
  {
    path: "/create",
    element: <LoggedInGuard />,
    children: [
      {
        index: true,
        element: <CreateGistPage />,
      },
    ],
  },
  {
    path: "/gists",
    element: <LoggedInGuard />,
    children: [
      {
        index: true,
        element: <GistsPage />,
      },
    ],
  },
  {
    path: "/gist/:id",
    element: <LoggedInGuard />,
    children: [
      {
        index: true,
        element: <GistDetailPage />,
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
