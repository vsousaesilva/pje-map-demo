export default function SalasView({ salas, agendamentos }) {
  const today = '2026-04-03' // demo reference

  return (
    <div className="p-6 main-scroll overflow-y-auto h-full flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--pje-blue)] tracking-tight">Gestão de Salas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Salas de perícia nas sedes das subseções judiciárias</p>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-bold text-[var(--pje-blue)] uppercase tracking-wide">🏛 Salas Cadastradas</span>
          <span className="ml-auto text-xs text-gray-400">{salas.length} salas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f0f4f9]">
                {['Sala', 'Localidade', 'Andar', 'Capacidade', 'Situação (Próx. Sexta)', 'Reservas'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2.5 border-b-2 border-gray-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => {
                const reservas = agendamentos.filter((a) => a.salaId === sala.id && a.data === today)
                const turnosManha = reservas.filter((a) => a.turno === 'Manha')
                const turnosTarde = reservas.filter((a) => a.turno === 'Tarde')
                const ocupada = reservas.length > 0
                return (
                  <tr key={sala.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{sala.nome}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{sala.localidade}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{sala.andar}</td>
                    <td className="px-4 py-3 text-gray-600">{sala.capacidade} vagas/turno</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${ocupada ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {ocupada ? '⚠ Ocupada' : '✓ Disponível'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {turnosManha.length > 0 && <div>Manhã: {turnosManha.map((a) => a.nomePerito || 'Caso externo').join(', ')}</div>}
                      {turnosTarde.length > 0 && <div>Tarde: {turnosTarde.map((a) => a.nomePerito || 'Caso externo').join(', ')}</div>}
                      {reservas.length === 0 && '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-sm text-blue-800">
        <strong>ℹ Nota:</strong> A coluna "Situação" mostra o estado das salas para a próxima Sexta-feira (03/04/2026),
        data em que o processo de Neurologia está agendado no demo. A Sala 01 aparece como "Ocupada" por um caso pré-existente,
        demonstrando o comportamento de conflito no motor de agendamento.
      </div>
    </div>
  )
}
