import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { pb, type Session, type Quiz } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function JoinSession() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  
  const navigate = useNavigate()

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString()
    setToast({ id, message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleJoin = async () => {
    const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9]/g, '')
    
    if (cleanCode.length < 3 || cleanCode.length > 10) {
      showToast('Code invalide. Format attendu: KIFXXX', 'error')
      return
    }
    
    setLoading(true)
    showToast('Recherche de la session...', 'info')
    
    try {
      // Search for session by code
      const sessions = await pb.collection('sessions').getFullList<Session>({
        filter: `code="${cleanCode}" && status != "ended"`,
      })
      
      if (!sessions || sessions.length === 0) {
        showToast('Session introuvable. Vérifiez le code.', 'error')
        setLoading(false)
        return
      }
      
      const session = sessions[0]
      
      // Check if user is authenticated
      if (!pb.authStore.isValid) {
        // Store session info for after login
        sessionStorage.setItem('pending_session', session.id)
        showToast('Connexion requise...', 'info')
        navigate('/login')
        return
      }
      
      // Auto-join as participant
      const userId = pb.authStore.model?.id
      if (!userId) {
        navigate('/login')
        return
      }
      
      // Check if already joined
      const existing = await pb.collection('participants').getFullList({
        filter: `session="${session.id}" && user="${userId}"`,
      })
      
      if (existing.length === 0) {
        // Create participant
        await pb.collection('participants').create({
          session: session.id,
          user: userId,
          score: 0,
        })
        showToast('Connecté !', 'success')
      }
      
      navigate(`/session/${session.id}`)
    } catch (e: any) {
      console.error(e)
      showToast('Erreur de connexion: ' + (e.message || 'Réessayez'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin()
    }
  }

  // Auto-format code with KIF prefix
  const formatCode = (value: string) => {
    let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (!cleaned.startsWith('KIF') && cleaned.length > 0) {
      cleaned = 'KIF' + cleaned.slice(-3)
    }
    return cleaned.slice(0, 6)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-kif-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-2xl">🎮</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Rejoindre une session</h1>
          <p className="text-gray-500 mt-1">Entrez le code partagé par l'hôte</p>
        </div>

        {/* Input Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Code de session</label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(formatCode(e.target.value))}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kif-blue focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest uppercase"
                placeholder="KIFXXX"
                maxLength={6}
                autoFocus
                disabled={loading}
              />
              <button
                onClick={() => setCode('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Format: KIF + 3 lettres</p>
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={loading || code.length < 6}
            className="w-full bg-gradient-to-r from-kif-blue to-blue-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connexion...
              </span>
            ) : (
              'Rejoindre'
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link 
              to="/register" 
              className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <span>✨</span>Créer un compte
            </Link>
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <span>🏠</span>Page d'accueil
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Tips:</span> Demandez à votre hôte le code 
            (ex: KIFABC). Vous pouvez aussi scanner un QR code!
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-gray-800 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}