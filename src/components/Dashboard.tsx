import { motion } from 'framer-motion'
import { Task } from './TaskCard'

interface DashboardProps {
  tasks?: Task[]
  selectedStatus?: string | null
  onSelectStatus?: (status: string | null) => void
  searchTerm?: string
  onSearchChange?: (term: string) => void
  selectedPriority?: string
  onPriorityChange?: (priority: string) => void
  selectedTag?: string
  onTagChange?: (tag: string) => void
  sortBy?: string
  onSortChange?: (sort: string) => void
  onlyOverdue?: boolean
  onToggleOverdue?: () => void
}

interface MetricItem {
  id: string
  label: string
  color: string
  barBg: string
}

export default function Dashboard({
  tasks = [],
  selectedStatus = null,
  onSelectStatus = () => {},
  searchTerm = '',
  onSearchChange = () => {},
  selectedPriority = 'all',
  onPriorityChange = () => {},
  selectedTag = 'all',
  onTagChange = () => {},
  sortBy = 'default',
  onSortChange = () => {},
  onlyOverdue = false,
  onToggleOverdue = () => {},
}: DashboardProps) {
  const totalTasks = tasks.length

  const getCount = (status: string) => tasks.filter((t) => t.status === status).length
  const getPercentage = (status: string) => {
    if (totalTasks === 0) return 0
    return Math.round((getCount(status) / totalTasks) * 100)
  }

  const doneCount = getCount('done')
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0

  // Extrair tags únicas dinamicamente das tarefas
  const uniqueTags = Array.from(new Set(tasks.map((t) => t.tag).filter(Boolean)))

  const metrics: MetricItem[] = [
    { id: 'todo', label: 'A Fazer', color: 'bg-amber-500', barBg: 'bg-amber-500/20' },
    { id: 'blocked', label: 'Bloqueado', color: 'bg-rose-500', barBg: 'bg-rose-500/20' },
    { id: 'in_progress', label: 'Em Andamento', color: 'bg-indigo-500', barBg: 'bg-indigo-500/20' },
    { id: 'ready_to_test', label: 'Pronto p/ Teste', color: 'bg-blue-500', barBg: 'bg-blue-500/20' },
    { id: 'testing', label: 'Em Teste', color: 'bg-purple-500', barBg: 'bg-purple-500/20' },
    { id: 'done', label: 'Concluído', color: 'bg-emerald-500', barBg: 'bg-emerald-500/20' },
  ]

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-4">
      {/* Cabeçalho do Dashboard */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            📊 Dashboard de Indicadores & Filtros Avançados
          </h2>
          <p className="text-[11px] text-slate-400">Métricas em tempo real e gestão inteligente de tarefas</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl flex items-center gap-2 shadow-inner">
          <span className="text-xs text-slate-400">Taxa de Conclusão:</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{completionRate}%</span>
        </div>
      </div>

      {/* Cartões de Métricas (Clicáveis para Filtrar por Status) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {metrics.map((m) => {
          const count = getCount(m.id)
          const pct = getPercentage(m.id)
          const isSelected = selectedStatus === m.id

          return (
            <motion.div
              key={m.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectStatus(isSelected ? null : m.id)}
              className={`cursor-pointer p-3 rounded-xl flex flex-col gap-2 transition-all border ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">{m.label}</span>
                <span className={`w-2 h-2 rounded-full ${m.color}`} />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-slate-100 font-mono">{count}</span>
                <span className="text-[10px] text-slate-400 font-medium">{pct}%</span>
              </div>

              <div className={`w-full h-1.5 rounded-full overflow-hidden ${m.barBg}`}>
                <div
                  className={`h-full transition-all duration-500 ${m.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Barra de Filtros Avançados e Ordenação */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Pesquisa por Texto */}
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar tarefas..."
              className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Filtro por Prioridade */}
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Todas Prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>

          {/* Filtro por Tag */}
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Todas as Tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Ordenação Inteligente */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="default">Ordenar: Padrão</option>
            <option value="dueDate">Data Limite (Mais próxima)</option>
            <option value="priority">Prioridade (Alta → Baixa)</option>
            <option value="alphabetical">Alfabética (A → Z)</option>
          </select>

          {/* Toggle Tarefas Atrasadas */}
          <button
            onClick={onToggleOverdue}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
              onlyOverdue
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>⚠️</span> Atrasadas
          </button>
        </div>
      </div>
    </div>
  )
}