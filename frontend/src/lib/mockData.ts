import type { AnalyticsSummary, Report } from "./types";

export const mockReports: Report[] = [
  {
    id: 1,
    identifier: "2026-001",
    title: "Vertimiento en quebrada",
    description: "Se evidencia descarga de residuos liquidos.",
    done: false,
    category: "water_pollution",
    category_label: "Contaminacion del agua",
    other_category: "",
    what_happened: "Una empresa descargo liquidos oscuros en la quebrada del barrio.",
    when_happened: "22 de abril de 2026, 7:30 a. m.",
    details: "La situacion se repitio durante la madrugada y persiste el olor fuerte.",
    latitude: "4.711000",
    longitude: "-74.072100",
    status: "in_review",
    status_label: "En revision",
    is_anonymous: true,
    created_at: "2026-04-22T10:00:00Z",
    updated_at: "2026-04-22T14:30:00Z",
    images: [],
    status_logs: [
      { id: 1, status: "pending", status_label: "Pendiente", note: "Denuncia registrada.", created_at: "2026-04-22T10:00:00Z" },
      { id: 2, status: "in_review", status_label: "En revision", note: "Asignada a inspeccion regional.", created_at: "2026-04-22T14:30:00Z" }
    ]
  },
  {
    id: 2,
    identifier: "2026-002",
    title: "Tala en zona de reserva",
    description: "Se observo remocion de arboles nativos.",
    done: true,
    category: "deforestation",
    category_label: "Deforestacion",
    other_category: "",
    what_happened: "Se realizo tala no autorizada cerca de una reserva.",
    when_happened: "18 de abril de 2026, 4:00 p. m.",
    details: "Dos camiones retiraron material vegetal sin señalizacion.",
    latitude: "6.244203",
    longitude: "-75.581215",
    status: "resolved",
    status_label: "Resuelto",
    is_anonymous: false,
    created_at: "2026-04-18T16:00:00Z",
    updated_at: "2026-04-20T12:00:00Z",
    images: [],
    status_logs: [
      { id: 3, status: "pending", status_label: "Pendiente", note: "Denuncia recibida.", created_at: "2026-04-18T16:00:00Z" },
      { id: 4, status: "resolved", status_label: "Resuelto", note: "Autoridad local intervino la zona.", created_at: "2026-04-20T12:00:00Z" }
    ]
  },
  {
    id: 3,
    identifier: "2026-003",
    title: "Ruido industrial nocturno",
    description: "Operacion continua en horario restringido.",
    done: false,
    category: "noise_pollution",
    category_label: "Contaminacion auditiva",
    other_category: "",
    what_happened: "Una planta mantiene maquinaria activa en la madrugada.",
    when_happened: "21 de abril de 2026, 11:45 p. m.",
    details: "Los vecinos reportan vibraciones y afectacion del descanso.",
    latitude: "10.963889",
    longitude: "-74.796387",
    status: "pending",
    status_label: "Pendiente",
    is_anonymous: false,
    created_at: "2026-04-21T23:45:00Z",
    updated_at: "2026-04-21T23:45:00Z",
    images: [],
    status_logs: [
      { id: 5, status: "pending", status_label: "Pendiente", note: "Caso recibido y en cola de priorizacion.", created_at: "2026-04-21T23:45:00Z" }
    ]
  }
];

export const mockAnalytics: AnalyticsSummary = {
  total_reports: mockReports.length,
  anonymous_reports: mockReports.filter((item) => item.is_anonymous).length,
  resolved_reports: mockReports.filter((item) => item.status === "resolved").length,
  pending_reports: mockReports.filter((item) => item.status === "pending").length,
  by_status: {
    pending: 1,
    in_review: 1,
    resolved: 1,
    rejected: 0,
  },
  by_category: {
    air_pollution: 0,
    water_pollution: 1,
    waste_dumping: 0,
    deforestation: 1,
    wildlife_trafficking: 0,
    noise_pollution: 1,
    other: 0,
  },
  recent_reports: mockReports,
};
