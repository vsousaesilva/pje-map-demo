import { formatDisplay } from '../engine/scheduler'

export default function ResultCard({ result, processo }) {
  if (!result) return null

  if (result.success) {
    return (
      <div className="fade-slide border-2 border-[var(--pje-green)] rounded-md overflow-hidden">
        {/* Header */}
        <div
          style={{ background: 'var(--pje-green)' }}
          className="flex items-center gap-2.5 px-5 py-3.5 text-white"
        >
          <span className="text-lg">📄</span>
          <h3 className="font-bold text-[15px] tracking-tight">
            Minuta de Intimação — Perícia Judicial
          </h3>
          <span className="ml-auto text-xs opacity-70 font-mono">
            Gerado em {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Body */}
        <div className="bg-white p-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Número do Processo" value={processo.id} mono />
            <Field label="Tipo de Ação" value={processo.tipo} />
            <Field label="Perito Designado" value={result.perito.nome} />
            <Field label="Especialidade" value={result.perito.especialidade} />
            <Field label="CRM" value={result.perito.crm} />
            <Field label="Unidade" value={processo.unidade} />
            <Field label="Data e Hora" value={`${formatDisplay(result.data)} às ${result.hora}`} />
            <Field label="Local" value={result.local} />
          </div>

          <hr className="my-4 border-gray-200" />

          <div className="bg-gray-50 rounded p-3 text-sm text-gray-600 mb-4">
            <strong className="text-gray-800">Intimação:</strong> Fica intimado(a) o(a) autor(a) do processo{' '}
            <span className="font-mono text-xs">{processo.id}</span> a comparecer à perícia médica
            judicial agendada para <strong>{formatDisplay(result.data)} às {result.hora}</strong>,
            no local <strong>{result.local}</strong>, com {result.perito.nome} ({result.perito.especialidade}).
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => alert('Função de impressão não disponível no protótipo.')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              🖨 Imprimir Minuta
            </button>
            <button
              onClick={(e) => {
                e.currentTarget.textContent = '✓ Confirmado'
                e.currentTarget.disabled = true
                e.currentTarget.style.background = 'var(--pje-green)'
              }}
              style={{ background: 'var(--pje-blue)' }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded text-white hover:opacity-90 transition-opacity"
            >
              ✅ Confirmar Agendamento
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Fallback manual
  return (
    <div className="fade-slide border-2 border-orange-600 rounded-md overflow-hidden">
      <div className="bg-orange-600 flex items-center gap-2.5 px-5 py-3.5 text-white">
        <span className="text-lg">⚠</span>
        <h3 className="font-bold text-[15px]">Agendamento Automático Não Realizado</h3>
      </div>
      <div className="bg-orange-50 p-5">
        <p className="text-sm text-gray-700 mb-2">
          O motor de agendamento não encontrou disponibilidade para o processo{' '}
          <strong className="font-mono">{processo.id}</strong>.
        </p>
        <div className="bg-orange-100 border-l-4 border-orange-500 px-4 py-2.5 rounded-r text-sm text-orange-800 my-3">
          <strong>Motivo:</strong> {result.motivo}
        </div>
        <p className="text-sm text-gray-700">
          O processo foi encaminhado para a fila de{' '}
          <strong>Designação Manual</strong>, onde um servidor poderá escolher
          perito e horário manualmente.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => alert('Protótipo: consulte o log acima para detalhes.')}
            className="px-4 py-2 text-sm font-semibold rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            📋 Ver Log
          </button>
          <button
            onClick={() => alert('Protótipo: roteando para designação manual...')}
            className="px-4 py-2 text-sm font-semibold rounded bg-orange-600 text-white hover:bg-orange-700 transition-colors"
          >
            👤 Designar Manualmente
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
        {label}
      </div>
      <div className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono text-[12px]' : ''}`}>
        {value}
      </div>
    </div>
  )
}
