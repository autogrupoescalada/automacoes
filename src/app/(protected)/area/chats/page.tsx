"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Collaborator {
  name_contact: string;
  saler_phone: string;
  saler_id: string,
}

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        console.log("Buscando chats...");
        const response = await fetch("https://autowebhook.escaladaecom.com.br/webhook/collaborators-sb", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        setCollaborators(data.collaborators);
      } catch (error) {
        console.error("Erro ao buscar chats:", error);
        setError("Falha ao carregar chats. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    // Use "void" para indicar que estamos intencionalmente ignorando a Promise retornada
    void fetchCollaborators();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando chats...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-2 min-w-full min-h-full px-10 items-center">
      <h2 className="text-3xl font-semibold font-title">Lista de Chats</h2>
      <p className="text-muted-foreground text-xs">
        Clique em um chat para visualizar seu histórico de chats.
      </p>
      <div className="w-full max-w-lg border-t my-8" />

      <div className="w-full max-w-lg">
        <ul className="rounded-lg shadow-md overflow-hidden">
          {collaborators.map((collaborator, index) => {

            return (
              <li key={index} className="border-b last:border-none">
                <Link
                  href={`/area/chat-historico?id=${collaborator.saler_id}`}
                  className="block px-6 py-4 transition-all hover:bg-muted"
                >
                  <div className="font-semibold">{collaborator.name_contact}</div>
                  <div className="text-sm text-gray-500">📱 {collaborator.saler_phone || "Não informado"}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
