import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { 
  getSession, getQuiz, getQuestions, getSessionParticipants, 
  joinAsParticipant, submitResponse, subscribe, type Session, 
  type Quiz, type Question, type Participant, generateCode, createSession as createS
} from '../lib/pocketbase'

export default function SessionLive() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [session, setSession] = useState<Session | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isHost, setIsHost] = useState(false)
  const [view, setView] = useState<'waiting' | 'question' | 'result' | 'leaderboard'>('waiting')
  
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    loadSession()
  }, [id])

  useEffect(() => {
    if (view === 'question' && isHost) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [view, isHost])

  const loadSession = async () => {
    if (!id) return
    
    try {
      const s = await getSession(id)
      setSession(s)
      
      if (s) {
        const q = await getQuiz(s.quiz)
        const qs = await getQuestions(s.quiz)
        const p = await getSessionParticipants(s.id)
        
        setQuiz(q)
        setQuestions(qs)
        setParticipants(p)
        
        // Check if current user is host
        if (s.host === user?.id) {
          setIsHost(true)
        }
        
        setCurrentQIndex(s.current_question || 0)
        
        if (s.status === 'active') {
          setView('question')
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const startSession = async () => {
    if (!id || !isHost) return
    
    try {
      // Update session status to active
      const { updateSession } = await import('../lib/pocketbase')
      await updateSession(id, { status: 'active', started: new Date().toISOString() })
      setView('question')
    } catch (e) {
      console.error(e)
    }
  }

  const nextQuestion = async () => {
    if (!isHost || !session) return
    
    if (currentQIndex < questions.length - 1) {
      const nextIndex = currentQIndex + 1
      setCurrentQIndex(nextIndex)
      
      const { updateSession } = await import('../lib/pocketbase')
      await updateSession(id!, { current_question: nextIndex })
      
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(questions[nextIndex].time_limit || 20)
    } else {
      endSession()
    }
  }

  const endSession = async () => {
    if (!isHost || !id) return
    
    const { updateSession } = await import('../lib/pocketbase')
    await updateSession(id, { status: 'ended' })
    setView('leaderboard')
  }

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null || !isHost) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    // Calculate points
    const q = questions[currentQIndex]
    const isCorrect = index === q.correct_index
    const points = isCorrect ? q.points : 0
    
    // Submit response
    if (user) {
      await submitResponse({
        session: id!,
        participant: user.id,
        question: q.id,
        answer_index: index,
        response_ms: (20 - timeLeft) * 1000,
        points,
        is_correct: isCorrect,
      })
    }
  }

  const currentQuestion = questions[currentQIndex]
  const myScore = participants.find(p => p.user === user?.id)?.score || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-xl font-bold">{quiz?.title}</h1>
            <p className="text-sm text-gray-500">
              {isHost ? 'Vue hôte' : `Score: ${myScore} pts`}
            </p>
          </div>
          
          {isHost && (
            <div className="text-center">
              <p className="text-sm text-gray-500">Code de session</p>
              <p className="text-2xl font-mono font-bold text-kif-orange">
                {session?.code}
              </p>
            </div>
          )}
        </div>

        {/* Waiting View */}
        {view === 'waiting' && (
          <div className="card text-center py-16">
            <div className="text-6xl mb-6">⏳</div>
            <h2 className="text-2xl font-bold mb-2">
              {isHost ? 'Prêt à lancer' : 'En attente du host...'}
            </h2>
            <p className="text-gray-500 mb-6">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </p>
            
            {isHost ? (
              <button onClick={startSession} className="btn-primary text-lg px-8">
                Lancer le quiz
              </button>
            ) : (
              <p className="text-gray-400">Le quiz va démarrer...</p>
            )}
          </div>
        )}

        {/* Question View */}
        {view === 'question' && currentQuestion && (
          <div>
            {/* Timer & Progress */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQIndex + 1} / {questions.length}
              </span>
              {isHost && (
                <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-kif-orange'}`}>
                  {timeLeft}s
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-kif-orange transition-all duration-1000"
                style={{ width: `${(timeLeft / (currentQuestion.time_limit || 20)) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
              
              {/* Choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.choices?.map((choice, i) => {
                  const isSelected = selectedAnswer === i
                  const isCorrect = currentQuestion.correct_index === i
                  const showCorrect = showResult && isCorrect
                  const showWrong = showResult && isSelected && !isCorrect
                  
                  return (
                    <button
                      key={i}
                      onClick={() => isHost && handleAnswer(i)}
                      disabled={selectedAnswer !== null || !isHost}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        showCorrect ? 'border-green-500 bg-green-50' :
                        showWrong ? 'border-red-500 bg-red-50' :
                        isSelected ? 'border-kif-orange bg-orange-50' :
                        'border-gray-200 hover:border-kif-orange'
                      }`}
                    >
                      <span className="font-mono font-bold mr-2">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {choice}
                    </button>
                  )
                })}
              </div>

              {/* Result Feedback */}
              {showResult && (
                <div className={`mt-4 p-4 rounded-lg text-center ${
                  selectedAnswer === currentQuestion.correct_index
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedAnswer === currentQuestion.correct_index 
                    ? `✓ Correct ! +${currentQuestion.points} pts`
                    : `✗ Incorrect. Réponse: ${String.fromCharCode(65 + currentQuestion.correct_index)}`
                  }
                  {currentQuestion.explanation && (
                    <p className="text-sm mt-2">{currentQuestion.explanation}</p>
                  )}
                </div>
              )}
            </div>

            {/* Host Controls */}
            {isHost && showResult && (
              <div className="flex justify-center gap-4">
                <button onClick={nextQuestion} className="btn-primary">
                  {currentQIndex < questions.length - 1 ? 'Question suivante →' : 'Terminer'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {(view === 'leaderboard' || (showResult && !isHost)) && (
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Classement</h3>
            
            <div className="space-y-2">
              {participants.slice(0, 10).map((p, i) => (
                <div 
                  key={p.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    p.user === user?.id ? 'bg-kif-orange/10 border border-kif-orange' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-400 text-yellow-900' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-200'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="font-medium">
                      {p.user === user?.id ? 'Vous' : `Participant ${i + 1}`}
                    </span>
                  </div>
                  <span className="font-bold">{p.score} pts</span>
                </div>
              ))}
            </div>

            {isHost && view === 'leaderboard' && (
              <button onClick={() => navigate('/dashboard')} className="btn-primary w-full mt-4">
                Retour au dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}