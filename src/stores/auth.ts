import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb, getCurrentUser, isLoggedIn, type User } from '../lib/pocketbase'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<{ error: any }>
  register: (email: string, password: string, username: string) => Promise<{ error: any }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ error: null })
        
        // Validate inputs
        if (!email || !password) {
          set({ error: 'Email et mot de passe requis' })
          return { error: 'Email et mot de passe requis' }
        }
        
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          set({ error: 'Email invalide' })
          return { error: 'Email invalide' }
        }
        
        try {
          // Authenticate with PocketBase
          await pb.collection('users').authWithPassword(email, password)
          const user = getCurrentUser()
          
          if (!user) {
            set({ error: 'Erreur d\'authentification' })
            return { error: 'Erreur d\'authentification' }
          }
          
          set({ user, isAuthenticated: true, error: null })
          return { error: null }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Email ou mot de passe incorrect'
          set({ error: message })
          return { error: message }
        }
      },

      register: async (email, password, username) => {
        set({ error: null })
        
        // Validate inputs
        if (!email || !password || !username) {
          set({ error: 'Tous les champs sont requis' })
          return { error: 'Tous les champs sont requis' }
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          set({ error: 'Email invalide' })
          return { error: 'Email invalide' }
        }
        
        // Password requirements
        if (password.length < 6) {
          set({ error: 'Mot de passe trop court (min 6 caractères)' })
          return { error: 'Mot de passe trop court' }
        }
        
        // Username requirements
        if (username.length < 2) {
          set({ error: 'Pseudo trop court (min 2 caractères)' })
          return { error: 'Pseudo trop court' }
        }
        
        // Sanitize username (alphanumeric only)
        const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, '')
        if (sanitizedUsername !== username) {
          set({ error: 'Pseudo: lettres, chiffres,_- uniquement' })
          return { error: 'Pseudo invalide' }
        }
        
        try {
          // Create user with PocketBase
          await pb.collection('users').create({
            email,
            password,
            passwordConfirm: password,
            username: sanitizedUsername,
            // Optional: add default role
            role: 'participant',
          })
          
          // Auto login after register
          await pb.collection('users').authWithPassword(email, password)
          const user = getCurrentUser()
          
          if (!user) {
            set({ error: 'Erreur après inscription' })
            return { error: 'Erreur après inscription' }
          }
          
          set({ user, isAuthenticated: true, error: null })
          return { error: null }
        } catch (error: any) {
          // Handle specific error codes
          const data = error.response?.data
          if (data) {
            if (data.email) {
              set({ error: data.email.message })
              return { error: data.email.message }
            }
            if (data.username) {
              set({ error: data.username.message })
              return { error: data.username.message }
            }
          }
          const message = error.response?.data?.message || 'Erreur d\'inscription'
          set({ error: message })
          return { error: message }
        }
      },

      logout: async () => {
        try {
          pb.authStore.clear()
        } catch (e) {
          console.error('Logout error:', e)
        }
        set({ user: null, isAuthenticated: false, error: null })
      },

      checkAuth: async () => {
        try {
          // Refresh auth if valid
          if (pb.authStore.isValid && pb.authStore.model) {
            // Optionally verify with a token refresh
            const user = getCurrentUser()
            set({ user, isAuthenticated: !!user, loading: false })
          } else {
            set({ user: null, isAuthenticated: false, loading: false })
          }
        } catch (e) {
          set({ user: null, isAuthenticated: false, loading: false })
        }
      },
    }),
    {
      name: 'kiflearn-auth',
      partialize: (state) => ({ 
        // Only persist user id and auth status, NOT sensitive data
        user: state.user ? { id: state.user.id, username: state.user.username } : null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)