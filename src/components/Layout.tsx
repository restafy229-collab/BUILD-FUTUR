import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { useState, useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-kif-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white text-xl">⚡</span>
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">KifLearn</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Accueil
            </Link>
            <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Tarifs
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                  Dashboard
                </Link>
                <Link to="/join" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                  Rejoindre
                </Link>
              </>
            )}
          </nav>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <span className="w-7 h-7 bg-gradient-to-br from-kif-orange to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                  <Link to="/profile" className="text-sm font-medium">{user?.username}</Link>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
                  Se connecter
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 shadow-lg shadow-orange-500/25">
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600"
              >
                Accueil
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600"
              >
                Tarifs
              </Link>
              <Link 
                to="/join" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600"
              >
                Rejoindre
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600"
                  >
                    Profil
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-sm text-red-500"
                >
                  Déconnexion
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600"
                  >
                    Se connecter
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-sm text-center"
                  >
                    Commencer
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
      
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}