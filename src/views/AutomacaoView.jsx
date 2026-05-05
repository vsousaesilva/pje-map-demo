import { useState } from 'react'
import { Play, RefreshCw, Ban, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import ConsoleLog from '../components/ConsoleLog'
import ResultCard from '../components/ResultCard'

const DEMO_COLORS = {
  blue:   'bg-blue-50 text-blue-700 border border-blue-200',
  amber:  'bg-amber-50 text-amber-700 border border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  red:    'bg-red-50 text-red-700 border border-red-200',
}

export default function AutomacaoView({
  processos,
  logs,
  result,
  running,
  selectedIdx,
  bloqueios,
  onRun,
  onShowResult,
  onAddBloqueio,
  onRemoveBloqueio,
}) {
  const [showBloqueioForm, setShowBloqueioForm] = useState(false)
  const [newBlData, setNewBlData] = useState('')
  const [newBlMotivo, setNewBlMotivo] = useState('')

  const pending = processos.filter((p) => p.uiStatus === 'aguardando').length

  function submitBloqueio(e) {
    e.preventDefault()
    if (!newBlData) return
    onAddBloqueio({
      id: `bl-${Date.now()}`,
      data: newBlData,
      localidade: 'JFCE Fortaleza',
      motivo: newBlMotivo || 'Bloqueio manual',
    })
    setNewBlData('')
    setNewBlMotivo('')
    setShowBloqueioForm(false)
  }

  return (
    <div className="flex flex-col gap-5 p-6 main-scroll overflow-y-auto h-full">

      {/* ── Page heading ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--pje-blue)] tracking-tight">
            Fila de Agendamento Automático
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Processos aguardando designação de perito por perícia judicial
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
          Motor Automático Ativo
        </div>
      </div>

      {/* ── Process table ── */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-bold text-[var(--pje-blue)] uppercase tracking-wide">
            Processos Pendentes
          </span>
          {pending > 0 && (
            <span
              style={{ background: 'var(--pje-accent)', color: '#111' }}
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
            >
              {pending}
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f0f4f9]">
                {['Nº Processo', 'Especialidade', 'Unidade', 'Descrição', 'Cenário Demo', 'Status', 'Ação'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2.5 border-b-2 border-gray-200 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {processos.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-gray-100 last:border-0 transition-colors ${
                    selectedIdx === i ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-[var(--pje-mid)] font-medium whitespace-nowrap">
                    {p.id}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded">
                      {p.especialidade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.unidade}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{p.descricao}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${DEMO_COLORS[p.demoColor] ?? ''}`}>
                      {p.demoLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.uiStatus} />
                  </td>
                  <td className="px-4 py-3">
                    {p.uiStatus === 'aguardando' && (
                      <button
                        onClick={() => onRun(i)}
                        disabled={running}
                        style={{ background: 'var(--pje-blue)' }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                      >
                        <Play size={11} />
                        Executar
                      </button>
                    )}
                    {p.uiStatus === 'running' && (
                      <button disabled className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 text-gray-400">
                        <RefreshCw size={11} className="animate-spin" />
                        Executando...
                      </button>
                    )}
                    {(p.uiStatus === 'agendado' || p.uiStatus === 'manual') && (
                      <button
                        onClick={() => onShowResult(i)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        📄 Ver Resultado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bloqueios de localidade ── */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <Ban size={14} className="text-orange-500" />
          <span className="text-sm font-bold text-[var(--pje-blue)] uppercase tracking-wide">
            Bloqueios de Localidade
          </span>
          <span className="text-xs text-gray-500 ml-1">
            (feriados / suspensão de atividades)
          </span>
          <button
            onClick={() => setShowBloqueioForm((v) => !v)}
            className="ml-auto text-xs font-semibold px-3 py-1 rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
          >
            {showBloqueioForm ? 'Cancelar' : '+ Adicionar Bloqueio'}
          </button>
        </div>

        {showBloqueioForm && (
          <form onSubmit={submitBloqueio} className="px-4 py-3 bg-orange-50 border-b border-orange-100 flex gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Data</label>
              <input
                type="date"
                value={newBlData}
                onChange={(e) => setNewBlData(e.target.value)}
                required
                className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Motivo</label>
              <input
                type="text"
                placeholder="ex: Feriado municipal"
                value={newBlMotivo}
                onChange={(e) => setNewBlMotivo(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm font-semibold rounded bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              Bloquear
            </button>
          </form>
        )}

        <div className="divide-y divide-gray-100">
          {bloqueios.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 italic">
              Nenhum bloqueio cadastrado.
            </div>
          ) : (
            bloqueios.map((b) => {
              const [y, m, d] = b.data.split('-')
              return (
                <div key={b.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="font-mono text-xs text-gray-500">{`${d}/${m}/${y}`}</span>
                  <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-semibold">
                    {b.localidade}
                  </span>
                  <span className="text-gray-600">{b.motivo}</span>
                  <button
                    onClick={() => onRemoveBloqueio(b.id)}
                    className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Console de execução ── */}
      {(logs.length > 0 || running) && (
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden fade-slide">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1117] border-b border-gray-700">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-wider">
              Log de Execução — Motor PJe-MAP
            </span>
            {running && (
              <span className="ml-auto text-xs text-yellow-400 animate-pulse font-mono">
                processando...
              </span>
            )}
          </div>
          <ConsoleLog logs={logs} running={running} />
        </div>
      )}

      {/* ── Resultado ── */}
      {result && selectedIdx !== null && (
        <ResultCard result={result} processo={processos[selectedIdx]} />
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    aguardando: {
      cls: 'bg-amber-50 text-amber-700 border border-amber-300',
      icon: <Clock size={11} />,
      label: 'Aguardando',
    },
    running: {
      cls: 'bg-blue-50 text-blue-700 border border-blue-300',
      icon: <RefreshCw size={11} className="animate-spin" />,
      label: 'Processando...',
    },
    agendado: {
      cls: 'bg-green-50 text-green-700 border border-green-300',
      icon: <CheckCircle size={11} />,
      label: 'Agendado',
    },
    manual: {
      cls: 'bg-orange-50 text-orange-700 border border-orange-300',
      icon: <AlertTriangle size={11} />,
      label: 'Manual',
    },
  }
  const s = map[status] ?? map.aguardando
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  )
}
