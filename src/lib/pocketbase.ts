import PocketBase from 'pocketbase'

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://YOUR_APP.pocketbase.cloud'

export const pb = new PocketBase(PB_URL)

export type User = {
  id: string
  email: string
  username: string
  role: 'host' | 'participant'
  avatar?: string
  created: string
  updated: string
}

export type Quiz = {
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

export type Question = {
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

export type Session = {
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

export type Participant = {
  id: string
  session: string
  user: string
  score: number
  joined: string
}

export type Response = {
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

// Auth helpers
export async function login(email: string, password: string) {
  return await pb.collection('users').authWithPassword(email, password)
}

export async function register(email: string, password: string, username: string) {
  return await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    username,
    role: 'participant',
  })
}

export async function logout() {
  pb authStore.clear()
}

export function getCurrentUser() {
  return pb.authStore.model as User | null
}

export function isLoggedIn() {
  return pb.authStore.isValid
}

// Quiz helpers
export async function getQuizzes() {
  return await pb.collection('quizzes').getFullList<Quiz>({
    sort: '-created',
  })
}

export async function getQuiz(id: string) {
  return await pb.collection('quizzes').getOne<Quiz>(id)
}

export async function createQuiz(data: Partial<Quiz>) {
  return await pb.collection('quizzes').create(data)
}

export async function updateQuiz(id: string, data: Partial<Quiz>) {
  return await pb.collection('quizzes').update(id, data)
}

export async function deleteQuiz(id: string) {
  return await pb.collection('quizzes').delete(id)
}

// Question helpers
export async function getQuestions(quizId: string) {
  return await pb.collection('questions').getFullList<Question>({
    filter: `quiz="${quizId}"`,
    sort: 'order',
  })
}

export async function createQuestion(data: Partial<Question>) {
  return await pb.collection('questions').create(data)
}

export async function updateQuestion(id: string, data: Partial<Question>) {
  return await pb.collection('questions').update(id, data)
}

export async function deleteQuestion(id: string) {
  return await pb.collection('questions').delete(id)
}

// Session helpers
export async function getSessions() {
  return await pb.collection('sessions').getFullList<Session>({
    sort: '-created',
  })
}

export async function createSession(data: Partial<Session>) {
  return await pb.collection('sessions').create(data)
}

export async function updateSession(id: string, data: Partial<Session>) {
  return await pb.collection('sessions').update(id, data)
}

export async function joinSession(code: string) {
  const sessions = await pb.collection('sessions').getFullList<Session>({
    filter: `code="${code}" && status != "ended"`,
  })
  return sessions[0] || null
}

export async function getSessionParticipants(sessionId: string) {
  return await pb.collection('participants').getFullList<Participant>({
    filter: `session="${sessionId}"`,
    sort: '-score',
  })
}

export async function joinAsParticipant(sessionId: string, userId: string) {
  return await pb.collection('participants').create({
    session: sessionId,
    user: userId,
    score: 0,
  })
}

export async function updateParticipantScore(id: string, score: number) {
  return await pb.collection('participants').update(id, { score })
}

// Response helpers
export async function submitResponse(data: Partial<Response>) {
  return await pb.collection('responses').create(data)
}

export async function getSessionResponses(sessionId: string) {
  return await pb.collection('responses').getFullList<Response>({
    filter: `session="${sessionId}"`,
  })
}

// Generate unique session code
export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'KIF'
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Realtime subscription
export function subscribe(collection: string, callback: (data: any) => void) {
  return pb.collection(collection).subscribe('*', callback)
}

export function unsubscribe() {
  pb.collection('sessions').unsubscribe()
}