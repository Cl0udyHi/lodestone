"use client";

import SearchBar from "./searchbar/searchbar";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Server } from "@/utils/types";
import ServerCard from "./server-card";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { fetchServers } from "@/utils/utils";

export const ServersContext = createContext<
  [Server[], Dispatch<SetStateAction<Server[]>>] | null
>(null);
export const SearchContext = createContext<
  [string, Dispatch<SetStateAction<string>>] | null
>(null);
export const TagsContext = createContext<
  [string[], Dispatch<SetStateAction<string[]>>] | null
>(null);

const queryClient = new QueryClient();

export default function ServersSection() {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
  );
}

function Content() {
  const [servers, setServers] = useState<Server[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const { data, status } = useQuery({
    queryKey: ["servers", { searchValue, tags }],
    queryFn: () => fetchServers(searchValue, tags),
  });

  return (
    <section className="w-full min-h-screen bg-neutral-100 px-16 py-8 flex flex-col gap-5">
      <h1 className="font-medium text-2xl text-neutral-800">Server List</h1>
      <ServersContext.Provider value={[servers, setServers]}>
        <SearchContext.Provider value={[searchValue, setSearchValue]}>
          <TagsContext.Provider value={[tags, setTags]}>
            <SearchBar />

            <div className="grid grid-cols-2 gap-4">
              {status === "pending" ? (
                <SuspenseServers />
              ) : (
                <ServersList servers={data ?? []} />
              )}
            </div>
          </TagsContext.Provider>
        </SearchContext.Provider>
      </ServersContext.Provider>
    </section>
  );
}

const ServersList = ({ servers }: { servers: Server[] }) => {
  return (
    <>
      {servers.map((server, index) => {
        return <ServerCard key={index} server={server} />;
      })}
    </>
  );
};

const SuspenseServers = () => {
  return (
    <>
      {Array(20)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-full h-[194px] bg-neutral-200 rounded-lg animate-pulse"
          ></div>
        ))}
    </>
  );
};
