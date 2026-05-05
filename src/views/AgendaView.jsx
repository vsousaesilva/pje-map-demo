import { peritos as allPeritos } from '../mock/data'

export default function AgendaView({ agendaBase }) {
  const turnoLabel = (hora) => (parseInt(hora) < 13 ? 'Manhã' : 'Tarde')

  return (
    <div className="p-6 main-scroll overflow-y-auto h-full flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--pje-blue)] tracking-tight">Agenda Base dos Peritos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Recorrência semanal padrão para agendamento automático</p>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-bold text-[var(--pje-blue)] uppercase tracking-wide">📅 Turnos Semanais</span>
          <span className="ml-auto text-xs text-gray-400">{agendaBase.length} turnos cadastrados</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f0f4f9]">
                {['Perito', 'Especialidade', 'Dia da Semana', 'Horário', 'Turno', 'Intervalo', 'Capacidade'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2.5 border-b-2 border-gray-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agendaBase.map((slot, i) => {
                const p = allPeritos.find((x) => x.id === slot.peritoId)
                const turno = turnoLabel(slot.horaInicio)
                return (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{p?.nome ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded">
                        {p?.especialidade ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{slot.diaSemana}-feira</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {slot.horaInicio} – {slot.horaFim}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${turno === 'Manhã' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                        {turno === 'Manhã' ? '🌅 Manhã' : '🌇 Tarde'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{slot.intervalo} min</td>
                    <td className="px-4 py-3 text-gray-600">{slot.vagasTurno} vagas</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
