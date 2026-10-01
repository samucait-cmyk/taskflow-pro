import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard, { Task } from './TaskCard'

interface ColumnConfigItem {
  label: string
  badge: string
  dot: string
  border: string
  defaultLimit: number
}

const COLUMN_CONFIG: Record<string, ColumnConfigItem> = {
  todo: {
    label: 'A Fazer',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
    border: 'border-amber-500/30',
    defaultLimit: 5,
  },
  blocked: {
    label: 'Bloqueado',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-500',
    border: 'border-rose-500/30',
    defaultLimit: 3,
  },
  in_progress: {
    label: 'Em Andamento',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    dot: 'bg-indigo-500',
    border: 'border-indigo-500/30',
    defaultLimit: 4,
  },
  ready_to_test: {
    label: 'Pronto p/ Teste',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-500',
    border: 'border-blue-500/30',
    defaultLimit: 4,
  },
  testing: {
    label: 'Em Teste',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    dot: 'bg-purple-500',
    border: 'border-purple-500/30',
    defaultLimit: 3,
  },
  done: {
    label: 'Concluído',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    border: 'border-emerald-500/30',
    defaultLimit: 10,
  },
}

export interface ColumnData {
  id?: string
  title?: string
  wipLimit?: number
}

interface KanbanColumnProps {
  title?: string
  status?: string
  color?: string
  dotColor?: string
  maxLimit?: number
  column?: ColumnData
  tasks?: Task[]
  allTasks?: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove?: (taskId: string, newStatus: string) => void
  onStatusChange?: (taskId: string, newStatus: string) => void
  onToggleChecklist?: (taskId: string, index: number) => void
  onQuickAdd?: (status: string) => void
  onUpdateWipLimit?: (status: string, newLimit: number) => void
  onAddSubtaskInline?: (taskId: string, text: string) => void
}

export default function KanbanColumn({
  title,
  status,
  color,
  dotColor,
  maxLimit,
  column,
  tasks = [],
  allTasks = [],
  onEdit,
  onDelete,
  onMove,
  onStatusChange,
  onToggleChecklist,
  onQuickAdd,
  onUpdateWipLimit,
  onAddSubtaskInline,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const currentStatus = status || (column && column.id) || 'todo'
  const config = COLUMN_CONFIG[currentStatus] || COLUMN_CONFIG.todo

  const displayTitle = title || (column && column.title) || config.label
  const limit = maxLimit || config.defaultLimit
  const borderStyle = color || config.border
  const dotStyle = dotColor || config.dot

  const taskCount = tasks.length
  const isWipExceeded = taskCount > limit
  const wipPercentage = Math.min(Math.round((taskCount / limit) * 100), 100)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      if (onStatusChange) {
        onStatusChange(taskId, currentStatus)
      } else if (onMove) {
        onMove(taskId, currentStatus)
      }
    }
  }

  const handleEditWipPrompt = () => {
    const newLimitStr = prompt(`Digite o novo Limite WIP para a coluna "${displayTitle}":`, limit.toString())
    if (newLimitStr !== null) {
      const parsed = parseInt(newLimitStr, 10)
      if (!isNaN(parsed) && parsed > 0 && onUpdateWipLimit) {
        onUpdateWipLimit(currentStatus, parsed)
      }
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl bg-slate-900/50 border backdrop-blur-md transition-all duration-300 min-h-[520px] p-3.5 gap-3 relative overflow-hidden ${
        isWipExceeded
          ? 'border-rose-500/80 bg-rose-950/10 ring-2 ring-rose-500/30 shadow-lg shadow-rose-900/20'
          : isDragOver
          ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30 shadow-xl'
          : `${borderStyle} shadow-md`
      }`}
    >
      {/* Alerta de estouro de Limite WIP */}
      {isWipExceeded && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-rose-600 to-red-600 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 text-center shadow-sm animate-pulse">
          ⚠️ Limite WIP Excedido ({taskCount}/{limit})
        </div>
      )}

      {/* Cabeçalho da Coluna */}
      <div className={`flex flex-col gap-2 pt-1 ${isWipExceeded ? 'mt-3' : ''}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dotStyle} shadow-sm`} />
            <h3 className="font-extrabold text-slate-100 text-xs sm:text-sm uppercase tracking-wider">
              {displayTitle}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleEditWipPrompt}
              title="Clique para editar o limite WIP desta coluna"
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer hover:scale-105 ${
                isWipExceeded
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-indigo-500'
              }`}
            >
              {taskCount}/{limit} ✏️
            </button>

            {onQuickAdd && (
              <button
                onClick={() => onQuickAdd(currentStatus)}
                title="Adicionar tarefa nesta coluna"
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs cursor-pointer"
              >
                +
              </button>
            )}
          </div>
        </div>

        {/* Indicador Numérico de WIP e Barra de Progresso */}
        <div className="flex flex-col gap-1 border-t border-slate-800/80 pt-2">
          <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span className={isWipExceeded ? 'text-rose-400 font-bold' : ''}>
              Limite WIP: máx. {limit} itens
            </span>
            <span className="font-mono text-[10px]">{wipPercentage}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
            <div
              className={`h-full transition-all duration-500 ${
                isWipExceeded
                  ? 'bg-rose-500 shadow-md shadow-rose-500/50'
                  : wipPercentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(wipPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="h-0.5 w-full bg-slate-800/60 rounded-full" />

      {/* Lista de Cartões da Coluna */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-0.5">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  allTasks={allTasks}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMove={onMove}
                  onStatusChange={onStatusChange}
                  onToggleChecklist={onToggleChecklist}
                  onAddSubtaskInline={onAddSubtaskInline}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed rounded-xl transition-all ${
                isDragOver
                  ? 'border-indigo-500/80 bg-indigo-500/5'
                  : 'border-slate-800/60 bg-slate-950/20'
              }`}
            >
              <span className="text-2xl mb-2 opacity-50">📥</span>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[180px]">
                Arraste tarefas para aqui ou crie uma nova
              </p>
              {onQuickAdd && (
                <button
                  onClick={() => onQuickAdd(currentStatus)}
                  className="mt-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  + Nova Tarefa
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rodapé Informativo */}
      <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Estado: {config.label}</span>
        {isWipExceeded && <span className="text-rose-400 font-bold">⚠️ Atenção ao Fluxo</span>}
      </div>
    </div>
  )
}