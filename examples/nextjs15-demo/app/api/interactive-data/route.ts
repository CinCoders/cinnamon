import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = [
    {
      id: "1",
      name: "Ada Lovelace",
      email: "ada@cin.ufpe.br",
      role: "admin",
      department: "Engenharia de Software",
      status: "Ativo",
      lastLogin: "Hoje, 14:32",
    },
    {
      id: "2",
      name: "Alan Turing",
      email: "alan@cin.ufpe.br",
      role: "user",
      department: "Ciência da Computação",
      status: "Ativo",
      lastLogin: "Hoje, 11:15",
    },
    {
      id: "3",
      name: "Margaret Hamilton",
      email: "margaret@cin.ufpe.br",
      role: "admin",
      department: "Sistemas Críticos",
      status: "Ativo",
      lastLogin: "Ontem, 18:40",
    },
    {
      id: "4",
      name: "Claude Shannon",
      email: "shannon@cin.ufpe.br",
      role: "user",
      department: "Teoria da Informação",
      status: "Inativo",
      lastLogin: "3 dias atrás",
    },
    {
      id: "5",
      name: "Grace Hopper",
      email: "hopper@cin.ufpe.br",
      role: "admin",
      department: "Compiladores & Linguagens",
      status: "Ativo",
      lastLogin: "Hoje, 09:20",
    },
    {
      id: "6",
      name: "Donald Knuth",
      email: "knuth@cin.ufpe.br",
      role: "user",
      department: "Algoritmos",
      status: "Ativo",
      lastLogin: "5 dias atrás",
    },
  ];

  return NextResponse.json({
    fetchedAt: new Date().toISOString(),
    total: items.length,
    items,
  });
}
