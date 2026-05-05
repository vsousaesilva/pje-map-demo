import { useState, useCallback } from 'react'

import PjeHeader  from './components/PjeHeader.jsx'
import Sidebar    from './components/Sidebar.jsx'

import AutomacaoView from './views/AutomacaoView.jsx'
import PeritosView   from './views/PeritosView.jsx'
import SalasView     from './views/SalasView.jsx'
import AgendaView    from './views/AgendaView.jsx'
import ConfigView    from './views/ConfigView.jsx'

import { runScheduler } from './engine/scheduler.js'
import {
  peritos,
  salas,
  agendaBase,
  processos as rawProcessos,
  agendamentosIniciais,
  bloqueiosIniciais,
} from './mock/data.js'

// ── Initial process state ──────────────────────────────────────────────────
const initProcessos = rawProcessos.map((p) => ({ ...p, uiStatus: 'aguardando', result: null }))

const DELAY = 360 // ms between log lines

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export default function App() {
  const [view,         setView]        = useState('automacao')
  const [processos,    setProcessos]   = useState(initProcessos)
  const [agendamentos, setAgendamentos] = useState(agendamentosIniciais)
  const [bloqueios,    setBloqueios]   = useState(bloqueiosIniciais)
  const [running,      setRunning]     = useState(false)
  const [logs,         setLogs]        = useState([])
  const [result,       setResult]      = useState(null)
  const [selectedIdx,  setSelectedIdx] = useState(null)

  // ── Run automation for process at index idx ──────────────────────────────
  const handleRun = useCallback(
    async (idx) => {
      if (running) return
      setRunning(true)
      setLogs([])
      setResult(null)
      setSelectedIdx(idx)

      // Mark as running
      setProcessos((prev) =>
        prev.map((p, i) => (i === idx ? { ...p, uiStatus: 'running' } : p)),
      )

      const proc = rawProcessos[idx]

      // Build all logs synchronously
      const { logs: allLogs, result: res, newAgendamento } = runScheduler(
        proc,
        peritos,
        agendaBase,
        agendamentos,  // current snapshot
        salas,
        bloqueios,
      )

      // Stream log lines one by one
      for (let i = 0; i < allLogs.length; i++) {
        await sleep(DELAY)
        setLogs((prev) => [...prev, allLogs[i]])
      }

      // Update agendamentos if a slot was booked
      if (newAgendamento) {
        setAgendamentos((prev) => [...prev, newAgendamento])
      }

      // Update process status
      setProcessos((prev) =>
        prev.map((p, i) =>
          i === idx
            ? { ...p, uiStatus: res.success ? 'agendado' : 'manual', result: res }
            : p,
        ),
      )

      setResult(res)
      setRunning(false)
    },
    [running, agendamentos, bloqueios],
  )

  // ── Show stored result ───────────────────────────────────────────────────
  const handleShowResult = useCallback(
    (idx) => {
      const proc = processos[idx]
      if (!proc.result) return
      setSelectedIdx(idx)
      setResult(proc.result)
      // Rebuild logs from stored result? Not stored — just clear & show result
      setLogs([])
    },
    [processos],
  )

  const handleAddBloqueio    = (b) => setBloqueios((prev) => [...prev, b])
  const handleRemoveBloqueio = (id) => setBloqueios((prev) => prev.filter((b) => b.id !== id))

  const pendingCount = processos.filter((p) => p.uiStatus === 'aguardando').length
  const activeProc   = selectedIdx !== null ? processos[selectedIdx]?.id : null

  return (
    <div className="flex flex-col h-full font-sans">
      <PjeHeader activeProcess={activeProc} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar current={view} onChange={setView} pendingCount={pendingCount} />

        <div className="flex-1 bg-[#f0f3f7] overflow-hidden">
          {view === 'automacao' && (
            <AutomacaoView
              processos={processos}
              logs={logs}
              result={result}
              running={running}
              selectedIdx={selectedIdx}
              bloqueios={bloqueios}
              onRun={handleRun}
              onShowResult={handleShowResult}
              onAddBloqueio={handleAddBloqueio}
              onRemoveBloqueio={handleRemoveBloqueio}
            />
          )}
          {view === 'peritos' && <PeritosView peritos={peritos} />}
          {view === 'salas'   && <SalasView salas={salas} agendamentos={agendamentos} />}
          {view === 'agenda'  && <AgendaView agendaBase={agendaBase} />}
          {view === 'config'  && <ConfigView />}
        </div>
      </div>
    </div>
  )
}
