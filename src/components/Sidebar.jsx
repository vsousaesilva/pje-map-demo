import {
  ClipboardList, Users, Building2, Calendar, Settings,
} from 'lucide-react'

const navItems = [
  { id: 'automacao',    label: 'Processos',      icon: ClipboardList, section: 'Gestão' },
  { id: 'peritos',      label: 'Peritos',         icon: Users,         section: 'Gestão' },
  { id: 'salas',        label: 'Salas',           icon: Building2,     section: 'Gestão' },
  { id: 'agenda',       label: 'Agenda',          icon: Calendar,      section: 'Configuração' },
  { id: 'config',       label: 'Configurações',   icon: Settings,      section: 'Configuração' },
]

export default function Sidebar({ current, onChange, pendingCount }) {
  const sections = ['Gestão', 'Configuração']

  return (
    <nav
      style={{ background: 'var(--pje-sidebar)' }}
      className="w-52 flex-shrink-0 flex flex-col overflow-y-auto"
    >
      {sections.map((section) => (
        <div key={section} className="pt-5 pb-2">
          <div className="px-4 pb-2 text-[10px] font-bold tracking-widest text-white/30 uppercase">
            {section}
          </div>
          {navItems
            .filter((n) => n.section === section)
            .map(({ id, label, icon: Icon }) => {
              const active = current === id
              return (
                <button
                  key={id}
                  onClick={() => onChange(id)}
                  className={`
                    w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors
                    border-l-[3px]
                    ${active
                      ? 'bg-[var(--pje-blue)] text-white font-semibold border-[var(--pje-accent)]'
                      : 'text-white/65 border-transparent hover:bg-[var(--pje-hover)] hover:text-white'}
                  `}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span>{label}</span>
                  {id === 'automacao' && pendingCount > 0 && (
                    <span
                      style={{ background: 'var(--pje-accent)', color: '#111' }}
                      className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              )
            })}
        </div>
      ))}

      <div className="mt-auto p-4 border-t border-white/10 text-[11px] text-white/30 leading-relaxed">
        <div>Versão 1.0.0-demo</div>
        <div>Unidade: JFCE-01</div>
        <div className="mt-1 text-white/40">Modo: Automático ✓</div>
      </div>
    </nav>
  )
}
