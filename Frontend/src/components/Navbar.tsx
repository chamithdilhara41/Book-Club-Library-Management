import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuth } from "../context/useAuth"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedIn, logout: unauthenticate } = useAuth()

  console.log(isLoggedIn)

  const handleLogin = () => {
    console.log("Login")
    navigate("/login")
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      toast.success("Logout successful!")
      unauthenticate()
      navigate("/login") // <-- navigate to login on success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDashboard = () =>  navigate("/dashboard")
  const handleBooks = () => navigate("/books")
  const handleReaders = () => navigate("/readers")
  const handleLending = () => navigate("/lending")
  const handleOverdue = () => navigate("/overdue")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className='bg-white shadow-lg border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>

          {/* Logo Section */}
          <div className='flex items-center cursor-pointer'>
            <div className='flex-shrink-0'>
              <h1 className='text-2xl font-bold text-indigo-600' onClick={handleDashboard}> 📚 Book-Club </h1>
            </div>
          </div>

          {/* navigation */}
          <div className='hidden md:flex items-center space-x-4'>
            {isLoggedIn && (
                <>
                  <a
                      onClick={handleBooks}
                      className='text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium cursor-pointer'
                  >
                    Books
                  </a>
                  <a
                      onClick={handleReaders}
                      className='text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium cursor-pointer'
                  >
                    Readers
                  </a>
                  <a
                      onClick={handleLending}
                      className='text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium cursor-pointer'
                  >
                    Lending
                  </a>
                  <a
                      onClick={handleOverdue}
                      className='text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium cursor-pointer'
                  >
                    Overdue
                  </a>
                </>
            )}

            {!isLoggedIn && (
                <button
                    onClick={handleLogin}
                    className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium'
                >
                  Login
                </button>
            )}

          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4'>

            {!isLoggedIn && (
              <button
                onClick={handleLogin}
                className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Login
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                Logout
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={handleDashboard}
                className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              >
                Dashboard
              </button>
            )}


          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600'
            >
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200'>

              {isLoggedIn && (
                  <>
                    <a
                        onClick={handleBooks}
                        className='block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium cursor-pointer'
                    >
                      Books
                    </a>
                    <a
                        onClick={handleReaders}
                        className='block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium cursor-pointer'
                    >
                      Readers
                    </a>
                    <a
                        onClick={handleLending}
                        className='block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium cursor-pointer'
                    >
                      Lending
                    </a>
                  </>
              )}

              {!isLoggedIn && (
                <button
                  onClick={handleLogin}
                  className='block w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium'
                >
                  Login
                </button>
              )}

              {isLoggedIn && (
                <button
                  disabled={isLoading}
                  onClick={handleLogout}
                  className='block w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium'
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              )}

              {isLoggedIn && (
                <button
                  onClick={handleDashboard}
                  className='block w-full text-left bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium'
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
