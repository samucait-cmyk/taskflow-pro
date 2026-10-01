import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type PomodoroMode = 'focus' | 'break'

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem('taskflow_pomodoro_timeLeft')
    return saved !== null ? parseInt(saved, 10) : 25 * 60
  })

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskflow_pomodoro_isRunning')
    return saved !== null ? JSON.parse(saved) : false
  })

  const [mode, setMode] = useState<PomodoroMode>(() => {
    const saved = localStorage.getItem('taskflow_pomodoro_mode')
    return (saved as PomodoroMode) || 'focus'
  })

  const [isOvertime, setIsOvertime] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskflow_pomodoro_isOvertime')
    return saved !== null ? JSON.parse(saved) : false
  })

  const [overtimeSeconds, setOvertimeSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('taskflow_pomodoro_overtimeSeconds')
    return saved !== null ? parseInt(saved, 10) : 0
  })

  const [showPopup, setShowPopup] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskflow_pomodoro_showPopup')
    return saved !== null ? JSON.parse(saved) : false
  })

  // Sincroniza todas as alterações de estado no localStorage em tempo real
  useEffect(() => {
    localStorage.setItem('taskflow_pomodoro_timeLeft', timeLeft.toString())
    localStorage.setItem('taskflow_pomodoro_isRunning', JSON.stringify(isRunning))
    localStorage.setItem('taskflow_pomodoro_mode', mode)
    localStorage.setItem('taskflow_pomodoro_isOvertime', JSON.stringify(isOvertime))
    localStorage.setItem('taskflow_pomodoro_overtimeSeconds', overtimeSeconds.toString())
    localStorage.setItem('taskflow_pomodoro_showPopup', JSON.stringify(showPopup))
  }, [timeLeft, isRunning, mode, isOvertime, overtimeSeconds, showPopup])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isRunning) {
      timer = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft((prev) => {
            if (prev === 1) {
              setIsOvertime(true)
              setShowPopup(true)
            }
            return prev - 1
          })
        } else {
          setOvertimeSeconds((prev) => prev + 1)
        }
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = (newMode: PomodoroMode = mode) => {
    setIsRunning(false)
    setIsOvertime(false)
    setOvertimeSeconds(0)
    setShowPopup(false)
    setMode(newMode)
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60)
  }

  const handleSwitchModeAfterLimit = (targetMode: PomodoroMode) => {
    resetTimer(targetMode)
    setIsRunning(true)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const otMinutes = Math.floor(overtimeSeconds / 60)
  const otSeconds = overtimeSeconds % 60
  const formattedOvertime = `+${String(otMinutes).padStart(2, '0')}:${String(otSeconds).padStart(2, '0')}`

  return (
    <div className="relative flex items-center gap-3.5 bg-slate-900 border border-slate-800/90 px-4 py-2 rounded-2xl shadow-inner text-sm">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{mode === 'focus' ? '🎯' : '☕'}</span>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            {mode === 'focus' ? 'FOCO' : 'PAUSA'}
            {isOvertime && <span className="text-rose-400 animate-pulse ml-1">• EXCEDIDO</span>}
          </span>
          <span className={`font-mono text-base font-extrabold tracking-tight ${isOvertime ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
            {isOvertime ? formattedOvertime : formattedTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-l border-slate-800/80 pl-3">
        <button
          onClick={toggleTimer}
          className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
          }`}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>

        <button
          onClick={() => resetTimer(mode)}
          title="Reiniciar temporizador"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer text-xs"
        >
          🔄
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-800/80 pl-3">
        <button
          onClick={() => resetTimer('focus')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            mode === 'focus' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          25m
        </button>
        <button
          onClick={() => resetTimer('break')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            mode === 'break' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          5m
        </button>
      </div>

      {/* Popup de Overtime */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-80 bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="text-xs font-bold text-rose-300">
                    {mode === 'focus' ? 'Tempo de Foco Esgotado!' : 'Pausa Terminada!'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Você ultrapassou o limite estipulado.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPopup(false)} className="text-slate-500 hover:text-slate-300 text-xs font-bold cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Tempo excedido:</span>
              <span className="font-mono font-bold text-rose-400">{formattedOvertime}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {mode === 'focus' ? (
                <>
                  <button
                    onClick={() => handleSwitchModeAfterLimit('break')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer"
                  >
                    ☕ Pausa (5m)
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl cursor-pointer"
                  >
                    Continuar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSwitchModeAfterLimit('focus')}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer"
                  >
                    🎯 Foco (25m)
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl cursor-pointer"
                  >
                    Estender
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}