import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { pb, type Quiz, type Question } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function QuizPlay() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)
  const [completed, setCompleted] = useState(false)
  
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  useEffect(() => {
    loadQuiz()
  }, [id])
  
  const loadQuiz = async () => {
    if (!id) return
    setLoading(true)
    
    try {
      const q = await pb.collection('quizzes').getOne<Quiz>(id)
      
      if (!q || !q.is_published) {
        showToast('Quiz non trouvé ou non publié', 'error')
        navigate('/join')
        return
      }
      
      setQuiz(q)
      
      const qs = await pb.collection('questions').getFullList<Question>({
        filter: `quiz="${id}"`,
        sort: 'order',
      })
      
      setQuestions(qs)
      
      if (qs.length === 0) {
        showToast('Aucune question dans ce quiz', 'error')
        navigate('/join')
        return
      }
      
      showToast('Quiz chargé ! Bonne chance', 'success')
    } catch (e: any) {
      showToast('Erreur: ' + (e.message || 'Quiz introuvable'), 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowResult(true)
    
    const currentQ = questions[currentIndex]
    const isCorrect = index === currentQ.correct_index
    
    if (isCorrect) {
      setScore(s => s + currentQ.points)
      showToast(`✓ Correct! +${currentQ.points} pts`, 'success')
    } else {
      showToast('✗ Incorrect', 'error')
    }
  }
  
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
      showToast(`Quiz terminé! Score: ${score}`, 'success')
    }
  }
  
  const currentQ = questions[currentIndex]
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-kif-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }
  
  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-purple-50 py-12 px-4">
        <div className="text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Terminé!</h1>
          <p className="text-gray-600 mb-6">Votre score</p>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <p className="text-5xl font-bold text-kif-orange mb-2">{score}</p>
            <p className="text-gray-500">points</p>
          </div>
          
          <div className="space-y-3">
            <Link to="/join" className="block w-full btn-primary py-3">
              Rejouer un autre quiz
            </Link>
            <Link to="/" className="block w-full btn-secondary py-3">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-kif-orange transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/join" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <span>←</span> Quitter
          </Link>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="font-bold text-kif-orange">{score} pts</div>
        </div>
        
        {/* Quiz Title */}
        {quiz && (
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">{quiz.title}</h1>
          </div>
        )}
        
        {/* Question */}
        {currentQ && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-6 text-center">
              {currentQ.text}
            </h2>
            
            {/* Answers */}
            <div className="space-y-3">
              {currentQ.choices?.map((choice, i) => {
                const isSelected = selectedAnswer === i
                const isCorrect = currentQ.correct_index === i
                const showCorrect = showResult && isCorrect
                const showWrong = showResult && isSelected && !isCorrect
                
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      showCorrect ? 'border-green-500 bg-green-50 text-green-700' :
                      showWrong ? 'border-red-500 bg-red-50 text-red-700' :
                      isSelected ? 'border-kif-orange bg-orange-50' :
                      'border-gray-200 hover:border-kif-orange hover:bg-gray-50'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 font-bold mr-3 text-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {choice}
                  </button>
                )
              })}
            </div>
            
            {/* Result feedback */}
            {showResult && (
              <div className={`mt-4 p-4 rounded-xl text-center ${
                selectedAnswer === currentQ.correct_index
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {selectedAnswer === currentQ.correct_index 
                  ? `✓ Correct! +${currentQ.points} points`
                  : `✗ La réponse était: ${String.fromCharCode(65 + currentQ.correct_index)}`
                }
              </div>
            )}
          </div>
        )}
        
        {/* Next Button */}
        {showResult && (
          <button
            onClick={nextQuestion}
            className="w-full btn-primary py-4 text-lg shadow-lg"
          >
            {currentIndex < questions.length - 1 ? 'Question suivante →' : 'Voir le résultat'}
          </button>
        )}
      </div>
      
      {/* Toast */}
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