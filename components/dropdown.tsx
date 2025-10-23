import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import classNames from "classnames";

import ArrowIcon from "@/public/assets/icons/arrow_dropdown.svg";
import CheckmarkIcon from "@/public/assets/icons/checkmark.svg";
import SearchIcon from "@/public/assets/icons/search.svg";
import CloseIcon from "@/public/assets/icons/close.svg";

import { useOutsideClick } from "@/utils/hooks/useClickoutside";

type ItemId = string | number;
type Item = { id: ItemId; label: string };

interface Dropdown {
  name: string;
  items: Item[];
  onSelect?: (selectedItems: ItemId[], items: Item[]) => void;
  onOpen?: (isOpen: boolean) => void;
  search?: boolean;
}

export default function Dropdown({
  name,
  items,
  onSelect,
  onOpen,
  search,
}: Dropdown) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false), isOpen);

  function handleOpen() {
    const newState = !isOpen;

    setIsOpen(newState);
    onOpen?.(newState);
  }

  const [selectedItems, setSelectedItems] = useState<ItemId[]>([]);

  function handleSelect(item: Item) {
    setSelectedItems((prev) => {
      if (prev.includes(item.id)) return prev.filter((id) => id !== item.id);

      return [...prev, item.id];
    });

    onSelect?.(selectedItems, items);
  }

  const [list, setList] = useState<Item[]>([]);

  function updateItems(value: string) {
    const words: string[] = value.toLowerCase().split(" ");

    const list = items.filter((item) => {
      return words.every((word) => item.label.startsWith(word));
    });

    setList(list);
  }

  useEffect(() => {
    updateItems("");
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        className="pl-4! bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-base rounded-full"
        onClick={() => handleOpen()}
      >
        {name}
        <ArrowIcon
          className={classNames("fill-neutral-800 w-6 transition-transform", {
            "rotate-x-180": isOpen,
          })}
        />
      </Button>
      <ul
        className={classNames(
          `min-w-full max-h-[calc(48px*5)] absolute left-0 top-[calc(100%+0.25rem)] bg-neutral-100 rounded-lg z-50 text-neutral-800 border border-neutral-300 transition-all duration-150 ease-in-out overflow-hidden`,
          "overflow-y-scroll scrollbar-hide",
          { "": isOpen },
          { "opacity-0 pointer-events-none -translate-y-2": !isOpen }
        )}
      >
        {(search || items.length > 10) && (
          <SearchBar
            onChange={(value) => {
              updateItems(value);
            }}
            onClear={() => setSelectedItems([])}
          />
        )}

        {list.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelect(item)}
              className="flex justify-between gap-4 text-start w-full px-4 py-3 hover:bg-neutral-200 bg-neutral-100 text-base text-nowrap"
            >
              {item.label}
              <CheckmarkIcon
                className={classNames("fill-neutral-800 w-5", {
                  "opacity-0": !selectedItems?.includes(item.id),
                })}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SearchBar = ({
  onChange,
  onClear,
}: {
  onChange: (value: string) => void;
  onClear: () => void;
}) => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange() {
    if (!inputRef.current) return;

    setValue(inputRef.current.value);
    onChange?.(inputRef.current.value);
  }

  return (
    <div className="p-2 flex flex-col items-start gap-1 sticky top-0 bg-neutral-100">
      <div className="group w-max flex outline outline-neutral-600 rounded-sm focus-within:outline-2">
        <input
          ref={inputRef}
          value={value}
          onChange={() => handleChange()}
          className="max-w-full w-full pl-3 text-neutral-800 placeholder:text-neutral-500 focus:outline-0 rounded-full"
          name="search"
          placeholder="Search"
          autoComplete="off"
        />
        {value.length > 0 ? (
          <button
            onClick={() => {
              setValue("");
              onChange?.("");
            }}
            type="button"
            name="reset"
            className="w-10 h-10 p-2 rounded-full"
          >
            <CloseIcon className="fill-neutral-700 h-6" />
          </button>
        ) : (
          <div className="w-10 h-10 p-2 rounded-full">
            <SearchIcon className="fill-neutral-700 h-6" />
          </div>
        )}
      </div>
      <button
        className="px-2 text-sm text-[blue] underline"
        onClick={() => onClear?.()}
      >
        Clear All
      </button>
    </div>
  );
};
