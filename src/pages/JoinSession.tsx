import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinSession, getQuiz, getSessionParticipants, type Session, type Quiz, type Participant } from '../lib/pocketbase'

export default function JoinSession() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleJoin = async () => {
    if (code.length !== 6) {
      setError('Code invalide')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const session = await joinSession(code.toUpperCase())
      
      if (!session) {
        setError('Session introuvable')
        setLoading(false)
        return
      }
      
      // Navigate to session
      navigate(`/session/${session.id}`)
    } catch (e) {
      setError('Erreur lors de la connexion')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-6">🎮</div>
        
        <h1 className="font-display text-2xl font-bold mb-2">
          Rejoindre une session
        </h1>
        <p className="text-gray-600 mb-8">
          Entrez le code shared par l'hôte
        </p>

        <div className="mb-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="input-field text-center text-3xl font-mono tracking-widest"
            placeholder="KIFAXX"
            maxLength={6}
            autoFocus
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleJoin}
          disabled={loading || code.length !== 6}
          className="btn-primary w-full"
        >
          {loading ? 'Connexion...' : 'Rejoindre'}
        </button>

        <p className="text-gray-500 text-sm mt-6">
          Pas de compte ?{' '}
          <span 
            onClick={() => navigate('/register')}
            className="text-kif-orange font-medium cursor-pointer hover:underline"
          >
            Créer un compte
          </span>
        </p>
      </div>
    </div>
  )
}