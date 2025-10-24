"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { makeSection, ServerSearchQuery } from "@/utils/types";
import { useServers } from "@/utils/hooks/useServers";
import ServerCard from "./server-card";
import Searchbar from "../ui/searchbar";
import Dropdown from "../ui/dropdown";
import { PLATFORMS, VERSIONS } from "@/utils/constants";

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

  const [searchValue, setSearchValue] = useState<string>("");
  const [versionsValue, setVersionsValue] = useState<string[]>([]);
  const [platformValue, setPlatformValue] = useState<string[]>([]);

  useEffect(() => {
    setSearchQuery((prev) => {
      const newQuery: ServerSearchQuery = {
        ...prev,
        text: searchValue,
        versions: versionsValue,
        platforms: platformValue,
      };

      return newQuery;
    });
  }, [searchValue, versionsValue, platformValue]);

  return (
    <div className="flex flex-col gap-2">
      <Searchbar
        placeHolder="Type server name or IP (e.g. 'Survival', 'PvP', 'server.xyz')"
        submitMethod="onDebounce"
        onSubmit={(value) => setSearchValue(value)}
      />

      <div className="flex justify-between">
        <div className="flex gap-2 flex-wrap">
          <Dropdown
            name="Platform"
            sections={[
              makeSection(
                0,
                "multiple",
                PLATFORMS.map((platform, index) => ({
                  id: index,
                  label: platform,
                }))
              ),
            ]}
            onSelect={(selectedItems) =>
              setPlatformValue(selectedItems[0].getSelectedLabels())
            }
          />

          <Dropdown
            name="Versions"
            sections={[
              makeSection(
                0,
                "multiple",
                VERSIONS.map((version, index) => ({
                  id: index,
                  label: version,
                }))
              ),
            ]}
            onSelect={(selectedItems) => {
              setVersionsValue(selectedItems[0].getSelectedLabels());
            }}
          />
        </div>

        <Dropdown
          name="Sort by"
          sections={[
            makeSection(0, "select", [
              {
                id: 0,
                label: "Most Players",
                selected: true,
              },
              {
                id: 1,
                label: "Least Players",
              },
            ]),
            makeSection(1, "select", [
              {
                id: 0,
                label: "Most Rating",
                selected: true,
              },
              {
                id: 1,
                label: "Least Rating",
              },
            ]),
          ]}
          // onSelect={(selectedItems) => {
          //   setPlatformValue(selectedItems[0].getSelectedLabels());
          //   console.log(selectedItems[0].getSelectedLabels());
          // }}
          position="RIGHT"
        />
      </div>
    </div>
  );
};
