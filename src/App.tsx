import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import KanbanColumn from './components/KanbanColumn'
import TableView from './components/TableView'
import TaskModal from './components/TaskModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Task } from './types/kanban'

const COLUMNS = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'blocked', title: 'Bloqueado' },
  { id: 'in_progress', title: 'Em Andamento' },
  { id: 'ready_to_test', title: 'Pronto p/ Teste' },
  { id: 'testing', title: 'Em Teste' },
  { id: 'done', title: 'Concluído' },
]

const DEFAULT_WIP_LIMITS: Record<string, number> = {
  todo: 5,
  blocked: 3,
  in_progress: 4,
  ready_to_test: 4,
  testing: 3,
  done: 10,
}

// Configuração de temas de cores
const THEME_CLASSES: Record<string, string> = {
  slate: 'bg-slate-950 text-slate-100',
  emerald: 'bg-zinc-950 text-emerald-100',
  obsidian: 'bg-neutral-950 text-purple-100',
  light: 'bg-slate-100 text-slate-900',
}

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Criar tela de carregamento',
    description: 'Carregamento de informações',
    status: 'todo',
    priority: 'Alta',
    tag: 'Design',
    dueDate: '2026-10-15',
    checklist: [],
  },
  {
    id: '2',
    title: 'Criar login',
    description: 'Criar acesso de login',
    status: 'todo',
    priority: 'Média',
    tag: 'Frontend',
    dueDate: '2026-09-01',
    checklist: [
      { text: 'Criar login_fase 1', completed: true },
      { text: 'Criar a senha', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Criação de animação',
    description: 'Animação de função.',
    status: 'ready_to_test',
    priority: 'Alta',
    tag: 'Frontend',
    dueDate: '2026-11-15',
    checklist: [],
  },
]

export default function App() {
  // Utilizando o nosso hook personalizado para persistência de tarefas
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow_tasks', INITIAL_TASKS)

  const [wipLimits, setWipLimits] = useState(() => {
    const saved = localStorage.getItem('taskflow_wip_limits')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return DEFAULT_WIP_LIMITS
  })

  // Estado do Tema de Cores
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskflow_theme') || 'slate'
  })

  // Filtros e Modos Visuais
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [viewMode, setViewMode] = useState('kanban')
  const [fontSize, setFontSize] = useState(16)
  const [onlyOverdue, setOnlyOverdue] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Modais e Toasts
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = (message: string, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  const handleIncreaseFont = () => setFontSize((prev) => Math.min(prev + 2, 22))
  const handleDecreaseFont = () => setFontSize((prev) => Math.max(prev - 2, 12))

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    document.body.style.fontSize = `${fontSize}px`
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('taskflow_wip_limits', JSON.stringify(wipLimits))
  }, [wipLimits])

  useEffect(() => {
    localStorage.setItem('taskflow_theme', theme)
  }, [theme])

  const handleUpdateWipLimit = (columnId: string, newLimit: number) => {
    setWipLimits((prev: any) => ({ ...prev, [columnId]: newLimit }))
    showToast(`Limite WIP atualizado para ${newLimit}!`)
  }

  const handleClearFilters = () => {
    setSearch('')
    setPriorityFilter('')
    setTagFilter('')
    setSortBy('default')
    setOnlyOverdue(false)
    showToast('Filtros redefinidos!', 'info')
  }

  // Filtragem
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true
    const matchesTag = tagFilter ? task.tag === tagFilter : true

    let matchesOverdue = true
    if (onlyOverdue) {
      if (!task.dueDate || task.status === 'done') {
        matchesOverdue = false
      } else {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const due = new Date(task.dueDate + 'T00:00:00')
        matchesOverdue = due < today
      }
    }

    return matchesSearch && matchesPriority && matchesTag && matchesOverdue
  })

  // Ordenação
  const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
    if (sortBy === 'priority') {
      const weights: Record<string, number> = { Urgente: 4, Alta: 3, Média: 2, Baixa: 1 }
      return (weights[b.priority] || 0) - (weights[a.priority] || 0)
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    return 0
  })

  const handleCreateOrUpdateTask = (taskData: any) => {
    if (editingTask && editingTask.id) {
      setTasks(tasks.map((t: any) => (t.id === editingTask.id ? { ...t, ...taskData } : t)))
      showToast('Tarefa atualizada com sucesso!')
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
      }
      setTasks([newTask, ...tasks])
      showToast('Nova tarefa criada com sucesso!')
    }
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t: any) => t.id !== taskId))
    showToast('Tarefa eliminada!', 'info')
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(tasks.map((t: any) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    showToast('Estado da tarefa atualizado!')
  }

  const handleToggleChecklist = (taskId: string, subtaskIdx: number) => {
    setTasks(
      tasks.map((task: any) => {
        if (task.id !== taskId) return task
        const updatedChecklist = [...(task.checklist || [])]
        updatedChecklist[subtaskIdx].completed = !updatedChecklist[subtaskIdx].completed
        return { ...task, checklist: updatedChecklist }
      })
    )
  }

  const handleAddSubtaskInline = (taskId: string, text: string) => {
    setTasks(
      tasks.map((task: any) => {
        if (task.id !== taskId) return task
        const updatedChecklist = [...(task.checklist || []), { text, completed: false }]
        return { ...task, checklist: updatedChecklist }
      })
    )
    showToast('Subtarefa adicionada!')
  }

  // Backups
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Backup JSON exportado!')
  }

  const handleExportCSV = () => {
    if (tasks.length === 0) {
      showToast('Sem tarefas para exportar.', 'error')
      return
    }
    const headers = ['ID', 'Título', 'Descrição', 'Status', 'Prioridade', 'Tag', 'Data Limite']
    const rows = tasks.map((t: any) => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.status,
      t.priority || '',
      t.tag || '',
      t.dueDate || '',
    ])

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `taskflow_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    showToast('Planilha CSV gerada!')
  }

  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8')
      fileReader.onload = (event) => {
        try {
          const importedTasks = JSON.parse(event.target?.result as string)
          if (Array.isArray(importedTasks)) {
            setTasks(importedTasks)
            showToast('Backup importado!')
          } else {
            showToast('Ficheiro inválido.', 'error')
          }
        } catch {
          showToast('Erro ao ler ficheiro.', 'error')
        }
      }
    }
  }

  const hasActiveFilters = search || priorityFilter || tagFilter || sortBy !== 'default' || onlyOverdue

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white transition-all ${THEME_CLASSES[theme] || THEME_CLASSES.slate}`}>
      <Header
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        currentFontSize={fontSize}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        theme={theme}
        setTheme={setTheme}
        onNewTask={() => {
          setEditingTask(null)
          setIsModalOpen(true)
        }}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
        {/* Painéis Superiores */}
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
                🚀 Taskflow Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Gerencie suas tarefas com eficiência, foco e produtividade máxima.
              </p>
            </div>

            <Dashboard tasks={tasks} />
          </motion.div>
        )}

        {/* Barra de Filtros */}
        <div className="flex flex-col lg:flex-row items-center gap-3 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Pesquisar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
            {/* Filtro por Prioridade */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Todas Prioridades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>

            {/* Filtro por Tag */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Todas Tags</option>
              <option value="Design">Design</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Bug">Bug</option>
              <option value="DevOps">DevOps</option>
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="col-span-2 sm:col-span-1 w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="default">↕ Ordenar: Padrão</option>
              <option value="priority">⚡ Prioridade (Alta → Baixa)</option>
              <option value="dueDate">📅 Data Limite (Mais Urgente)</option>
            </select>

            {/* Botão Atrasadas */}
            <button
              onClick={() => setOnlyOverdue(!onlyOverdue)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                onlyOverdue
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚠️ Atrasadas
            </button>

            {/* Limpar Filtros */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                ✕ Limpar
              </button>
            )}

            {/* Backups */}
            <div className="col-span-2 sm:col-span-auto flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={handleExportBackup}
                title="Descarregar backup completo em JSON"
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                💾 JSON
              </button>

              <button
                onClick={handleExportCSV}
                title="Exportar dados para formato CSV (Excel)"
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                📊 CSV
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportBackup}
                accept=".json"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Carregar backup de ficheiro JSON"
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                📂 Importar
              </button>
            </div>

            {/* Alternador Kanban / Tabela */}
            <div className="col-span-2 sm:col-span-auto flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabela (List)
              </button>
            </div>
          </div>
        </div>

        {/* Contador */}
        <div className="text-xs text-slate-400 font-medium px-1">
          Mostrando <span className="text-slate-200 font-bold">{sortedTasks.length}</span> de {tasks.length} tarefas
        </div>

        {/* Kanban ou Tabela */}
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-start pb-6"
            >
              {COLUMNS.map((col) => {
                const columnTasks = sortedTasks.filter((t: any) => t.status === col.id)
                return (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    maxLimit={wipLimits[col.id]}
                    tasks={columnTasks}
                    allTasks={tasks}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onMove={handleStatusChange}
                    onStatusChange={handleStatusChange}
                    onToggleChecklist={handleToggleChecklist}
                    onAddSubtaskInline={handleAddSubtaskInline}
                    onUpdateWipLimit={handleUpdateWipLimit}
                    onQuickAdd={(colId: string) => {
                      setEditingTask({ status: colId })
                      setIsModalOpen(true)
                    }}
                  />
                )
              })}
            </motion.div>
          ) : (
            <TableView
              key="table"
              tasks={sortedTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={editingTask}
        allTasks={tasks}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                : toast.type === 'info'
                ? 'bg-slate-900/90 text-slate-200 border-slate-700/60'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
            }`}
          >
            <span>{toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✅'}</span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}