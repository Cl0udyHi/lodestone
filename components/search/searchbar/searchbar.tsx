"use client";

import { Servers } from "@/utils/data";
import React, {
  Dispatch,
  FormEvent,
  Ref,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import SuggestedTags from "./suggested-tags";
import { SearchContext, TagsContext } from "../servers-section";

export default function SearchBar() {
  const [search, setSearch] = useContext(SearchContext)!;
  const [tags, setTags] = useContext(TagsContext)!;

  const inputRef: RefObject<HTMLInputElement | null> = useRef(null);
  const formRef: RefObject<HTMLFormElement | null> = useRef(null);

  function SubmitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;

    setSearch(searchValue);
  }

  return (
    <div className="flex flex-col gap-2">
      <form
        ref={formRef}
        onSubmit={(e) => {
          SubmitSearch(e);
          inputRef.current?.blur();
        }}
        onChange={(e) => SubmitSearch(e)}
        className="group relative w-full flex outline outline-neutral-600 rounded-full focus-within:outline-2"
      >
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-5 text-neutral-800 placeholder:text-neutral-500 py-3 focus:outline-0 rounded-full"
          name="search"
          placeholder="Type server name, IP, or tags (e.g. 'Survival', 'PvP', 'server.xyz')"
          autoComplete="off"
        />
        {search.length > 0 ? (
          <button
            onClick={() => setSearch("")}
            type="button"
            name="reset"
            className="w-10 h-10 p-2 rounded-full m-2"
          >
            <svg
              className="fill-neutral-700 h-6"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            name="search"
            className="w-10 h-10 p-2 rounded-full m-2"
          >
            <svg
              className="fill-neutral-700 h-6"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
        )}

        <SuggestedTags />
      </form>
      <div className="flex gap-1 flex-wrap">
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
        {tags.map((tag, index) => {
          return <Tag key={index} name={tag} />;
        })}
      </div>
    </div>
  );
}

const Tag = ({ name }: { name: string }) => {
  const [tags, setTags] = useContext(TagsContext)!;

  function removeTag() {
    setTags(tags.filter((tag) => tag !== name));
  }

  return (
    <button
      onClick={removeTag}
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
        <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
      </svg>
      {name}
    </button>
  );
};
