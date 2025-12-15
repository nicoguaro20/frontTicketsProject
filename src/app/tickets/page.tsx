"use client";

import { useEffect, useState } from "react";

interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  status: string;
  createdAt?: string;
}

export default function TicketsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🎟️ Opciones de tickets (random/controladas)
  const ticketOptions = [
    "Falla en el servidor",
    "Problemas de software",
    "Acceso / credenciales",
    "Problemas de red",
    "Error en el sistema / ERP",
  ];

  const [titleSelect, setTitleSelect] = useState(ticketOptions[0]);
  const [customTitle, setCustomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✅ filtro de estado
  const [statusFilter, setStatusFilter] =
    useState<"all" | "open" | "closed">("all");

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail")
      : null;

  // 🔒 Protección de ruta
  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
    } else {
      setCheckingAuth(false);
    }
  }, [userId]);

  // 🔄 Cargar tickets
  const fetchTickets = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/users/${userId}/tickets`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Error cargando tickets:", error);
      setTickets([]);
    }
  };

  useEffect(() => {
    if (userId) fetchTickets();
  }, [userId]);

  // ➕ Crear ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const finalTitle =
      titleSelect === "otro" ? customTitle.trim() : titleSelect;

    if (!finalTitle) {
      alert("Debes ingresar un título");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          description,
          userId,
        }),
      });

      if (res.ok) {
        setTitleSelect(ticketOptions[0]);
        setCustomTitle("");
        setDescription("");
        fetchTickets();
      } else {
        const data = await res.json();
        alert(data?.error || "Error creando el ticket");
      }
    } catch {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  // 🎨 Badge de estado
  const renderStatus = (status: string) => {
    const base = "px-2 py-1 rounded text-xs font-medium";

    if (status === "open") {
      return (
        <span className={`${base} bg-green-100 text-green-700`}>
          Abierto
        </span>
      );
    }

    if (status === "closed") {
      return (
        <span className={`${base} bg-red-100 text-red-700`}>
          Cerrado
        </span>
      );
    }

    return (
      <span className={`${base} bg-gray-200 text-gray-700`}>
        {status}
      </span>
    );
  };

  // ✅ tickets filtrados
  const filteredTickets =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* 🔝 Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center py-6 px-4">
        <div>
          <h1 className="text-2xl font-semibold">Mis Tickets</h1>
          {userEmail && (
            <p className="text-sm text-gray-600">
              Sesión iniciada como <strong>{userEmail}</strong>
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-sm bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ➕ Crear ticket */}
        <form
          onSubmit={handleCreateTicket}
          className="bg-white p-6 rounded shadow mb-8"
        >
          <h2 className="text-lg font-medium mb-4">Nuevo Ticket</h2>

          {/* 🎯 SELECT DE TÍTULO */}
          <div className="mb-3">
            <label className="block text-sm mb-1">
              Tipo de solicitud
            </label>
            <select
              className="w-full border px-3 py-2 rounded bg-white"
              value={titleSelect}
              onChange={(e) => setTitleSelect(e.target.value)}
            >
              {ticketOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* ✏️ TÍTULO PERSONALIZADO */}
          {titleSelect === "otro" && (
            <div className="mb-3">
              <label className="block text-sm mb-1">
                Especifica el título
              </label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm mb-1">Descripción</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#F45858] text-white px-4 py-2 rounded hover:bg-[#e04e4e]"
          >
            {loading ? "Creando..." : "Crear ticket"}
          </button>
        </form>

        {/* 🔎 Filtro */}
        <div className="flex justify-end mb-4">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "open" | "closed"
              )
            }
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="all">Todos</option>
            <option value="open">Abiertos</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>

        {/* 📋 Tabla */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Título,</th>
                <th className="p-3 border text-left">Descripción</th>
                <th className="p-3 border text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-gray-500"
                  >
                    No hay tickets para este filtro
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.ticketId}>
                    <td className="p-3 border">{ticket.title}</td>
                    <td className="p-3 border">
                      {ticket.description}
                    </td>
                    <td className="p-3 border">
                      {renderStatus(ticket.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

