import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout: unauthenticate } = useAuth();

  const navLinks = [
    { label: "Books", path: "/books" },
    { label: "Readers", path: "/readers" },
    { label: "Lending", path: "/lending" },
    { label: "Overdue", path: "/overdue" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await logout();
      unauthenticate();
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      toast.error(
          axios.isAxiosError(error)
              ? error.message
              : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const isActive = (path: string) =>
      location.pathname === path
          ? "text-indigo-600 font-semibold"
          : "text-gray-700 hover:text-indigo-600";

  return (
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
                className="text-2xl font-bold text-indigo-600 cursor-pointer"
            >
              📚 Book-Club
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn &&
                  navLinks.map(({ label, path }) => (
                      <button
                          key={label}
                          onClick={() => navigate(path)}
                          className={`px-3 py-2 text-sm font-medium transition-colors duration-150 ${isActive(
                              path
                          )}`}
                      >
                        {label}
                      </button>
                  ))}

              {!isLoggedIn ? (
                  <button
                      onClick={() => navigate("/login")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </button>
              ) : (
                  <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {isLoading ? "Logging out..." : "Logout"}
                  </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                  onClick={toggleMenu}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                      />
                  ) : (
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                      />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
              <div className="md:hidden mt-2 pb-3 space-y-1 border-t border-gray-200">
                {isLoggedIn &&
                    navLinks.map(({ label, path }) => (
                        <button
                            key={label}
                            onClick={() => {
                              navigate(path);
                              setIsMenuOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-base font-medium ${isActive(
                                path
                            )}`}
                        >
                          {label}
                        </button>
                    ))}

                {!isLoggedIn ? (
                    <button
                        onClick={() => {
                          navigate("/login");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-base font-medium"
                    >
                      Login
                    </button>
                ) : (
                    <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        disabled={isLoading}
                        className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-base font-medium"
                    >
                      {isLoading ? "Logging out..." : "Logout"}
                    </button>
                )}
              </div>
          )}
        </div>
      </nav>
  );
};

export default Navbar;
