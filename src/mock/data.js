// ─── Referência temporal: 2026-03-28 (Sábado) ───────────────────────────────

export const peritos = [
  {
    id: 1,
    nome: 'Dr. João Silva',
    especialidade: 'Ortopedia',
    local: 'Sede',
    localidade: 'JFCE Fortaleza',
    unidades: ['JFCE-01', 'JFCE-02'],
    cargaMes: 3,
    crm: 'CRM/CE 12.345',
  },
  {
    id: 2,
    nome: 'Dra. Maria Santos',
    especialidade: 'Ortopedia',
    local: 'Consultório',
    localidade: null,
    unidades: ['JFCE-01'],
    cargaMes: 1,
    crm: 'CRM/CE 23.456',
  },
  {
    id: 3,
    nome: 'Dr. Carlos Oliveira',
    especialidade: 'Psiquiatria',
    local: 'Sede',
    localidade: 'JFCE Fortaleza',
    unidades: ['JFCE-01'],
    cargaMes: 5,
    crm: 'CRM/CE 34.567',
  },
  {
    id: 4,
    nome: 'Dra. Ana Costa',
    especialidade: 'Psiquiatria',
    local: 'Consultório',
    localidade: null,
    unidades: ['JFCE-01', 'JFCE-02'],
    cargaMes: 2,
    crm: 'CRM/CE 45.678',
  },
  {
    id: 5,
    nome: 'Dr. Pedro Lima',
    especialidade: 'Neurologia',
    local: 'Sede',
    localidade: 'JFCE Fortaleza',
    unidades: ['JFCE-01'],
    cargaMes: 4,
    crm: 'CRM/CE 56.789',
  },
]

export const salas = [
  { id: 1, nome: 'Sala 01', localidade: 'JFCE Fortaleza', capacidade: 4, andar: '3º andar' },
  { id: 2, nome: 'Sala 02', localidade: 'JFCE Fortaleza', capacidade: 4, andar: '3º andar' },
  { id: 3, nome: 'Sala 03', localidade: 'JFCE Sobral',    capacidade: 3, andar: '2º andar' },
]

export const agendaBase = [
  { peritoId: 1, diaSemana: 'Segunda', horaInicio: '13:00', horaFim: '17:00', intervalo: 20, vagasTurno: 8 },
  { peritoId: 1, diaSemana: 'Quarta',  horaInicio: '08:00', horaFim: '12:00', intervalo: 20, vagasTurno: 8 },
  { peritoId: 2, diaSemana: 'Segunda', horaInicio: '09:00', horaFim: '12:00', intervalo: 30, vagasTurno: 6 },
  { peritoId: 2, diaSemana: 'Quinta',  horaInicio: '14:00', horaFim: '17:00', intervalo: 30, vagasTurno: 6 },
  { peritoId: 3, diaSemana: 'Terça',   horaInicio: '09:00', horaFim: '12:00', intervalo: 40, vagasTurno: 4 },
  { peritoId: 4, diaSemana: 'Quarta',  horaInicio: '14:00', horaFim: '18:00', intervalo: 40, vagasTurno: 5 },
  { peritoId: 5, diaSemana: 'Sexta',   horaInicio: '08:00', horaFim: '12:00', intervalo: 30, vagasTurno: 6 },
]

// Agendamentos pré-existentes — criam os cenários de demo:
//   - 'pre-1': Sala 01 ocupada na Sexta 03/04 manhã → Dr. Pedro usa Sala 02
//   - 'pre-2': Dr. Pedro já com Sala 02 em 10/04 manhã → TRAVA ativa na segunda Neurologia
export const agendamentosIniciais = [
  {
    id: 'pre-1',
    peritoId: null,
    nomePerito: 'Caso anterior',
    salaId: 1,
    data: '2026-04-03',
    turno: 'Manha',
    hora: '09:00',
    processoId: 'PRÉ-EXISTENTE',
  },
  {
    id: 'pre-2',
    peritoId: 5,
    nomePerito: 'Dr. Pedro Lima',
    salaId: 2,
    data: '2026-04-10',
    turno: 'Manha',
    hora: '08:00',
    processoId: 'PRÉ-EXISTENTE',
  },
]

// Bloqueios de localidade (feriados / eventos especiais)
export const bloqueiosIniciais = [
  {
    id: 'bl-1',
    data: '2026-04-21',
    localidade: 'JFCE Fortaleza',
    motivo: 'Tiradentes (feriado nacional)',
  },
]

export const processos = [
  {
    id: '0001234-55.2024.4.05.8100',
    especialidade: 'Ortopedia',
    unidade: 'JFCE-01',
    descricao: 'Ação Acidentária — Lesão em coluna lombar',
    tipo: 'Acidente de Trabalho',
    demoLabel: 'Desempate: menor carga (Consultório)',
    demoColor: 'blue',
  },
  {
    id: '0005678-90.2024.4.05.8100',
    especialidade: 'Psiquiatria',
    unidade: 'JFCE-01',
    descricao: 'BPC/LOAS — Transtorno mental grave',
    tipo: 'Benefício Assistencial',
    demoLabel: 'Desempate: menor carga (Consultório)',
    demoColor: 'blue',
  },
  {
    id: '0009999-11.2025.4.05.8100',
    especialidade: 'Neurologia',
    unidade: 'JFCE-01',
    descricao: 'Benefício por Incapacidade — Sequela neurológica',
    tipo: 'Aposentadoria por Invalidez',
    demoLabel: 'Conflito de salas → Sala 02',
    demoColor: 'amber',
  },
  {
    id: '0007777-22.2025.4.05.8100',
    especialidade: 'Neurologia',
    unidade: 'JFCE-01',
    descricao: 'BPC/LOAS — Sequela de AVC',
    tipo: 'Benefício Assistencial',
    demoLabel: 'Trava de sala (execute após anterior)',
    demoColor: 'purple',
  },
  {
    id: '0003333-44.2024.4.05.8100',
    especialidade: 'Cardiologia',
    unidade: 'JFCE-01',
    descricao: 'Aposentadoria por Invalidez — Cardiopatia grave',
    tipo: 'Aposentadoria por Invalidez',
    demoLabel: 'Fallback → designação manual',
    demoColor: 'red',
  },
]
