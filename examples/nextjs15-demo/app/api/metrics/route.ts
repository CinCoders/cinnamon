import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const delayParam = searchParams.get("delay");
  
  if (delayParam) {
    const delay = parseInt(delayParam, 10);
    if (!isNaN(delay) && delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 2000)));
    }
  }

  const timestamp = new Date().toISOString();
  
  const data = {
    generatedAt: timestamp,
    server: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      environment: process.env.NODE_ENV ?? "development",
    },
    kpi: {
      totalUsers: 1420,
      activeSessions: 87,
      totalRequestsToday: 38490,
      averageResponseTimeMs: 42,
      errorRate: "0.04%",
      uptime: "99.98%",
    },
    weeklyRequests: [
      { day: "Seg", requests: 4200, users: 510, avgLatencyMs: 38 },
      { day: "Ter", requests: 5800, users: 620, avgLatencyMs: 41 },
      { day: "Qua", requests: 6400, users: 710, avgLatencyMs: 45 },
      { day: "Qui", requests: 7100, users: 780, avgLatencyMs: 39 },
      { day: "Sex", requests: 6900, users: 750, avgLatencyMs: 44 },
      { day: "Sáb", requests: 2800, users: 310, avgLatencyMs: 32 },
      { day: "Dom", requests: 1900, users: 240, avgLatencyMs: 30 },
    ],
    roleDistribution: [
      { role: "admin", count: 18, percentage: 12, label: "Administradores" },
      { role: "user", count: 112, percentage: 76, label: "Usuários Padrão" },
      { role: "sys_hr-employee", count: 18, percentage: 12, label: "RH Especialistas" },
    ],
    responseTimesByHour: [
      { hour: "08h", latency: 28 },
      { hour: "10h", latency: 54 },
      { hour: "12h", latency: 68 },
      { hour: "14h", latency: 62 },
      { hour: "16h", latency: 49 },
      { hour: "18h", latency: 36 },
      { hour: "20h", latency: 24 },
    ],
  };

  return NextResponse.json(data);
}
