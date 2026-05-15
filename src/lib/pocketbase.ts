import PocketBase from 'pocketbase'

// ===========================================
// CONFIGURATION & SECURITY
// ===========================================

// Secure URL from environment (default fallback for dev only)
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

// Validate URL format
if (!PB_URL.startsWith('https://') && !PB_URL.startsWith('http://')) {
  console.error('Invalid PocketBase URL - must start with http:// or https://')
}

// Initialize PocketBase
export const pb = new PocketBase(PB_URL)

// ===========================================
// TYPES - Core Domain Models
// ===========================================

// User type (from users collection)
export interface User {
  id: string
  email: string
  username: string
  role: 'host' | 'participant'
  avatar?: string
  created: string
  updated: string
}

// Quiz type (from quizzes collection)
export interface Quiz {
  id: string
  title: string
  description: string
  host: string
  visibility: 'public' | 'private'
  language: 'fr' | 'en' | 'es'
  time_per_question: number
  points_correct: number
  points_incorrect: number
  is_published: boolean
  created: string
}

// Question type (from questions collection)
export interface Question {
  id: string
  quiz: string
  type: 'mcq' | 'true_false'
  text: string
  choices: string[]
  correct_index: number
  explanation: string
  time_limit: number
  points: number
  order: number
}

// Session type (from sessions collection)
export interface Session {
  id: string
  quiz: string
  host: string
  code: string
  mode: 'live' | 'async' | 'hackathon'
  status: 'waiting' | 'active' | 'ended'
  current_question: number
  deadline?: string
  started?: string
  created: string
}

// Participant type (from participants collection)
export interface Participant {
  id: string
  session: string
  user: string
  score: number
  joined: string
}

// Response type (from responses collection)
export interface Response {
  id: string
  session: string
  participant: string
  question: string
  answer_index: number
  response_ms: number
  points: number
  is_correct: boolean
  created: string
}

// Payment type (from payments collection)
export interface Payment {
  id: string
  user: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  method: string
  provider: string
  reference: string
  plan_type: 'pro' | 'school' | 'event'
  created: string
  completed?: string
}

// Subscription type (from subscriptions collection)
export interface Subscription {
  id: string
  user: string
  plan: 'free' | 'pro' | 'school'
  status: 'active' | 'cancelled' | 'expired'
  amount: number
  billing_cycle: 'monthly' | 'lifetime'
  start_date: string
  end_date?: string
  next_billing?: string
  created: string
}

// Voucher type (from vouchers collection)
export interface Voucher {
  id: string
  code: string
  discount: number
  type: 'percent' | 'fixed'
  plan: 'pro' | 'school' | 'event'
  expires: string
  used: number
  max_uses: number
  created: string
}

// ===========================================
// AUTH HELPERS
// ===========================================

/**
 * Login with email and password
 * Uses PocketBase built-in authWithPassword for security
 */
export async function login(email: string, password: string) {
  // Sanitize inputs
  const sanitizedEmail = email.trim().toLowerCase()
  
  try {
    const auth = await pb.collection('users').authWithPassword(sanitizedEmail, password)
    return { user: auth.model, token: auth.token, error: null }
  } catch (error: any) {
    console.error('Login error:', error.message)
    return { user: null, token: null, error: error.message }
  }
}

/**
 * Register new user
 * Requires: email, password, confirmation, username
 */
export async function register(email: string, password: string, username: string) {
  // Sanitize inputs
  const sanitizedEmail = email.trim().toLowerCase()
  const sanitizedUsername = username.trim().replace(/[^a-zA-Z0-9_-]/g, '')
  
  try {
    // Create user
    const user = await pb.collection('users').create({
      email: sanitizedEmail,
      password: password,
      passwordConfirm: password,
      username: sanitizedUsername,
      role: 'participant',
    })
    
    // Auto-login after registration
    const auth = await pb.collection('users').authWithPassword(sanitizedEmail, password)
    
    return { user: auth.model, token: auth.token, error: null }
  } catch (error: any) {
    console.error('Register error:', error.message)
    return { user: null, token: null, error: error.message }
  }
}

/**
 * Logout current user
 * Clears auth store securely
 */
export async function logout() {
  pb.authStore.clear()
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return pb.authStore.model as User | null
}

/**
 * Check if user is authenticated
 */
export function isLoggedIn(): boolean {
  return pb.authStore.isValid
}

/**
 * Refresh authentication token
 * Use to extend session
 */
export async function refreshAuth() {
  if (!pb.authStore.isValid) return false
  
  try {
    await pb.collection('users').authRefresh()
    return true
  } catch (error) {
    pb.authStore.clear()
    return false
  }
}

// ===========================================
// QUIZ HELPERS
// ===========================================

/**
 * Get all quizzes (filtered by visibility or host)
 */
export async function getQuizzes(hostId?: string): Promise<Quiz[]> {
  if (hostId) {
    // Get only this user's quizzes
    return await pb.collection('quizzes').getFullList<Quiz>({
      filter: `host="${hostId}"`,
      sort: '-created',
    })
  }
  // Get public quizzes + user's own
  return await pb.collection('quizzes').getFullList<Quiz>({
    sort: '-created',
  })
}

/**
 * Get single quiz by ID
 */
export async function getQuiz(id: string): Promise<Quiz | null> {
  try {
    return await pb.collection('quizzes').getOne<Quiz>(id)
  } catch {
    return null
  }
}

/**
 * Create new quiz
 */
export async function createQuiz(data: Partial<Quiz> & { host: string }): Promise<Quiz> {
  return await pb.collection('quizzes').create({
    title: data.title?.slice(0, 200) || 'Untitled Quiz',
    description: data.description?.slice(0, 1000) || '',
    host: data.host,
    visibility: data.visibility || 'private',
    language: data.language || 'fr',
    time_per_question: data.time_per_question || 20,
    points_correct: data.points_correct || 100,
    points_incorrect: data.points_incorrect || -10,
    is_published: false,
  })
}

