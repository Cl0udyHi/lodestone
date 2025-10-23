"use client";

import React, { useContext, useEffect, useState } from "react";
import { SearchQueryContext } from "../servers-section";
import { useDebounce } from "@/utils/hooks/useDebounce";

import SearchIcon from "@/public/assets/icons/search.svg";
import CloseIcon from "@/public/assets/icons/close.svg";

import Dropdown from "@/components/dropdown";
import { ServerSearchQuery } from "@/utils/types";
import { versions } from "@/utils/data";

export default function SearchBar() {
  const setSearchQuery = useContext(SearchQueryContext)![1];

  const [value, setValue] = useState<string>("");
  const debouncedSearch = useDebounce(value);

  useEffect(() => {
    setSearchQuery((prev) => {
      const newQuery: ServerSearchQuery = {
        ...prev,
        text: debouncedSearch,
      };

      return newQuery;
    });
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-2">
      <div className="group relative w-full flex outline outline-neutral-600 rounded-full focus-within:outline-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-5 text-neutral-800 placeholder:text-neutral-500 py-3 focus:outline-0 rounded-full"
          name="search"
          placeholder="Type server name, IP, or tags (e.g. 'Survival', 'PvP', 'server.xyz')"
          autoComplete="off"
        />
        {value.length > 0 ? (
          <button
            onClick={() => setValue("")}
            type="button"
            name="reset"
            className="w-10 h-10 p-2 rounded-full m-2"
          >
            <CloseIcon className="fill-neutral-700 h-6" />
          </button>
        ) : (
          <button
            type="submit"
            name="search"
            className="w-10 h-10 p-2 rounded-full m-2"
          >
            <SearchIcon className="fill-neutral-700 h-6" />
          </button>
        )}

        {/* <SuggestedTags /> */}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Dropdown
          name="Platform"
          items={[
            { id: 0, label: "Java Edition" },
            { id: 1, label: "Bedrock Edition" },
          ]}
        />

        <Dropdown
          name="Supported Versions"
          items={versions.map((version, index) => ({
            id: index,
            label: version,
          }))}
          search
        />
      </div>

      {/* <div className="flex gap-1 flex-wrap">
        <button className="flex gap-1 text-neutral-800 pl-2 pr-4 py-1 items-center hover:bg-neutral-300 bg-neutral-200 transition-colors rounded-full">
          <svg
            className="fill-neutral-700 h-5"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z" />
          </svg>
          Add Tags
        </button>
        {tags.length > 1 && (
          <button
            onClick={() => {
              setTags([]);
            }}
            className="flex gap-1 text-neutral-800 pl-2 pr-4 py-1 items-center hover:bg-neutral-300 bg-neutral-200 transition-colors rounded-full"
          >
            <svg
              className="fill-neutral-700 h-5"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Zm200 316 76 76q11 11 28 11t28-11q11-11 11-28t-11-28l-76-76 76-76q11-11 11-28t-11-28q-11-11-28-11t-28 11l-76 76-76-76q-11-11-28-11t-28 11q-11 11-11 28t11 28l76 76-76 76q-11 11-11 28t11 28q11 11 28 11t28-11l76-76Z" />
            </svg>
            Clear All
          </button>
        )}

        <div className="border-1 border-neutral-200 my-1 mx-2"></div>

        {tags.map((tag, index) => {
          return <Tag key={index} name={tag} />;
        })}
      </div> */}
    </div>
  );
}
