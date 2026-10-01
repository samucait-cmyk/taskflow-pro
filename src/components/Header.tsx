import PomodoroTimer from './PomodoroTimer'

interface HeaderProps {
  onNewTask: () => void
  onIncreaseFont?: () => void
  onDecreaseFont?: () => void
  currentFontSize?: number
  isFocusMode?: boolean
  onToggleFocusMode?: () => void
  theme?: string
  setTheme: (theme: string) => void
}

export default function Header({
  onNewTask,
  onIncreaseFont,
  onDecreaseFont,
  isFocusMode,
  onToggleFocusMode,
  theme,
  setTheme,
}: HeaderProps) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Esquerda: Logo & Marca + Ajuste de Texto (Apenas Mobile/Tablet) */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2 rounded-2xl font-extrabold text-lg shadow-lg shadow-indigo-500/25">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-100 text-sm sm:text-base tracking-tight">
                  TaskFlow Pro
                </h1>
                <span className="text-[9px] sm:text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Enterprise Agile
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
                Gestão de Quadros Kanban de Alta Performance
              </p>
            </div>
          </div>

          {/* Ajuste de Texto para Mobile / Tablet */}
          <div className="flex lg:hidden items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-semibold hidden xs:inline">
              Texto:
            </span>
            <button
              onClick={onDecreaseFont}
              title="Diminuir tamanho do texto"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer active:scale-95 border border-slate-700/50"
            >
              A-
            </button>
            <button
              onClick={onIncreaseFont}
              title="Aumentar tamanho do texto"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm shadow-indigo-500/30"
            >
              A+
            </button>
          </div>
        </div>

        {/* Centro: Temporizador Pomodoro Centralizado */}
        <div className="flex-1 flex justify-center w-full md:w-auto">
          <PomodoroTimer />
        </div>

        {/* Direita: Seletor de Tema + Modo Foco + Botão Nova Tarefa */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Seletor de Tema de Cor */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-medium hidden sm:inline">
              🎨 Tema:
            </span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl px-2 py-1 text-xs focus:outline-none cursor-pointer"
            >
              <option value="slate">🌙 Slate Indigo</option>
              <option value="emerald">🟢 Midnight Emerald</option>
              <option value="obsidian">🟣 Obsidian Violet</option>
              <option value="light">☀️ Clean Light</option>
            </select>
          </div>

          <button
            onClick={onToggleFocusMode}
            title={isFocusMode ? 'Sair do Modo Foco' : 'Ativar Modo Foco (Oculta painéis)'}
            className={`px-3 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isFocusMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
            }`}
          >
            <span>{isFocusMode ? '👁️' : '🧘'}</span>
            <span className="hidden sm:inline">{isFocusMode ? 'Exibir Dashboard' : 'Modo Foco'}</span>
          </button>

          <button
            onClick={onNewTask}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>
    </header>
  )
}