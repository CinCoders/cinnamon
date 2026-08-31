"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "@cincoders/cinnamon";
import { ClientBoundary } from "./ClientBoundary";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
}

interface InteractivePlaygroundClientProps {
  initialUsers: UserRecord[];
}

export function InteractivePlaygroundClient({ initialUsers }: InteractivePlaygroundClientProps) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "all" || u.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(users.map((u) => u.department)));

  function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const department = formData.get("department") as string;
    const role = formData.get("role") as string;

    if (!name || !email) {
      toast.error("Por favor, preencha nome e e-mail!");
      return;
    }

    const newUser: UserRecord = {
      id: String(Date.now()),
      name,
      email,
      department: department || "Geral",
      role: role || "user",
      status: "Ativo",
      lastLogin: "Agora",
    };

    setUsers([newUser, ...users]);
    form.reset();
    toast.success(`Novo usuário "${name}" cadastrado localmente no state!`);
  }

  return (
    <ClientBoundary
      title="Playground de Componentes Interativos (Client Component)"
      description="Hidratação SSR→client: os dados chegam prontos do servidor e ficam interativos no browser (useState, filtros em tempo real, ToastContainer da Cinnamon)."
      interactiveProbe={true}
    >
      <ToastContainer topInitialPosition={64} toastProps={{ position: "top-right", autoClose: 2500 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Formulário — adiciona ao state local */}
        <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "#1e3a8a", fontWeight: 700 }}>
            ➕ Cadastro local (useState)
          </h3>

          <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                Nome Completo:
              </label>
              <input name="name" required placeholder="Ex: Katherine Johnson"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                E-mail Cin/UFPE:
              </label>
              <input name="email" type="email" required placeholder="usuario@cin.ufpe.br"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                  Departamento:
                </label>
                <input name="department" placeholder="Ex: Engenharia" defaultValue="Engenharia de Software"
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                  Role:
                </label>
                <select name="role" defaultValue="user"
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", backgroundColor: "#ffffff", boxSizing: "border-box" }}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>

            <button type="submit" className="demo-btn demo-btn-primary" style={{ marginTop: "0.5rem", width: "100%" }}>
              Adicionar ao State Local
            </button>
          </form>
        </div>

        {/* Toasts */}
        <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "#1e3a8a", fontWeight: 700 }}>
            🔔 Disparo de Notificações (Toast)
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0 0 1rem 0" }}>
            <code>ToastContainer</code> / <code>toast</code> da Cinnamon:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button type="button" onClick={() => toast.success("Operação realizada com sucesso!")}
              style={{ padding: "0.5rem", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              Toast Success
            </button>
            <button type="button" onClick={() => toast.error("Ocorreu um erro na solicitação!")}
              style={{ padding: "0.5rem", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              Toast Error
            </button>
            <button type="button" onClick={() => toast.info("Atualização disponível no sistema.")}
              style={{ padding: "0.5rem", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              Toast Info
            </button>
            <button type="button" onClick={() => toast.warning("Atenção: verifique suas permissões.")}
              style={{ padding: "0.5rem", backgroundColor: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              Toast Warning
            </button>
          </div>
        </div>
      </div>

      {/* Tabela com busca/filtro em tempo real (client state) */}
      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#1e293b", fontWeight: 700 }}>
              👥 Usuários do Sistema ({filteredUsers.length})
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              {initialUsers.length} registros pré-carregados no servidor; filtragem instantânea no client via useState
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="text" placeholder="Buscar por nome, e-mail..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "0.4rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", width: "200px" }} />

            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ padding: "0.4rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", backgroundColor: "#ffffff" }}>
              <option value="all">Todos os Departamentos</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="demo-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Departamento</th>
                <th>Role</th>
                <th>Status</th>
                <th>Último Acesso</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{u.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{u.email}</div>
                  </td>
                  <td>{u.department}</td>
                  <td>
                    <span className={u.role === "admin" ? "demo-badge-admin" : "demo-badge-user"}>{u.role}</span>
                  </td>
                  <td>
                    <span style={{ color: u.status === "Ativo" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>● {u.status}</span>
                  </td>
                  <td>{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ClientBoundary>
  );
}