/**
 * Update quiz
 */
export async function updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
  return await pb.collection('quizzes').update(id, data)
}

/**
 * Delete quiz (only by host)
 */
export async function deleteQuiz(id: string): Promise<void> {
  return await pb.collection('quizzes').delete(id)
}

// ===========================================
// QUESTION HELPERS
// ===========================================

/**
 * Get all questions for a quiz
 */
export async function getQuestions(quizId: string): Promise<Question[]> {
  return await pb.collection('questions').getFullList<Question>({
    filter: `quiz="${quizId}"`,
    sort: 'order',
  })
}

/**
 * Create question
 */
export async function createQuestion(data: Partial<Question> & { quiz: string }): Promise<Question> {
  return await pb.collection('questions').create({
    quiz: data.quiz,
    type: data.type || 'mcq',
    text: data.text?.slice(0, 1000) || '',
    choices: data.choices || ['A', 'B', 'C', 'D'],
    correct_index: data.correct_index ?? 0,
    explanation: data.explanation?.slice(0, 500) || '',
    time_limit: data.time_limit || 20,
    points: data.points || 100,
    order: data.order || 0,
  })
}

/**
 * Update question
 */
export async function updateQuestion(id: string, data: Partial<Question>): Promise<Question> {
  return await pb.collection('questions').update(id, data)
}

/**
 * Delete question
 */
export async function deleteQuestion(id: string): Promise<void> {
  return await pb.collection('questions').delete(id)
}

// ===========================================
// SESSION HELPERS
// ===========================================

/**
 * Get all sessions
 */
export async function getSessions(): Promise<Session[]> {
  return await pb.collection('sessions').getFullList<Session>({
    sort: '-created',
  })
}

/**
 * Get single session
 */
export async function getSession(id: string): Promise<Session | null> {
  try {
    return await pb.collection('sessions').getOne<Session>(id)
  } catch {
    return null
  }
}

/**
 * Create new session
 */
export async function createSession(data: Partial<Session> & { quiz: string; host: string; code: string }): Promise<Session> {
  return await pb.collection('sessions').create({
    quiz: data.quiz,
    host: data.host,
    code: data.code.toUpperCase(),
    mode: data.mode || 'live',
    status: 'waiting',
    current_question: 0,
  })
}

/**
 * Update session status
 */
export async function updateSession(id: string, data: Partial<Session>): Promise<Session> {
  return await pb.collection('sessions').update(id, data)
}

/**
 * Join session by code
 */
export async function joinSession(code: string): Promise<Session | null> {
  const sanitizedCode = code.toUpperCase().trim()
  
  const sessions = await pb.collection('sessions').getFullList<Session>({
    filter: `code="${sanitizedCode}" && status != "ended"`,
  })
  
  return sessions[0] || null
}

/**
 * Generate unique session code (KIF + 3 random chars)
 */
export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'KIF'
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ===========================================
// PARTICIPANT HELPERS
// ===========================================

/**
 * Get participants for a session
 */
export async function getSessionParticipants(sessionId: string): Promise<Participant[]> {
  return await pb.collection('participants').getFullList<Participant>({
    filter: `session="${sessionId}"`,
    sort: '-score',
  })
}

/**
 * Join session as participant
 */
export async function joinAsParticipant(sessionId: string, userId: string): Promise<Participant> {
  // Check if already joined
  const existing = await pb.collection('participants').getFullList({
    filter: `session="${sessionId}" && user="${userId}"`,
  })
  
  if (existing.length > 0) {
    return existing[0] as Participant
  }
  
  // Create new participant
  return await pb.collection('participants').create({
    session: sessionId,
    user: userId,
    score: 0,
  })
}

/**
 * Update participant score
 */
export async function updateParticipantScore(id: string, score: number): Promise<Participant> {
  return await pb.collection('participants').update(id, { score })
}

// ===========================================
// RESPONSE HELPERS
// ===========================================

/**
 * Submit answer response
 */
export async function submitResponse(data: {
  session: string
  participant: string
  question: string
  answer_index: number
  response_ms: number
  points: number
  is_correct: boolean
}): Promise<Response> {
  return await pb.collection('responses').create(data)
}

/**
 * Get responses for a session
 */
export async function getSessionResponses(sessionId: string): Promise<Response[]> {
  return await pb.collection('responses').getFullList<Response>({
    filter: `session="${sessionId}"`,
  })
}

// ===========================================
// REALTIME HELPERS
// ===========================================

/**
 * Subscribe to collection changes
 * Returns unsubscribe function
 */
export function subscribe(
  collection: string, 
  callback: (action: string, record: any) => void
): () => void {
  pb.collection(collection).subscribe('*', ({ action, record }) => {
    callback(action, record)
  })
  
  // Return unsubscribe function
  return () => {
    pb.collection(collection).unsubscribe()
  }
}

/**
 * Unsubscribe from all collections
 */
export function unsubscribeAll() {
  pb.collection('sessions').unsubscribe()
  pb.collection('participants').unsubscribe()
  pb.collection('responses').unsubscribe()
}

// ===========================================
// SECURITY HELPERS
// ===========================================

/**
 * Sanitize string input (XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate session code format
 */
export function validateCode(code: string): boolean {
  return /^[A-Z0-9]{3,10}$/.test(code)
}

/**
 * Check if user owns quiz
 */
export async function isQuizHost(quizId: string, userId: string): Promise<boolean> {
  const quiz = await getQuiz(quizId)
  return quiz?.host === userId
}