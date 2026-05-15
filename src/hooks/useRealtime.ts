import { useEffect, useState } from 'react'
import { pb } from '../lib/pocketbase'

export function useRealtime<T>(collection: string, filter?: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load
    const load = async () => {
      try {
        const records = await pb.collection(collection).getFullList<T>({
          filter: filter,
        })
        setData(records)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()

    // Subscribe to changes
    pb.collection(collection).subscribe('*', async ({ action, record }) => {
      if (action === 'create') {
        setData(prev => [...prev, record as T])
      } else if (action === 'update') {
        setData(prev => prev.map(r => (r as any).id === record.id ? record as T : r))
      } else if (action === 'delete') {
        setData(prev => prev.filter(r => (r as any).id !== record.id))
      }
    })

    return () => {
      pb.collection(collection).unsubscribe()
    }
  }, [collection, filter])

  return { data, loading }
}

export function useSessionRealtime(sessionId: string) {
  const [responses, setResponses] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])

  useEffect(() => {
    // Subscribe to responses
    pb.collection('responses').subscribe('*', ({ action, record }) => {
      if ((record as any).session === sessionId) {
        if (action === 'create') {
          setResponses(prev => [...prev, record])
        }
      }
    })

    // Subscribe to participants
    pb.collection('participants').subscribe('*', ({ action, record }) => {
      if ((record as any).session === sessionId) {
        if (action === 'create') {
          setParticipants(prev => [...prev, record])
        } else if (action === 'update') {
          setParticipants(prev => prev.map(p => p.id === record.id ? record : p))
        }
      }
    })

    return () => {
      pb.collection('responses').unsubscribe()
      pb.collection('participants').unsubscribe()
    }
  }, [sessionId])

  return { responses, participants }
}

export default useRealtime