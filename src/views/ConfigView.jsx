export default function ConfigView() {
  const params = [
    {
      label: 'Motor de Agendamento Automático',
      desc: 'Quando ativo, o sistema agenda automaticamente ao receber o processo',
      value: 'Automático',
      cls: 'bg-green-50 text-green-700 border border-green-300',
    },
    {
      label: 'Critério de Desempate',
      desc: 'Regra aplicada quando mais de um perito está disponível para a mesma especialidade',
      value: 'Menor carga mensal',
      cls: 'bg-blue-50 text-blue-700 border border-blue-300',
    },
    {
      label: 'Regra de Trava de Sala',
      desc: 'Se um perito já possui sala reservada no mesmo turno, o sistema confirma a mesma sala',
      value: 'Ativa',
      cls: 'bg-purple-50 text-purple-700 border border-purple-300',
    },
    {
      label: 'Fallback — Sem Vaga',
      desc: 'Comportamento quando nenhum perito disponível é encontrado nos próximos 42 dias',
      value: 'Designação Manual',
      cls: 'bg-orange-50 text-orange-700 border border-orange-300',
    },
    {
      label: 'Modo de Atendimento — Consultório',
      desc: 'Peritos com local "Consultório" não requerem verificação de sala na sede',
      value: 'Sem trava de sala',
      cls: 'bg-teal-50 text-teal-700 border border-teal-300',
    },
    {
      label: 'Horizonte de Busca',
      desc: 'Janela máxima para busca de disponibilidade a partir da data de referência',
      value: '42 dias',
      cls: 'bg-gray-50 text-gray-700 border border-gray-300',
    },
    {
      label: 'Unidade Jurisdicional',
      desc: 'Unidade atualmente configurada no protótipo de demonstração',
      value: 'JFCE-01',
      cls: 'bg-blue-50 text-blue-800 border border-blue-300 font-mono',
    },
  ]

  return (
    <div className="p-6 main-scroll overflow-y-auto h-full flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--pje-blue)] tracking-tight">Configurações da Unidade</h1>
        <p className="text-sm text-gray-500 mt-0.5">Parâmetros operacionais do motor de agendamento — JFCE-01</p>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-bold text-[var(--pje-blue)] uppercase tracking-wide">⚙️ Parâmetros do Motor</span>
        </div>
        <div className="divide-y divide-gray-100">
          {params.map((p) => (
            <div key={p.label} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-semibold text-gray-800 text-sm">{p.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded ml-6 flex-shrink-0 ${p.cls}`}>
                {p.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-sm text-blue-800">
        <strong>ℹ Protótipo de Demonstração:</strong> Este painel é somente leitura. Em produção,
        os parâmetros seriam configuráveis por Administradores da SJ via interface administrativa do PJe.
      </div>
    </div>
  )
}
