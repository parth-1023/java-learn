import { useState, useCallback, useMemo } from 'react'
import { sections } from './content/index'
import { useProgress } from './hooks/useProgress'
import TopNav from './components/TopNav'
import SubSidebar from './components/SubSidebar'
import ArticleView from './components/ArticleView'

export default function App() {
  const [currentSectionId, setCurrentSectionId] = useState(sections[0].id)
  const [currentArticleId, setCurrentArticleId] = useState(sections[0].articles[0].id)
  const [isDark, setIsDark] = useState(true)
  const { isComplete, markComplete, markIncomplete, getProgress } = useProgress()

  const handleThemeToggle = useCallback(() => {
    setIsDark(prev => {
      document.body.classList.toggle('light', prev)
      return !prev
    })
  }, [])

  const handleSectionChange = useCallback((sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    setCurrentSectionId(sectionId)
    setCurrentArticleId(section.articles[0].id)
  }, [])

  const handleArticleChange = useCallback((articleId) => {
    setCurrentArticleId(articleId)
  }, [])

  const handleMarkDone = useCallback((articleId) => {
    markComplete(articleId)
    const section = sections.find(s => s.id === currentSectionId)
    const idx = section.articles.findIndex(a => a.id === articleId)
    const next = section.articles[idx + 1]
    if (next) setCurrentArticleId(next.id)
  }, [currentSectionId, markComplete])

  const progress = useMemo(() => getProgress(sections), [getProgress])
  const currentSection = sections.find(s => s.id === currentSectionId)
  const currentArticle = currentSection.articles.find(a => a.id === currentArticleId)

  return (
    <div className="app-shell">
      <TopNav
        sections={sections}
        currentSectionId={currentSectionId}
        onSectionChange={handleSectionChange}
        progress={progress}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />
      <div className="main-body">
        <SubSidebar
          section={currentSection}
          currentArticleId={currentArticleId}
          onArticleChange={handleArticleChange}
          isComplete={isComplete}
          progress={progress.bySection[currentSectionId]}
        />
        <ArticleView
          article={currentArticle}
          isComplete={isComplete(currentArticleId)}
          onMarkDone={handleMarkDone}
          onMarkUndone={markIncomplete}
        />
      </div>
    </div>
  )
}
