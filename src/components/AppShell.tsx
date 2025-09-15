import { useState } from 'react'
import { useHashRoute } from '../router'
import type { View } from '../types'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { InboxView } from '../views/InboxView'
import { TodayView } from '../views/TodayView'
import { UpcomingView } from '../views/UpcomingView'
import { ProjectView } from '../views/ProjectView'
import { LabelView } from '../views/LabelView'
import { CalendarView } from '../views/CalendarView'
import { AnalyticsView } from '../views/AnalyticsView'
import { NotificationBar } from './NotificationBar'
import { CompletedView } from '../views/CompletedView'
import { HomeView } from '../views/HomeView'
import { useApp } from '../state/AppState'

export function AppShell() {
  const [view, setView] = useHashRoute()
  const { searchQuery } = useApp()
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const effectiveView: View = searchQuery
    ? { type: 'search', query: searchQuery }
    : view

  return (
    <div className="app-root">
      <Sidebar current={effectiveView} open={isSidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={setView} />
      <div className="app-main">
        <Header current={effectiveView} onNavigate={setView} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <div className="app-content">
          <NotificationBar />
          <div
            key={keyOfView(effectiveView)}
            className="animate-in"
          >
            <SwitchView view={effectiveView} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SwitchView({ view }: { view: View }) {
  switch (view.type) {
    case 'home':
      return <HomeView />
    case 'all':
      return <InboxView />
    case 'today':
      return <TodayView />
    case 'upcoming':
      return <UpcomingView />
    case 'calendar':
      return <CalendarView />
    case 'analytics':
      return <AnalyticsView />
    case 'project':
      return <ProjectView projectId={view.projectId} />
    case 'label':
      return <LabelView labelId={view.labelId} />
    case 'completed':
      return <CompletedView />
    case 'search':
      return <InboxView title={`Search: ${view.query}`} search={view.query} />
    default:
      return null
  }
}

function keyOfView(view: View): string {
  switch (view.type) {
    case 'project':
      return `project:${view.projectId}`
    case 'label':
      return `label:${view.labelId}`
    case 'search':
      return `search:${view.query}`
    default:
      return view.type
  }
}
