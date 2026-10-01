import { motion } from 'framer-motion'
import { Task } from './TaskCard'

interface StatusInfo {
  label: string
  badge: string
}

const STATUS_LABELS: Record<string, StatusInfo> = {
  todo: { label: 'A Fazer', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  blocked: { label: 'Bloqueado', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  in_progress: { label: 'Em Andamento', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  ready_to_test: { label: 'Pronto p/ Teste', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  testing: { label: 'Em Teste', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  done: { label: 'Concluído', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
}

interface TableViewProps {
  tasks?: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TableView({ tasks = [], onEdit, onDelete }: TableViewProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500">
        <p className="text-xs sm:text-sm">Nenhuma tarefa encontrada para exibir na tabela.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Título & Descrição</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4">Prioridade</th>
              <th className="py-3.5 px-4">Tag</th>
              <th className="py-3.5 px-4">Data Limite</th>
              <th className="py-3.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {tasks.map((task) => {
              const statusInfo = STATUS_LABELS[task.status] || { label: task.status, badge: 'bg-slate-800 text-slate-300' }
              return (
                <tr key={task.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-medium ${statusInfo.badge}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${
                        task.priority === 'Alta' || task.priority === 'Urgente'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : task.priority === 'Média'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {task.priority || 'Média'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {task.tag ? (
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50">
                        {task.tag}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {task.dueDate ? task.dueDate : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(task)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/20 cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}