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
import Settings from './pages/Settings'
import History from './pages/History'
import Pricing from './pages/Pricing'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import Vouchers from './pages/Vouchers'
import Payments from './pages/Payments'
import Subscription from './pages/Subscription'

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
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="join" element={<JoinSession />} />
        <Route path="play/:id" element={<QuizPlay />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        
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
        
        <Route path="settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="history" element={
          <ProtectedRoute>
            <History />
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
        
        <Route path="subscription" element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        } />
        
        <Route path="vouchers" element={
          <ProtectedRoute>
            <Vouchers />
          </ProtectedRoute>
        } />
        
        <Route path="payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}