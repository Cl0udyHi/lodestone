"use client";

import { Server } from "@/utils/types";
import { TagsContext } from "./servers-section";
import { useContext } from "react";
import Image from "next/image";
import { AddTag } from "../../utils/search";
import defaultBanner from "@/public/assets/images/default-server-banner.png";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";

export default function ServerCard({ server }: { server: Server }) {
  const [tags, setTags] = useContext(TagsContext)!;

  function handleTagClick(e: React.MouseEvent, tag: string) {
    const successful: boolean = AddTag(tag, tags, setTags);
    if (successful) return;

    // Shake if there is already a tag
    // e.currentTarget.animate(
    //   [
    //     { transform: "translateX(-0.25em)" },
    //     { transform: "translateX(0.25em)" },
    //     { transform: "translateX(-0.25em)" },
    //     { transform: "translateX(0.25em)" },
    //   ],
    //   { duration: 250, easing: "ease-in-out" }
    // );
  }

  return (
    <div className="group relative flex flex-col rounded-lg overflow-hidden">
      <div className="flex gap-2 p-4 z-10">
        <Image
          src={server.iconUrl ?? defaultBanner}
          width={64}
          height={64}
          alt="Server Icon"
          className="object-contain object-center h-[50px] w-[50px] rounded-sm select-none"
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-neutral-100 line-clamp-1">
            {server.name}
          </span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(server.ip)}
            className="flex w-fit text-sm text-neutral-100 line-clamp-1"
          >
            {server.ip}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 pt-0 z-10 h-full">
        <p className="text-base text-neutral-100 line-clamp-2 h-12">
          {server.description}
        </p>
        <AnimatePresence>
          <ul className="flex gap-1 mt-auto overflow-x-scroll scrollbar-hide overflow-y-hidden whitespace-nowrap">
            {server.tags?.map((tag, index) => (
              <li key={index}>
                <motion.button
                  onClick={(e) => handleTagClick(e, tag)}
                  className="bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full font-medium text-base text-neutral-700 px-4 py-1"
                >
                  {tag}
                </motion.button>
              </li>
            ))}
          </ul>
        </AnimatePresence>
      </div>

      {/* Banner Image */}
      <div
        className={classNames("bg-neutral-300 absolute w-full h-full")}
        style={{
          backgroundImage: server.bannerUrl
            ? `url('${server.bannerUrl}')`
            : `url('${defaultBanner.src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      >
        <div className="w-full h-full backdrop-blur-[5px]"></div>
      </div>
    </div>
  );
}
