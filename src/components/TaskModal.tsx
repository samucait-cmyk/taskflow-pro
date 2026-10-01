import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Task, ChecklistItem } from './TaskCard'

interface TaskModalProps {
  isOpen?: boolean
  onClose: () => void
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'>) => void
  taskToEdit?: Task | null
  allTasks?: Task[]
}

export default function TaskModal({
  isOpen = false,
  onClose,
  onSave,
  taskToEdit,
  allTasks = [],
}: TaskModalProps) {
  if (!isOpen) return null

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [status, setStatus] = useState<string>('todo')
  const [priority, setPriority] = useState<string>('Alta')
  const [tag, setTag] = useState<string>('Design')
  const [dueDate, setDueDate] = useState<string>('')
  const [dependencyId, setDependencyId] = useState<string>('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [newSubtask, setNewSubtask] = useState<string>('')

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '')
      setDescription(taskToEdit.description || '')
      setStatus(taskToEdit.status || 'todo')
      setPriority(taskToEdit.priority || 'Alta')
      setTag(taskToEdit.tag || 'Design')
      setDueDate(taskToEdit.dueDate || '')
      setDependencyId(taskToEdit.dependencyId || '')
      setChecklist(taskToEdit.checklist || [])
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('Alta')
      setTag('Design')
      setDueDate(new Date().toISOString().split('T')[0])
      setDependencyId('')
      setChecklist([])
    }
  }, [taskToEdit, isOpen])

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    setChecklist([...checklist, { text: newSubtask.trim(), completed: false }])
    setNewSubtask('')
  }

  const handleRemoveSubtask = (idx: number) => {
    setChecklist(checklist.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title,
      description,
      status,
      priority,
      tag,
      dueDate,
      dependencyId,
      checklist,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold">
            {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">Título *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Criar tela de carregamento"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">Descrição</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais da tarefa..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Status / Coluna</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="todo">A Fazer</option>
                <option value="blocked">Bloqueado</option>
                <option value="in_progress">Em Andamento</option>
                <option value="ready_to_test">Pronto p/ Teste</option>
                <option value="testing">Em Teste</option>
                <option value="done">Concluído</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Design">Design</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Bug">Bug</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Data Limite</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Vincular Dependência */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span>🔗</span> Vincular a outra Tarefa (Dependência)
            </label>
            <select
              value={dependencyId}
              onChange={(e) => setDependencyId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Nenhuma tarefa vinculada</option>
              {allTasks
                .filter((t) => t.id !== taskToEdit?.id)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Checklist e Subtarefas */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300">Checklist</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Adicionar subtarefa..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 cursor-pointer"
              >
                Adicionar
              </button>
            </div>

            {checklist.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-xs">
                    <span className="text-slate-300">{item.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      className="text-rose-400 hover:text-rose-300 text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}