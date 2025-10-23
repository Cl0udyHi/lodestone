"use client";

import SearchBar from "./searchbar";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ServerSearchQuery, Server } from "@/utils/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useServers } from "@/utils/hooks/useServers";
import ServerCard from "./server-card";

export const SearchQueryContext = createContext<
  [ServerSearchQuery, Dispatch<SetStateAction<ServerSearchQuery>>] | null
>(null);

export default function ServersSection() {
  return <Content />;
}

function Content() {
  const [searchQuery, setSearchQuery] = useState<ServerSearchQuery>({
    text: "",
    platforms: [],
    tags: [],
    versions: [],
  });

  const { data: servers, error, isPending } = useServers(searchQuery);

  return (
    <section className="w-full min-h-screen bg-neutral-100 px-16 py-8 flex flex-col gap-5">
      <h1 className="font-medium text-2xl text-neutral-800">Server List</h1>
      <SearchQueryContext.Provider value={[searchQuery, setSearchQuery]}>
        <SearchBar />

        <div className="grid grid-cols-2 grid-rows-10 gap-4">
          {isPending ? (
            <SuspenseServers />
          ) : (
            servers?.map((server, index) => {
              return <ServerCard key={index} server={server} />;
            })
          )}
        </div>
      </SearchQueryContext.Provider>
    </section>
  );
}

const SuspenseServers = () => {
  return (
    <>
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className="w-full h-[194px] bg-neutral-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </>
  );
};
