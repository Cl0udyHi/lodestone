"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { DDItemId, ServerSearchQuery } from "@/utils/types";
import { useServers } from "@/utils/hooks/useServers";
import ServerCard from "./server-card";
import Searchbar from "../ui/searchbar";
import Dropdown from "../ui/dropdown";
import { useDebounce } from "@uidotdev/usehooks";
import { DEBOUNCE_DELAY } from "@/utils/constants";
import { platforms, versions } from "@/utils/data";

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
        <SearchSection />

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

const SearchSection = () => {
  const setSearchQuery = useContext(SearchQueryContext)![1];

  function handleSearch(value: string) {
    setSearchQuery((prev) => {
      const newQuery: ServerSearchQuery = {
        ...prev,
        text: value,
        // versions: debouncedVersions,
        // platforms: debouncedPlatform,
      };

      return newQuery;
    });
  }

  const [value, setValue] = useState<string>("");
  const debouncedSearch = useDebounce(value, DEBOUNCE_DELAY);

  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const debouncedVersions = useDebounce(selectedVersions, DEBOUNCE_DELAY);

  function handleSupportedVersions(selectedItems: DDItemId[]) {
    setSelectedVersions(() => {
      const list = versions.map((version, index) => ({
        id: index,
        label: version,
      }));

      const selectedVersionStrings = list
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => item.label);

      return selectedVersionStrings;
    });
  }

  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const debouncedPlatform = useDebounce(selectedPlatform, DEBOUNCE_DELAY);

  function handlePlatform(selectedItems: DDItemId[]) {
    setSelectedPlatform(() => {
      const list = platforms.map((p, index) => ({
        id: index,
        label: p,
      }));

      const selectedPlatforms = list
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => item.label);

      return selectedPlatforms;
    });
  }

  useEffect(() => {
    setSearchQuery((prev) => {
      const newQuery: ServerSearchQuery = {
        ...prev,
        text: debouncedSearch,
        versions: debouncedVersions,
        platforms: debouncedPlatform,
      };

      return newQuery;
    });
  }, [debouncedSearch, debouncedVersions, debouncedPlatform]);

  return (
    <div className="flex flex-col gap-2">
      <Searchbar
        placeHolder="Type server name or IP (e.g. 'Survival', 'PvP', 'server.xyz')"
        submitMethod="onDebounce"
        onSubmit={(value) => handleSearch(value)}
      />

      <div className="flex justify-between">
        <div className="flex gap-2 flex-wrap">
          <Dropdown
            name="Platform"
            items={[
              { id: 0, label: "Java Edition" },
              { id: 1, label: "Bedrock Edition" },
            ]}
            onSelect={(selectedItems) => handlePlatform(selectedItems)}
          />

          <Dropdown
            name="Supported Versions"
            items={versions.map((version, index) => ({
              id: index,
              label: version,
            }))}
            search
            onSelect={(selectedItems) => handleSupportedVersions(selectedItems)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Dropdown
            name="Sort by"
            items={[
              "Most Players",
              "Least Players",
              "Most Rating",
              "Least Rating",
            ].map((_, index) => ({
              id: index,
              label: _,
            }))}
            position="RIGHT"
          />
        </div>
      </div>
    </div>
  );
};
