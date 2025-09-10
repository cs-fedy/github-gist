import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
