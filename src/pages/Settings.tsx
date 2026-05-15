import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { pb } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function Settings() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  
  // Settings state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('fr')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setEmail(user.email || '')
    }
  }, [user])
  
  const handleSave = async () => {
    if (!user?.id) return
    setLoading(true)
    
    try {
      await pb.collection('users').update(user.id, {
        username,
        language,
      })
      
      showToast('Paramètres enregistrés!', 'success')
    } catch (e: any) {
      showToast('Erreur: ' + e.message, 'error')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-500">Gérez vos préférences</p>
          </div>
          <Link to="/profile" className="btn-secondary">
            ← Profil
          </Link>
        </div>
        
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Profil</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pseudo
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="input-field bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email non modifiable</p>
            </div>
          </div>
        </div>
        
        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Préférences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langue
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Recevoir des alertes par email</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-kif-orange' : 'bg-gray-300'
                }`}
              >
                <span className={`block w-6 h-6 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Mode sombre</p>
                <p className="text-sm text-gray-500">Thème sombre (bientôt)</p>
              </div>
              <button
                disabled
                className="w-12 h-6 rounded-full bg-gray-300 cursor-not-allowed opacity-50"
              >
                <span className="block w-6 h-6 bg-white rounded-full translate-x-0" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Sécurité</h2>
          
          <div className="space-y-3">
            <Link 
              to="/forgot-password"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Changer le mot de passe</span>
              <span className="text-gray-400">→</span>
            </Link>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Authentification à 2 facteurs</span>
              <span className="text-gray-400 text-sm">Bientôt</span>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full btn-primary py-3"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
      
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}