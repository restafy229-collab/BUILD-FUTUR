import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import QuizEditor from './pages/QuizEditor'
import QuizPlay from './pages/QuizPlay'
import SessionLive from './pages/SessionLive'
import JoinSession from './pages/JoinSession'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="join" element={<JoinSession />} />
        <Route path="play/:id" element={<QuizPlay />} />
        
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        
        <Route path="quiz/new" element={
          <ProtectedRoute>
            <QuizEditor />
          </ProtectedRoute>
        } />
        
        <Route path="quiz/:id/edit" element={
          <ProtectedRoute>
            <QuizEditor />
          </ProtectedRoute>
        } />
        
        <Route path="session/:id" element={
          <ProtectedRoute>
            <SessionLive />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}