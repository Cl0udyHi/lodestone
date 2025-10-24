import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "../shadcn-ui/button";
import classNames from "classnames";

import ArrowIcon from "@/public/assets/icons/arrow_dropdown.svg";
import CheckmarkIcon from "@/public/assets/icons/checkmark.svg";
import SearchIcon from "@/public/assets/icons/search.svg";
import CloseIcon from "@/public/assets/icons/close.svg";

import { useOutsideClick } from "@/utils/hooks/useClickoutside";
import { DDItem, DDItemId } from "@/utils/types";
import { RemoveScroll } from "react-remove-scroll";

interface Dropdown {
  name: string;
  items: DDItem[];
  onSelect?: (selectedItems: DDItemId[], items: DDItem[]) => void;
  onOpen?: (isOpen: boolean) => void;
  search?: boolean;
  position?: "LEFT" | "CENTER" | "RIGHT";
}

export default function Dropdown({
  name,
  items,
  onSelect,
  onOpen,
  search,
  position = "LEFT",
}: Dropdown) {
  const [searchValue, setSearchValue] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const listRef = useRef<HTMLUListElement | null>(null);
  const ref = useOutsideClick<HTMLDivElement>(() => handleOpen(false), isOpen);

  function handleOpen(bool?: boolean) {
    const newState = bool ? bool : !isOpen;

    setIsOpen(newState);
    onOpen?.(newState);

    if (newState == false)
      setTimeout(() => {
        listRef.current?.scrollTo({ top: 0, behavior: "instant" });

        setSearchValue("");
      }, 150);
  }

  const [selectedItems, setSelectedItems] = useState<DDItemId[]>([]);

  function handleSelect(item?: DDItem) {
    let newSelectedItems: DDItemId[] = !item
      ? []
      : selectedItems.includes(item.id)
      ? selectedItems.filter((id) => id !== item.id)
      : [...selectedItems, item.id];

    setSelectedItems(newSelectedItems);
    onSelect?.(newSelectedItems, items);
  }

  const [list, setList] = useState<DDItem[]>([]);

  function updateItems(value: string) {
    const words: string[] = value.toLowerCase().split(" ");

    const list = items.filter((item) => {
      return words.every((word) => item.label.toLowerCase().includes(word));
    });

    setList(list);
  }

  useEffect(() => {
    updateItems("");
  }, [items]);

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
      <RemoveScroll enabled={isOpen}>
        <ul
          ref={listRef}
          className={classNames(
            `w-fit max-h-[calc(48px*5)] absolute top-[calc(100%+0.25rem)] bg-neutral-100 rounded-lg z-50 text-neutral-800 border border-neutral-300 transition-all duration-150 ease-in-out overflow-hidden`,
            "overflow-y-scroll scrollbar-hide",
            { "left-0 right-auto": position == "LEFT" },
            { "left-1/2 -translate-x-1/2": position == "CENTER" },
            { "right-0 left-auto": position == "RIGHT" },
            { "opacity-0 pointer-events-none -translate-y-2": !isOpen }
          )}
        >
          {(search || items.length > 10) && (
            <SearchBar
              onChange={(value) => {
                updateItems(value);
              }}
              onClear={() => handleSelect()}
              value={searchValue}
              setValue={setSearchValue}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
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
      </RemoveScroll>
    </div>
  );
}

const SearchBar = ({
  value,
  setValue,
  onChange,
  onClear,
  selectedItems,
  setSelectedItems,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onChange: (value: string) => void;
  onClear?: () => void;
  selectedItems: DDItemId[];
  setSelectedItems: Dispatch<SetStateAction<DDItemId[]>>;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(a?: string) {
    if (!inputRef.current) return;

    const inputValue = a ?? inputRef.current.value;

    setValue(inputValue);
    onChange?.(inputValue);
  }

  function handleClear() {
    setSelectedItems([]);
    onClear?.();
    onChange?.(value);
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
        className={classNames("px-2 text-sm text-[blue] underline", {
          "opacity-50 cursor-not-allowed": selectedItems.length < 1,
        })}
        onClick={() => handleClear()}
        disabled={selectedItems.length < 1}
      >
        Clear All
      </button>
    </div>
  );
};
