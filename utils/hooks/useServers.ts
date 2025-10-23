import { useQuery } from "@tanstack/react-query";
import type { ServerSearchQuery } from "../types";
import { fetchServers } from "../utils";

export const useServers = (searchQuery: ServerSearchQuery) => {
  return useQuery({
    queryKey: ["servers", { searchQuery }],
    queryFn: () => fetchServers(searchQuery),
  });
};
