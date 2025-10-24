import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "../shadcn-ui/button";
import classNames from "classnames";

import ArrowIcon from "@/public/assets/icons/arrow_dropdown.svg";
import CheckmarkIcon from "@/public/assets/icons/checkmark.svg";
import RadioCheckedIcon from "@/public/assets/icons/radio_checked.svg";
import RadioUnCheckedIcon from "@/public/assets/icons/radio_unchecked.svg";

import { useOutsideClick } from "@/utils/hooks/useClickoutside";
import { DDItem, DDSection } from "@/utils/types";
import { RemoveScroll } from "react-remove-scroll";
import Searchbar, { SearchbarRef } from "./searchbar";
import { DEBOUNCE_DELAY } from "@/utils/constants";
import { useDebounce } from "@uidotdev/usehooks";

interface Dropdown {
  name: string;
  sections: DDSection[];
  onSelect?: (selectedItems: DDSection[]) => void;
  onOpen?: (isOpen: boolean) => void;
  search?: boolean;
}

export default function Dropdown({
  name,
  sections,
  onSelect,
  onOpen,
  search,
}: Dropdown) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const listRef = useRef<HTMLUListElement | null>(null);
  const ref = useOutsideClick<HTMLDivElement>(() => handleOpen(false), isOpen);
  const { position, horizontalShift } = useDropdownPosition(isOpen, ref);

  const searchBarRefs = useRef<SearchbarRef[]>([]);

  function registerRef(el: SearchbarRef | null, index: number) {
    if (el) searchBarRefs.current[index] = el;
  }

  function handleOpen(bool?: boolean) {
    const newState = bool ? bool : !isOpen;

    setIsOpen(newState);
    onOpen?.(newState);

    if (newState == false)
      setTimeout(() => {
        searchBarRefs.current.forEach((ref) => ref?.clear());

        listRef.current?.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }, 150);
  }

  const [list, setList] = useState<DDSection[]>(sections);

  const [selected, setSelected] = useState<DDSection[]>(sections);
  const debouncedSelected = useDebounce(selected, DEBOUNCE_DELAY);

  function handleSelect(section: DDSection, item: DDItem) {
    setSelected((prev) =>
      prev.map((s) => {
        if (s.id === section.id) {
          if (section.type === "multiple") {
            const updatedItems = s.items.map((i) =>
              i.id === item.id ? { ...i, selected: !i.selected } : i
            );

            return new DDSection(s.id, s.type, updatedItems);
          }

          if (section.type === "select") {
            const updatedItems = s.items.map((i) => ({
              ...i,
              selected: i.id === item.id,
            }));

            return new DDSection(s.id, s.type, updatedItems);
          }
        }

        return s;
      })
    );
  }

  useEffect(() => {
    onSelect?.(debouncedSelected);
  }, [debouncedSelected]);

  function searchSection(value: string, targetSection: DDSection) {
    setList((prev) =>
      prev.map((section) => {
        if (section.id === targetSection.id) {
          const original = sections.find((s) => s.id === section.id);
          if (!original) return section;

          const filteredItems = original.items.filter((item) =>
            item.label.toLowerCase().includes(value.toLowerCase())
          );

          return new DDSection(section.id, section.type, filteredItems);
        }

        return section;
      })
    );
  }

  function handleClearSection(section: DDSection) {
    setSelected((prev) =>
      prev.map((s) => {
        if (s.id === section.id) {
          const clearedItems = s.items.map((i) => ({ ...i, selected: false }));
          return new DDSection(s.id, s.type, clearedItems);
        }
        return s;
      })
    );
  }

  function useDropdownPosition(
    isOpen: boolean,
    ref: React.RefObject<HTMLElement>
  ) {
    const [position, setPosition] = useState<"top" | "bottom">("bottom");
    const [horizontalShift, setHorizontalShift] = useState<
      "left" | "right" | "center"
    >("left");

    useLayoutEffect(() => {
      if (!isOpen || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }

      if (rect.left < 200) setHorizontalShift("left");
      else if (viewportWidth - rect.right < 200) setHorizontalShift("right");
    }, [isOpen]);

    return { position, horizontalShift };
  }

  return (
    <div ref={ref} className="relative">
      <Button
        onClick={() => handleOpen()}
        className="pl-4! bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-base rounded-full"
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
            `w-fit max-h-[calc(48px*5)] absolute bg-neutral-100 rounded-lg z-50 text-neutral-800 border border-neutral-600 transition-all duration-150 ease-in-out overflow-hidden`,
            "overflow-y-scroll scrollbar-hide",
            {
              "top-[calc(100%+0.25rem)]": position === "bottom",
              "bottom-[calc(100%+0.25rem)]": position === "top",
              "left-0 right-auto": horizontalShift === "left",
              "right-0 left-auto": horizontalShift === "right",
              "opacity-0 pointer-events-none -translate-y-2": !isOpen,
            }
          )}
        >
          {(search || sections.length > 10) && <Searchbar />}

          {list.map((section, sectionIndex) => {
            let items = section.items;

            return (
              <li key={`dropdown-${name}-${section.id}`}>
                <ul>
                  {sections.find((sec) => sec.id == section.id)!.items.length >
                    10 && (
                    <div className="space-y-1 p-2 bg-neutral-100 sticky top-0">
                      <Searchbar
                        ref={(el) => registerRef(el, sectionIndex)}
                        className="rounded-sm w-max [&>button,&>div]:m-0 [&>input]:p-2 [&>input]:pl-3"
                        submitMethod="OnChange"
                        submitKey=""
                        onSubmit={(searchValue) =>
                          searchSection(searchValue, section)
                        }
                      />
                      {section.type === "multiple" &&
                        (() => {
                          const selectedSection = selected.find(
                            (sec) => sec.id === section.id
                          );
                          const hasSelected = selectedSection?.items.some(
                            (item) => item.selected
                          );

                          return (
                            <button
                              className={classNames(
                                "px-2 text-sm text-[blue] underline",
                                {
                                  "opacity-50 cursor-not-allowed": !hasSelected,
                                }
                              )}
                              onClick={() =>
                                hasSelected && handleClearSection(section)
                              }
                              disabled={!hasSelected}
                            >
                              Clear All
                            </button>
                          );
                        })()}
                    </div>
                  )}

                  {items.map((item) => {
                    const isChecked =
                      selected
                        .find((sec) => sec.id == section.id)
                        ?.items.find((i) => i.id == item.id)?.selected ?? false;

                    return (
                      <li key={`dropdown-${name}-${section.id}-${item.id}`}>
                        <label className="flex justify-between gap-4 w-full px-4 py-3 hover:bg-neutral-200 bg-neutral-100 text-base text-nowrap cursor-pointer">
                          <input
                            type={
                              section.type == "multiple" ? "checkbox" : "radio"
                            }
                            name={`dropdown-${name}-${section.id}`}
                            value={item.id}
                            className="peer hidden"
                            checked={isChecked}
                            onChange={() => handleSelect(section, item)}
                          />
                          {item.label}

                          {section.type == "multiple" ? (
                            <CheckmarkIcon className="opacity-0 peer-checked:opacity-100 fill-neutral-800 w-5" />
                          ) : (
                            <>
                              <RadioCheckedIcon className="hidden peer-checked:block fill-neutral-800 w-5" />
                              <RadioUnCheckedIcon className="block peer-checked:hidden fill-neutral-800 w-5" />
                            </>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
                {sectionIndex < list.length - 1 && (
                  <hr className="my-1 mx-4 border-neutral-300" />
                )}
              </li>
            );
          })}
        </ul>
      </RemoveScroll>
    </div>
  );
}
