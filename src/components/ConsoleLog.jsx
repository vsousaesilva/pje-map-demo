import { useEffect, useRef } from 'react'

const TYPE_CLASS = {
  info:    'text-gray-300',
  found:   'text-blue-400',
  ok:      'text-green-400',
  warn:    'text-yellow-400',
  error:   'text-red-400',
  success: 'text-green-300 font-bold',
  bold:    'text-white font-semibold',
}

export default function ConsoleLog({ logs, running }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [logs])

  return (
    <div
      ref={ref}
      className="console-scroll bg-[#0d1117] rounded-b font-mono text-xs leading-[1.75] p-4 h-72 overflow-y-auto"
    >
      {logs.length === 0 ? (
        <div className="text-gray-600 italic text-center mt-16">
          Selecione um processo e clique em{' '}
          <span className="text-gray-500">▶ Executar Automação</span> para iniciar.
        </div>
      ) : (
        logs.map((l, i) =>
          l.text === '' ? (
            <div key={i} className="h-1" />
          ) : (
            <div key={i} className="flex gap-2">
              <span className="text-gray-600 flex-shrink-0">[{l.ts}]</span>
              <span className={TYPE_CLASS[l.type] ?? 'text-gray-300'}>{l.text}</span>
            </div>
          ),
        )
      )}
      {running && (
        <div className="flex gap-2 mt-1">
          <span className="text-gray-600">[{new Date().toTimeString().slice(0, 8)}]</span>
          <span className="text-gray-500 animate-pulse">processando...</span>
        </div>
      )}
    </div>
  )
}
