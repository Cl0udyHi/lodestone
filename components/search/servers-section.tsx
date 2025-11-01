"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DDSection,
  makeSection,
  SearchSort,
  Server,
  ServerSearchQuery,
} from "@/utils/types";
import { useServers } from "@/utils/hooks/useServers";
import ServerCard from "./server-card";
import Searchbar from "../ui/searchbar";
import Dropdown from "../ui/dropdown";
import { PLATFORMS, VERSIONS } from "@/utils/constants";
import { TAGS } from "@/utils/demo-data";
import classNames from "classnames";

export const SearchQueryContext = createContext<
  [ServerSearchQuery, Dispatch<SetStateAction<ServerSearchQuery>>] | null
>(null);

export default function ServersSection() {
  return <Content />;
}

function Content() {
  const [searchQuery, setSearchQuery] = useState<ServerSearchQuery>({});

  const { data, error, isPending } = useServers(searchQuery);
  const servers: Server[] = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <section className="w-full min-h-screen bg-neutral-100 px-8 md:px-16 py-8 flex flex-col gap-5">
      <h1 className="font-medium text-2xl text-neutral-800">Server List</h1>
      <SearchQueryContext.Provider value={[searchQuery, setSearchQuery]}>
        <SearchSection />

        {error ? (
          <h1>An error has occurred: {error.message}</h1>
        ) : (
          <div
            className={classNames(
              "grid gap-4",
              "grid-cols-1 grid-rows-20",
              "lg:grid-cols-2 lg:grid-rows-10",
              "2xl:grid-cols-3 2xl:grid-rows-7"
            )}
          >
            {isPending ? (
              <ServersSkeleton />
            ) : (
              servers?.map((server, index) => {
                return <ServerCard key={index} server={server} />;
              })
            )}
          </div>
        )}
      </SearchQueryContext.Provider>
    </section>
  );
}

const ServersSkeleton = () => {
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
  const [sortValue, setSortValue] = useState<{ [k: string]: SearchSort }>({});
  const [tagsValue, setTagsValue] = useState<string[]>([]);

  useEffect(() => {
    setSearchQuery((prev) => {
      const newQuery: ServerSearchQuery = {
        ...prev,
        text: searchValue,
        versions: versionsValue,
        platforms: platformValue,
        sort: sortValue,
        tags: tagsValue,
      };

      return newQuery;
    });
  }, [searchValue, versionsValue, platformValue, sortValue, tagsValue]);

  const platforms = [
    makeSection(
      "platforms",
      "multiple",
      PLATFORMS.map((platform, index) => ({
        id: index.toString(),
        label: platform,
      }))
    ),
  ];

  function handlePlaformSelect(selectedItems: DDSection[]) {
    const platformSection = selectedItems.find((sec) => sec.id === "platforms");

    if (platformSection) {
      setPlatformValue(platformSection.getSelectedLabels());
    }
  }

  const versions = [
    makeSection(
      "versions",
      "multiple",
      VERSIONS.map((version, index) => ({
        id: index.toString(),
        label: version,
      }))
    ),
  ];

  function handleVersionSelect(selectedItems: DDSection[]) {
    setVersionsValue(selectedItems[0].getSelectedLabels());
  }

  const sort = [
    makeSection("players", "select", [
      {
        id: "most",
        label: "Most Players",
        selected: true,
      },
      {
        id: "least",
        label: "Least Players",
      },
    ]),
    makeSection("ratings", "select", [
      {
        id: "most",
        label: "Most Rating",
        selected: true,
      },
      {
        id: "least",
        label: "Least Rating",
      },
    ]),
  ];

  function handleSortSelect(selectedItems: DDSection[]) {
    const sort = Object.fromEntries(
      selectedItems.map((section) => [
        section.id,
        section.getSelectedItems()[0]?.id as SearchSort,
      ])
    );

    setSortValue(sort);
  }

  const tags = [
    makeSection(
      "tags",
      "multiple",
      TAGS.map((tag, index) => ({
        id: index.toString(),
        label: tag,
      }))
    ),
  ];

  function handleTagSelect(selectedItems: DDSection[]) {
    setTagsValue(
      selectedItems.flatMap((section) =>
        section.items.filter((item) => item.selected).map((item) => item.label)
      )
    );
  }

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
            name="Platforms"
            sections={platforms}
            onSelect={handlePlaformSelect}
          />

          <Dropdown
            name="Versions"
            sections={versions}
            onSelect={handleVersionSelect}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Dropdown
            name="Tags"
            sections={tags}
            onSelect={handleTagSelect}
            placement="bottom-end"
          />
          <Dropdown
            name="Sort by"
            sections={sort}
            onSelect={handleSortSelect}
            placement="bottom-end"
          />
        </div>
      </div>
    </div>
  );
};
