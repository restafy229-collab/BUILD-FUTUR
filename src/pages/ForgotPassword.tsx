import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pb } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      showToast('Email requis', 'error')
      return
    }
    
    setLoading(true)
    
    try {
      // Request password reset
      await pb.collection('users').requestPasswordReset(email)
      setSent(true)
      showToast('Email de réinitialisation envoyé!', 'success')
    } catch (e: any) {
      showToast('Erreur: ' + (e.message || 'Vérifiez votre email'), 'error')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✉️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vérifiez votre email</h1>
          <p className="text-gray-500 mb-8">
            Nous avons envoyé un lien de réinitialisation à votre adresse email.
          </p>
          <Link to="/login" className="btn-primary">
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-kif-orange to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">⚡</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié?</h1>
          <p className="text-gray-500">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="vous@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour à la connexion
          </Link>
        </div>
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