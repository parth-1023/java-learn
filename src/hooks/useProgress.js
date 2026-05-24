import { useState, useCallback } from 'react'

const STORAGE_KEY = 'java-learn-progress'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage unavailable — degrade silently
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  const markComplete = useCallback((articleId) => {
    setProgress(prev => {
      const next = { ...prev, [articleId]: true }
      save(next)
      return next
    })
  }, [])

  const markIncomplete = useCallback((articleId) => {
    setProgress(prev => {
      const next = { ...prev, [articleId]: false }
      save(next)
      return next
    })
  }, [])

  const isComplete = useCallback((articleId) => {
    return !!progress[articleId]
  }, [progress])

  const getProgress = useCallback((sections) => {
    let total = 0
    let completed = 0
    const bySection = {}

    for (const section of sections) {
      const sTotal = section.articles.length
      const sCompleted = section.articles.filter(a => !!progress[a.id]).length
      total += sTotal
      completed += sCompleted
      bySection[section.id] = { total: sTotal, completed: sCompleted }
    }

    return { total, completed, bySection }
  }, [progress])

  return { isComplete, markComplete, markIncomplete, getProgress }
}
