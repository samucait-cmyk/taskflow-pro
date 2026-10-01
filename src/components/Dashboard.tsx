import { Task } from './TaskCard'

interface DashboardProps {
  tasks?: Task[]
}

interface MetricItem {
  id: string
  label: string
  color: string
  barBg: string
}

export default function Dashboard({ tasks = [] }: DashboardProps) {
  const totalTasks = tasks.length

  const getCount = (status: string) => tasks.filter((t) => t.status === status).length
  const getPercentage = (status: string) => {
    if (totalTasks === 0) return 0
    return Math.round((getCount(status) / totalTasks) * 100)
  }

  const doneCount = getCount('done')
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0

  const metrics: MetricItem[] = [
    { id: 'todo', label: 'A Fazer', color: 'bg-amber-500', barBg: 'bg-amber-500/20' },
    { id: 'blocked', label: 'Bloqueado', color: 'bg-rose-500', barBg: 'bg-rose-500/20' },
    { id: 'in_progress', label: 'Em Andamento', color: 'bg-indigo-500', barBg: 'bg-indigo-500/20' },
    { id: 'ready_to_test', label: 'Pronto p/ Teste', color: 'bg-blue-500', barBg: 'bg-blue-500/20' },
    { id: 'testing', label: 'Em Teste', color: 'bg-purple-500', barBg: 'bg-purple-500/20' },
    { id: 'done', label: 'Concluído', color: 'bg-emerald-500', barBg: 'bg-emerald-500/20' },
  ]

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-lg backdrop-blur-md flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            📊 Dashboard de Indicadores
          </h2>
          <p className="text-[11px] text-slate-400">Métricas do projeto em tempo real</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl flex items-center gap-2">
          <span className="text-xs text-slate-400">Taxa de Conclusão:</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{completionRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {metrics.map((m) => {
          const count = getCount(m.id)
          const pct = getPercentage(m.id)
          return (
            <div key={m.id} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">
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
            </div>
          )
        })}
      </div>
    </div>
  )
}