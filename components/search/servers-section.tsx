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
  const [searchValue, setSearchValue] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    data: servers,
    status,
    error,
  } = useQuery({
    queryKey: ["servers", { searchValue, tags }],
    queryFn: () => fetchServers(searchValue, tags),
  });

  return (
    <section className="w-full min-h-screen bg-neutral-100 px-16 py-8 flex flex-col gap-5">
      <h1 className="font-medium text-2xl text-neutral-800">Server List</h1>
      <SearchContext.Provider value={[searchValue, setSearchValue]}>
        <TagsContext.Provider value={[tags, setTags]}>
          <SearchBar error={error} />

          <div className="grid grid-cols-2 gap-4">
            {status === "pending" ? (
              <SuspenseServers />
            ) : (
              servers?.map((server, index) => {
                return <ServerCard key={index} server={server} />;
              })
            )}
          </div>
        </TagsContext.Provider>
      </SearchContext.Provider>
    </section>
  );
}

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
