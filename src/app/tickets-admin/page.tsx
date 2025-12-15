"use client";

import { useEffect, useState } from "react";

interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  status?: string;
  pk: string;
}

interface User {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export default function AdminPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin =
    typeof window !== "undefined"
      ? localStorage.getItem("isAdmin") === "true"
      : false;

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail")
      : null;

  // 🔒 Protección básica (front)
  useEffect(() => {
    if (!isAdmin) {
      window.location.href = "/tickets";
    }
  }, [isAdmin]);

  // ======================
  // 📥 FETCH DATA
  // ======================

  const fetchTickets = async () => {
    const res = await fetch(`${API_URL}/admin/tickets`);
    const data = await res.json();
    if (res.ok) setTickets(data.tickets || []);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/admin/users`);
    const data = await res.json();
    if (res.ok) setUsers(data.users || []);
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  // ======================
  // 🔁 ACTIONS
  // ======================

  const updateTicketStatus = async (ticketId: string, status: string) => {
    setLoading(true);
    await fetch(`${API_URL}/ticket/update/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchTickets();
    setLoading(false);
  };

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    setLoading(true);
    await fetch(`${API_URL}/admin/user/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAdmin: !isAdmin }),
    });
    await fetchUsers();
    setLoading(false);
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  // ======================
  // 🎨 HELPERS
  // ======================

  const renderStatus = (status?: string) => {
    if (status === "CLOSED" || status === "closed") {
      return <span className="text-red-600 font-medium">Cerrado</span>;
    }
    return <span className="text-green-600 font-medium">Abierto</span>;
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-6 py-8">
      {/* 🔝 HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Panel Administrador</h1>
          {userEmail && (
            <p className="text-sm text-gray-600">
              Sesión iniciada como <strong>{userEmail}</strong>
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {/* ===================== */}
      {/* 🎟️ TICKETS */}
      {/* ===================== */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-xl font-medium mb-4">Tickets</h2>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Título</th>
                <th className="p-3 border text-left">Descripción</th>
                <th className="p-3 border text-left">Estado</th>
                <th className="p-3 border text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td className="p-3 border">{ticket.title}</td>
                  <td className="p-3 border">{ticket.description}</td>
                  <td className="p-3 border">
                    {renderStatus(ticket.status)}
                  </td>
                  <td className="p-3 border">
                    <button
                      disabled={loading}
                      onClick={() =>
                        updateTicketStatus(
                          ticket.ticketId,
                          ticket.status === "open" ? "CLOSED" : "open"
                        )
                      }
                      className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      Cambiar estado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================== */}
      {/* 👤 USERS */}
      {/* ===================== */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-medium mb-4">Usuarios</h2>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Email</th>
                <th className="p-3 border text-left">Rol</th>
                <th className="p-3 border text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">
                    {user.isAdmin ? "Admin" : "Usuario"}
                  </td>
                  <td className="p-3 border">
                    <button
                      disabled={loading}
                      onClick={() => toggleAdmin(user.userId, user.isAdmin)}
                      className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      {user.isAdmin ? "Quitar admin" : "Hacer admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
