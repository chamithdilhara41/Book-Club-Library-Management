import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import Dashboard from "./pages/DashboardPage.tsx"
import ReadersPage from "./pages/ReadersPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import LeadingPage from "./pages/LendingPage.tsx";
import OverduePage from "./pages/OverduePage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {

        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/readers", element: <ReadersPage /> },
          { path: "/books", element: <BooksPage /> },
          { path: "/lending", element: <LeadingPage /> },
          { path: "/overdue", element: <OverduePage /> },

        ],
      },
    ],
  },
])

export default router
