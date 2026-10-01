import React from 'react'

export interface ChecklistItem {
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority?: 'Urgente' | 'Alta' | 'Média' | 'Baixa' | 'urgent' | 'high' | 'medium' | 'low' | string
  dueDate?: string
  tag?: string
  checklist?: ChecklistItem[]
  dependentOn?: string
  [key: string]: any
}

export interface TaskCardProps {
  task: Task
  allTasks?: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleChecklist?: (taskId: string, index: number) => void
  onStatusChange?: (taskId: string, newStatus: string) => void
  onMove?: (taskId: string, newStatus: string) => void
  onAddSubtaskInline?: (taskId: string, text: string) => void
}

const WORKFLOW_STAGES = ['todo', 'blocked', 'in_progress', 'ready_to_test', 'testing', 'done']

export default function TaskCard({
  task,
  allTasks = [],
  onEdit,
  onDelete,
  onToggleChecklist,
  onStatusChange,
  onMove,
}: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  // Suporte abrangente para prioridades em Português e Inglês
  const priorityColors: Record<string, string> = {
    Urgente: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    Alta: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Média: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Baixa: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  }

  const checklist = task.checklist || []
  const completedCount = checklist.filter((item) => item.completed).length
  const checklistPercentage = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0

  // Verificação de tarefa atrasada
  const isOverdue = (() => {
    if (!task.dueDate || task.status === 'done') return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(task.dueDate + 'T00:00:00')
    return due < today
  })()

  // Verificação de dependência bloqueada
  const dependentTask = allTasks.find((t) => t.id === task.dependentOn)
  const isBlockedByDependency = dependentTask && dependentTask.status !== 'done'

  // Navegação do cartão pelas setas
  const currentIndex = WORKFLOW_STAGES.indexOf(task.status)

  const moveTask = (targetStatus: string) => {
    if (onStatusChange) {
      onStatusChange(task.id, targetStatus)
    } else if (onMove) {
      onMove(task.id, targetStatus)
    }
  }

  const handlePrevStage = () => {
    if (currentIndex > 0) {
      moveTask(WORKFLOW_STAGES[currentIndex - 1])
    }
  }

  const handleNextStage = () => {
    if (currentIndex < WORKFLOW_STAGES.length - 1) {
      moveTask(WORKFLOW_STAGES[currentIndex + 1])
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-slate-900/90 border rounded-2xl p-4 shadow-md hover:border-slate-700 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3 group relative ${
        isOverdue ? 'border-rose-500/80 bg-rose-950/10 ring-1 ring-rose-500/30' : 'border-slate-800'
      }`}
    >
      {/* Cabeçalho do Cartão */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-100 text-xs sm:text-sm leading-snug">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          {isOverdue && (
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
              ⚠ Atrasado
            </span>
          )}
          {task.priority && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priorityColors[task.priority] || priorityColors.Média}`}>
              {task.priority}
            </span>
          )}
        </div>
      </div>

      {/* Descrição */}
      {task.description && (
        <p className="text-[11px] text-slate-400 line-click-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Alerta de Dependência */}
      {isBlockedByDependency && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px]">
          <span>🔒 Bloqueada por:</span>
          <span className="font-semibold truncate">{dependentTask.title}</span>
        </div>
      )}

      {/* Tags e Data Limite */}
      <div className="flex flex-wrap items-center gap-1.5">
        {task.tag && (
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-700/50">
            🏷️ {task.tag}
          </span>
        )}
        {task.dueDate && (
          <span className={`text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 border ${
            isOverdue
              ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 font-semibold'
              : 'bg-slate-800 text-slate-300 border-slate-700/50'
          }`}>
            📅 {task.dueDate}
          </span>
        )}
      </div>

      {/* Checklist / Subtarefas com Contador e Barra de Progresso Visual */}
      {checklist.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Subtarefas</span>
            <span className="font-mono">{completedCount}/{checklist.length} ({checklistPercentage}%)</span>
          </div>

          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${checklistPercentage}%` }}
            />
          </div>

          <div className="flex flex-col gap-1 mt-1">
            {checklist.map((item, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleChecklist && onToggleChecklist(task.id, idx)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                />
                <span className={item.completed ? 'line-through text-slate-500' : ''}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé com Navegação de Duas Setas (◀ e ▶) e Ações */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 mt-1">
        {/* Setas para Navegação entre Colunas */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevStage}
            disabled={currentIndex <= 0}
            title={currentIndex <= 0 ? 'Já está no início' : 'Mover para a coluna anterior'}
            className={`px-2 py-1 rounded-lg border text-xs font-bold transition-all ${
              currentIndex <= 0
                ? 'bg-slate-950/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700/60 cursor-pointer'
            }`}
          >
            ◀
          </button>

          <button
            type="button"
            onClick={handleNextStage}
            disabled={currentIndex >= WORKFLOW_STAGES.length - 1}
            title={currentIndex >= WORKFLOW_STAGES.length - 1 ? 'Já está concluído' : 'Mover para a próxima coluna'}
            className={`px-2 py-1 rounded-lg border text-xs font-bold transition-all ${
              currentIndex >= WORKFLOW_STAGES.length - 1
                ? 'bg-slate-950/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700/60 cursor-pointer'
            }`}
          >
            ▶
          </button>
        </div>

        {/* Botões Editar e Excluir */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="px-2.5 py-1 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-[11px] font-semibold text-rose-300 transition-colors cursor-pointer border border-rose-900/40"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}