import { useMemo } from 'react'
import { useApp } from '../state/AppState'
import { TaskList } from '../components/TaskList'

export function CompletedView() {
  const { tasks } = useApp()
  const list = useMemo(() => {
    return tasks.filter((t) => t.completed).sort(sortTasks)
  }, [tasks])

  return (
    <section>
      <h2>Completed</h2>
      <TaskList tasks={list} emptyText="No completed tasks." showAddRow={false} />
    </section>
  )
}

function sortTasks(a: any, b: any) {
  const at = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY
  const bt = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY
  if (at !== bt) return at - bt
  return a.priority - b.priority
}
