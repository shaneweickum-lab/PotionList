import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { useStore } from '../../store/index.js'
import TaskItem from './TaskItem.jsx'
import styles from './TaskList.module.css'

export default function TaskList() {
  const { todos, reorderTodos } = useStore()
  const now = Date.now()

  const visible = todos.filter(t => !t.nextDueAt || t.nextDueAt <= now)
  const resting = todos.filter(t => t.nextDueAt && t.nextDueAt > now)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  )

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = visible.findIndex(t => t.id === active.id)
    const newIndex = visible.findIndex(t => t.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderTodos(arrayMove(visible, oldIndex, newIndex).map(t => t.id))
    }
  }

  const isEmpty = visible.length === 0

  return (
    <div className={styles.list}>
      {isEmpty && resting.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>The list is empty.</p>
          <p className="lore">Add a task and begin the work.</p>
        </div>
      )}
      {isEmpty && resting.length > 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>All tasks complete.</p>
          <p className="lore">
            {resting.length === 1
              ? '1 task will return when its time comes.'
              : `${resting.length} tasks will return when their time comes.`}
          </p>
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={visible.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {visible.map(t => <TaskItem key={t.id} todo={t} />)}
        </SortableContext>
      </DndContext>
    </div>
  )
}
