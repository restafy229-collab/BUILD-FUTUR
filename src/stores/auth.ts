import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb, getCurrentUser, isLoggedIn, type User } from '../lib/pocketbase'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<{ error: any }>
  register: (email: string, password: string, username: string) => Promise<{ error: any }>
  logout: () => Promise<void>
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        try {
          await pb.collection('users').authWithPassword(email, password)
          const user = getCurrentUser()
          set({ user, isAuthenticated: true })
          return { error: null }
        } catch (error) {
          return { error }
        }
      },

      register: async (email, password, username) => {
        try {
          await pb.collection('users').create({
            email,
            password,
            passwordConfirm: password,
            username,
            role: 'participant',
          })
          // Auto login after register
          await pb.collection('users').authWithPassword(email, password)
          const user = getCurrentUser()
          set({ user, isAuthenticated: true })
          return { error: null }
        } catch (error) {
          return { error }
        }
      },

      logout: async () => {
        pb.authStore.clear()
        set({ user: null, isAuthenticated: false })
      },

      checkAuth: () => {
        const user = getCurrentUser()
        set({ user, isAuthenticated: isLoggedIn(), loading: false })
      },
    }),
    {
      name: 'kiflearn-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)