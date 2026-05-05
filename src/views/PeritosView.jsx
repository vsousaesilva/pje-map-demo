export default function PeritosView({ peritos }) {
  return (
    <div className="p-6 main-scroll overflow-y-auto h-full flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--pje-blue)] tracking-tight">Cadastro de Peritos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Peritos judiciais cadastrados e vinculados às unidades</p>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-bold text-[var(--pje-blue)] uppercase tracking-wide">👤 Peritos Cadastrados</span>
          <span className="ml-auto text-xs text-gray-400">{peritos.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f0f4f9]">
                {['Nome / CRM', 'Especialidade', 'Local de Atendimento', 'Localidade', 'Unidades', 'Carga Mensal', 'Status'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2.5 border-b-2 border-gray-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peritos.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{p.nome}</div>
                    <div className="font-mono text-[11px] text-gray-400">{p.crm}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded">{p.especialidade}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${p.local === 'Sede' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
                      {p.local === 'Sede' ? '🏛 Sede' : '🏠 Consultório'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.localidade ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.unidades.join(', ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${p.cargaMes >= 5 ? 'text-red-600' : p.cargaMes >= 3 ? 'text-orange-600' : 'text-green-700'}`}>
                      {p.cargaMes} perícia{p.cargaMes !== 1 ? 's' : ''}/mês
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-green-50 text-green-700 border border-green-200 text-[11px] font-semibold px-2 py-0.5 rounded">Ativo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
