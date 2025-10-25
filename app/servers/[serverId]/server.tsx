"use client";

import { useServers } from "@/utils/hooks/useServers";
import type { Server } from "@/utils/types";

export default function Server({ serverId }: { serverId: string }) {
  const { data: server } = useServers({ serverId: serverId });

  return <h1>Server {(server as Server)?.name}</h1>;
}
