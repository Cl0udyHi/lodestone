"use client";

import classNames from "classnames";
import { useContext } from "react";
import { SearchContext, TagsContext } from "../servers-section";
import { AddTag } from "../../../utils/search";
import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/utils/utils";

export default function SuggestedTags() {
  const [search, setSearch] = useContext(SearchContext)!;
  const [tags, setTags] = useContext(TagsContext)!;

  const { data } = useQuery({
    queryKey: ["tags", { search, tags }],
    queryFn: () => fetchTags(search[-1], tags),
  });

  return (
    <div
      className={classNames(
        "absolute p-2 inset-0 w-full h-fit bg-neutral-100 top-[calc(100%+0.5em)] border border-neutral-600 rounded-lg group-focus-within:flex hidden flex-col z-20 overflow-hidden",
        {
          "hidden!": search.trim() === "" || (data && data.length < 1),
        }
      )}
    >
      <ul className="max-h-[200px] overflow-y-scroll">
        {data &&
          data.length > 0 &&
          data.map((tag, index) => (
            <li key={index}>
              <button
                onClick={() => AddTag(tag, tags, setTags, setSearch)}
                type="button"
                className="w-full flex gap-2 p-2 hover:bg-neutral-200 text-base text-neutral-800 font-normal rounded-sm"
              >
                <svg
                  className="fill-neutral-700 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z" />
                </svg>
                {tag}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
