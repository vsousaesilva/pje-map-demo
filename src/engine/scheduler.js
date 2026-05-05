// ─── PJe-MAP: Motor de Agendamento Automático ────────────────────────────────
// Data de referência: 2026-03-28 (Sábado)

const DIA_IDX = {
  Domingo: 0, Segunda: 1, 'Terça': 2, Quarta: 3,
  Quinta: 4, Sexta: 5, 'Sábado': 6,
}
const DIA_NOME = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const REF = new Date(2026, 2, 28) // 2026-03-28

function getTurno(hora) {
  return parseInt(hora) < 13 ? 'Manha' : 'Tarde'
}

function toIso(d) {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function formatDisplay(iso) {
  const [y, m, d] = iso.split('-')
  const dt = new Date(+y, +m - 1, +d)
  return `${d}/${m}/${y} (${DIA_NOME[dt.getDay()]})`
}

function nextOccurrences(weekdayName, maxDays = 42) {
  const target = DIA_IDX[weekdayName]
  const results = []
  const cur = new Date(REF)
  cur.setDate(cur.getDate() + 1)
  for (let i = 0; i < maxDays; i++) {
    if (cur.getDay() === target) results.push(toIso(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return results
}

function ts() {
  return new Date().toTimeString().slice(0, 8)
}

// ── Regra de Trava + Busca de Sala ──────────────────────────────────────────
function findSala(perito, data, turno, agendamentos, salas, L) {
  // Trava: perito já tem sala reservada neste dia/turno?
  const trava = agendamentos.find(
    (a) => a.peritoId === perito.id && a.data === data && a.turno === turno && a.salaId,
  )
  if (trava) {
    const sala = salas.find((s) => s.id === trava.salaId)
    if (sala) {
      L(
        `  ↳ 🔒 Trava de sala ativada: ${perito.nome} já possui ${sala.nome} neste turno → confirmando mesma sala`,
        'ok',
      )
      return sala
    }
  }

  // Salas bloqueadas por outros peritos no mesmo dia/turno
  const ocupadasIds = new Set(
    agendamentos
      .filter((a) => a.data === data && a.turno === turno && a.salaId && a.peritoId !== perito.id)
      .map((a) => a.salaId),
  )

  const localSalas = salas.filter((s) => s.localidade === perito.localidade)

  for (const sala of localSalas) {
    if (ocupadasIds.has(sala.id)) {
      L(`  ↳ ⚠ ${sala.nome} — ocupada por outro perito neste turno`, 'warn')
    } else {
      L(`  ↳ ✓ ${sala.nome} — disponível → reservando`, 'ok')
      return sala
    }
  }

  L(`  ↳ ✗ Todas as salas estão ocupadas neste turno`, 'error')
  return null
}

// ── Motor Principal ──────────────────────────────────────────────────────────
export function runScheduler(processo, peritos, agendaBase, agendamentos, salas, bloqueios) {
  const logs = []
  const L = (text, type = 'info') => logs.push({ text, type, ts: ts() })

  L('Iniciando motor de agendamento PJe-MAP...')
  L(`Processo: ${processo.id}`)
  L(`Especialidade: ${processo.especialidade} | Unidade: ${processo.unidade}`)
  L('')

  // ── Passo 1: filtrar peritos ──
  const candidatos = peritos.filter(
    (p) =>
      p.especialidade === processo.especialidade && p.unidades.includes(processo.unidade),
  )

  if (candidatos.length === 0) {
    L(`✗ Nenhum perito cadastrado para "${processo.especialidade}" em ${processo.unidade}`, 'error')
    L('')
    L('⚠ FALLBACK: Processo encaminhado para Designação Manual.', 'warn')
    return {
      logs,
      result: {
        success: false,
        motivo: `Nenhum perito cadastrado para a especialidade "${processo.especialidade}" na unidade ${processo.unidade}.`,
      },
      newAgendamento: null,
    }
  }

  L(`${candidatos.length} perito(s) encontrado(s) para ${processo.especialidade}:`)
  candidatos.forEach((p) => {
    L(
      `  ↳ ${p.nome} (${p.local}) — carga: ${p.cargaMes} perícia${p.cargaMes !== 1 ? 's' : ''}/mês`,
      'found',
    )
  })

  // ── Passo 2: ordenar por carga (desempate) ──
  const sorted = [...candidatos].sort((a, b) => a.cargaMes - b.cargaMes)

  if (sorted.length > 1) {
    L('')
    L('Critério de desempate: menor carga mensal de perícias.')
    sorted.forEach((p, i) =>
      L(`  ${i + 1}º lugar: ${p.nome} — ${p.cargaMes} perícias/mês`),
    )
    L(`Verificando disponibilidade na ordem acima...`)
  }

  // Bloqueios de localidade (aplica para peritos de Sede)
  const blockedDates = new Set(bloqueios.map((b) => b.data))

  // ── Passo 3: buscar vaga ──
  for (const perito of sorted) {
    L('')
    L(`── Verificando: ${perito.nome} (${perito.local}) ──`)

    const agendas = agendaBase.filter((a) => a.peritoId === perito.id)
    if (agendas.length === 0) {
      L('  ↳ Sem agenda base cadastrada.', 'warn')
      continue
    }

    let found = null

    outer: for (const slot of agendas) {
      const turno = getTurno(slot.horaInicio)
      const dates = nextOccurrences(slot.diaSemana, 42)

      for (const date of dates) {
        // Verifica bloqueio (apenas para Sede — salas físicas)
        if (perito.local === 'Sede' && blockedDates.has(date)) {
          const blq = bloqueios.find((b) => b.data === date)
          L(
            `  ↳ ⊘ ${formatDisplay(date)} — BLOQUEADO: ${blq?.motivo ?? 'bloqueio de localidade'}`,
            'warn',
          )
          continue
        }

        L(
          `  ↳ Testando ${slot.diaSemana}-feira ${formatDisplay(date)} às ${slot.horaInicio} (turno ${turno === 'Manha' ? 'Manhã' : 'Tarde'})...`,
        )

        if (perito.local === 'Consultório') {
          L('  ↳ Local: Consultório — verificação de sala não necessária ✓', 'ok')
          found = {
            perito,
            data: date,
            hora: slot.horaInicio,
            turno,
            local: 'Consultório Particular',
            salaId: null,
          }
          break outer
        }

        // Sede: verificar sala
        L(`  ↳ Local: Sede — verificando salas em ${perito.localidade}...`)
        const sala = findSala(perito, date, turno, agendamentos, salas, L)

        if (sala) {
          found = {
            perito,
            data: date,
            hora: slot.horaInicio,
            turno,
            local: `Sede — ${sala.nome} (${sala.andar})`,
            salaId: sala.id,
          }
          break outer
        }

        L(`  ↳ Sem sala disponível em ${formatDisplay(date)}. Tentando próxima data...`, 'warn')
      }
    }

    if (found) {
      L('')
      L(`✓ Vaga encontrada: ${found.perito.nome} — ${formatDisplay(found.data)} às ${found.hora}`, 'ok')
      L('')
      L('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bold')
      L('✅  AGENDAMENTO CONFIRMADO', 'success')
      L(`   Perito:  ${found.perito.nome}`, 'bold')
      L(`   Data:    ${formatDisplay(found.data)} às ${found.hora}`, 'bold')
      L(`   Local:   ${found.local}`, 'bold')
      L('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bold')

      const newAgendamento = {
        id: `ag-${Date.now()}`,
        peritoId: found.perito.id,
        nomePerito: found.perito.nome,
        salaId: found.salaId,
        data: found.data,
        turno: found.turno,
        hora: found.hora,
        processoId: processo.id,
      }

      return { logs, result: { success: true, ...found }, newAgendamento }
    }

    L(`  ${perito.nome}: sem disponibilidade nas próximas 6 semanas.`, 'warn')
  }

  L('')
  L('Nenhum perito disponível no período.', 'error')
  L('')
  L('⚠ FALLBACK: Processo encaminhado para Designação Manual.', 'warn')

  return {
    logs,
    result: {
      success: false,
      motivo: 'Nenhum perito com disponibilidade nas próximas 6 semanas.',
    },
    newAgendamento: null,
  }
}
