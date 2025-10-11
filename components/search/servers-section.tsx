"use client";

import SearchBar from "./searchbar/searchbar";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Server } from "@/utils/types";
import { Servers } from "@/utils/data";
import ServerCard from "./server-card";

export const ServersContext = createContext<
  [Server[], Dispatch<SetStateAction<Server[]>>] | null
>(null);
export const SearchContext = createContext<
  [string, Dispatch<SetStateAction<string>>] | null
>(null);
export const TagsContext = createContext<
  [string[], Dispatch<SetStateAction<string[]>>] | null
>(null);

export default function ServersSection() {
  const [servers, setServers] = useState<Server[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const filteredServers: Server[] = useMemo(() => {
    let newList: Server[] = Servers;

    if (searchValue.length < 1 || tags.length < 1) {
      newList = Servers;
    }

    if (searchValue.length > 0) {
      const words: string[] = searchValue.trim().toLowerCase().split(/\s+/);

      newList = Servers.filter((server) => {
        return words.every(
          (word) =>
            server.name.toLowerCase().includes(word) ||
            server.ip.toLowerCase().includes(word) ||
            server.description.toLowerCase().includes(word) ||
            server.port.toString() === word
        );
      });
    }

    if (tags.length > 0) {
      newList = newList.filter((server) => {
        return tags.every((tag) => server.tags?.includes(tag));
      });
    }

    setServers(newList);
    return newList;
  }, [searchValue, tags]);

  return (
    <section className="w-full h-screen bg-neutral-100 px-16 py-8 flex flex-col gap-5">
      <h1 className="font-medium text-2xl text-neutral-800">Server List</h1>
      <ServersContext.Provider value={[servers, setServers]}>
        <SearchContext.Provider value={[searchValue, setSearchValue]}>
          <TagsContext.Provider value={[tags, setTags]}>
            <SearchBar />

            <div className="grid grid-cols-2 gap-4">
              {filteredServers.map((server, index) => {
                return <ServerCard key={index} server={server} />;
              })}
            </div>
          </TagsContext.Provider>
        </SearchContext.Provider>
      </ServersContext.Provider>
    </section>
  );
}
