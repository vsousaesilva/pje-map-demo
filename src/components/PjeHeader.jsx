export default function PjeHeader({ activeProcess }) {
  return (
    <header
      style={{ background: 'var(--pje-blue)', borderBottom: '3px solid var(--pje-accent)' }}
      className="flex items-center gap-4 px-5 h-14 flex-shrink-0 text-white"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <span
          style={{ background: 'var(--pje-accent)', color: '#111' }}
          className="text-xs font-black px-2 py-0.5 rounded tracking-widest"
        >
          PJe
        </span>
        <span className="font-bold text-base tracking-tight">
          MAP — Motor de Agendamento de Perícias
        </span>
      </div>

      <div className="w-px h-7 bg-white/20" />

      <span className="text-sm opacity-75">
        Protótipo de Demonstração · TRF5 / JFCE
      </span>

      {/* Active process badge */}
      {activeProcess && (
        <span className="ml-auto font-mono text-xs opacity-60 truncate max-w-xs">
          Processo: {activeProcess}
        </span>
      )}
    </header>
  )
}
