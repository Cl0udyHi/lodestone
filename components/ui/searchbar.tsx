import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import SearchIcon from "@/public/assets/icons/search.svg";
import CloseIcon from "@/public/assets/icons/close.svg";
import { useDebounce } from "@uidotdev/usehooks";
import classNames from "classnames";

interface SearchbarProps {
  className?: string;
  placeHolder?: string;
  submitMethod?: "onDebounce" | "onSubmit" | "OnChange";
  debounceDelay?: number;
  submitKey?: string;
  onSubmit?: (value: string) => void;
}

export interface SearchbarRef {
  value: string;
  setValue: (v: string) => void;
  clear: () => void;
}

const Searchbar = forwardRef<SearchbarRef, SearchbarProps>(
  (
    {
      className,
      placeHolder,
      submitMethod = "onSubmit",
      debounceDelay = 300,
      submitKey = "Enter",
      onSubmit,
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState<string>("");

    const debouncedSearchValue = useDebounce(searchValue, debounceDelay);

    useEffect(() => {
      if (submitMethod !== "onDebounce") return;
      onSubmit?.(debouncedSearchValue);
    }, [debouncedSearchValue]);

    useEffect(() => {
      if (submitMethod !== "OnChange") return;
      onSubmit?.(searchValue);
    }, [searchValue]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (submitMethod !== "onSubmit") return;
      onSubmit?.(searchValue);
    }

    useImperativeHandle(ref, () => ({
      value: searchValue,
      setValue: (v: string) => setSearchValue(v),
      clear: () => setSearchValue(""),
    }));

    return (
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === submitKey && submitMethod !== "onSubmit") {
            e.preventDefault();
          }
        }}
        className={classNames(
          className,
          "group relative w-full flex outline outline-neutral-600 rounded-full focus-within:outline-2 overflow-hidden"
        )}
      >
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-5 text-neutral-800 placeholder:text-neutral-500 py-3 focus:outline-0"
          placeholder={placeHolder ?? "Search"}
          autoComplete="off"
        />
        {searchValue.length > 0 ? (
          <button
            onClick={() => setSearchValue("")}
            type="button"
            name="reset"
            className="w-10 h-10 p-2 rounded-full m-2"
          >
            <CloseIcon className="fill-neutral-700 h-6" />
          </button>
        ) : (
          <div className="w-10 h-10 p-2 rounded-full m-2">
            <SearchIcon className="fill-neutral-700 h-6" />
          </div>
        )}
      </form>
    );
  }
);

Searchbar.displayName = "Searchbar";

export default Searchbar;
