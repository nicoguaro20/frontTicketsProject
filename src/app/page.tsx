"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🧹 Limpiar formulario solo cuando estoy en /
  useEffect(() => {
    if (pathname === "/") {
      setEmail("");
      setPassword("");
      setShowPassword(false);
    }
  }, [pathname]);

  // 🔐 Redirigir SOLO si ya hay sesión y estoy en el login
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/") return;

    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (userId) {
      router.replace(isAdmin ? "/tickets-admin" : "/tickets");
    }
  }, [pathname, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginRes = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      // ✅ LOGIN OK
      if (loginRes.ok) {
        localStorage.setItem("userId", loginData.userId);
        localStorage.setItem("userEmail", loginData.email);
        localStorage.setItem("isAdmin", String(loginData.isAdmin));

        router.replace(
          loginData.isAdmin ? "/tickets-admin" : "/tickets"
        );
        return;
      }

      // 🆕 USUARIO NO EXISTE → REGISTRAR
      if (loginRes.status === 404 && loginData.error === "User not found") {
        const registerRes = await fetch(`${API_URL}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const registerData = await registerRes.json();

        if (!registerRes.ok) {
          alert(registerData.error || "Error al crear el usuario");
          return;
        }

        localStorage.setItem("userId", registerData.userId);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdmin", "false");

        router.replace("/tickets");
        return;
      }

      alert(loginData.error || "Credenciales inválidas");
    } catch {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-white py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#44444A]">
          Registro / Ingreso
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#44444A] mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-[#44444A] rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-[#44444A] mb-1">
            Contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 border border-[#44444A] rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <span className="text-sm text-[#44444A]">
            Mostrar contraseña
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F45858] text-white py-2 rounded hover:bg-[#e04e4e]"
        >
          {loading ? "Procesando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
