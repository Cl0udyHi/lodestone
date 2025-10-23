"use client";

import { Server } from "@/utils/types";
import Image from "next/image";
import defaultBanner from "@/public/assets/images/default-server-banner.png";
import classNames from "classnames";
import { toast } from "sonner";

import CheckmarkIcon from "@/public/assets/icons/checkmark.svg";
import Link from "next/link";

export default function ServerCard({ server }: { server: Server }) {
  function copyToClipboard(server: Server) {
    navigator.clipboard.writeText(server.ip).then(() => {
      toast("Copied to clipboard", {
        style: {
          backgroundColor: "var(--neutral-100)",
          color: "var(--neutral-800)",
        },
        dismissible: false,
        icon: <CheckmarkIcon className="fill-neutral-800" />,
        description: server.ip,
        descriptionClassName: "text-sm text-neutral-600",
        classNames: { title: "text-sm text-neutral-800" },
      });
    });
  }

  return (
    <div className="group relative flex flex-col rounded-lg overflow-hidden">
      <div className="flex gap-2 p-4 z-10">
        <Link
          href={"/servers/" + server.id}
          className="hover:underline font-bold text-xl text-neutral-100 line-clamp-1"
        >
          <Image
            src={server.iconUrl ?? defaultBanner}
            width={64}
            height={64}
            alt="Server Icon"
            className="object-contain object-center h-[50px] w-[50px] rounded-sm select-none"
          />
        </Link>
        <div className="flex flex-col">
          <Link
            href={"/servers/" + server.id}
            className="hover:underline font-bold text-xl text-neutral-100 line-clamp-1"
          >
            {server.name}
          </Link>
          <button
            type="button"
            onClick={() => copyToClipboard(server)}
            className="flex w-fit text-sm text-neutral-100 line-clamp-1"
          >
            {server.ip}
          </button>
        </div>
        <p className="ml-auto text-sm text-neutral-200">
          {[
            server.supportedVersions[0],
            server.supportedVersions[server.supportedVersions.length - 1],
          ].join(" - ")}
        </p>
      </div>
      <div className="flex flex-col gap-4 p-4 pt-0 z-10 h-full">
        <p className="text-base text-neutral-100 line-clamp-2 h-12">
          {server.description}
        </p>
        <ul className="flex gap-1 mt-auto overflow-x-scroll scrollbar-hide whitespace-nowrap">
          {server.tags?.map((tag, index) => (
            <li key={index}>
              <button
                // onClick={() => handleTagClick(tag)}
                className="bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full font-medium text-base text-neutral-700 px-4 py-1"
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Banner Image */}
      <div
        className={classNames(
          "absolute w-full h-full bg-neutral-300",
          "bg-[length:100%] group-hover:bg-[length:150%] transition-[background-size] duration-150"
        )}
        style={{
          backgroundImage: server.bannerUrl
            ? `url('${server.bannerUrl}')`
            : `url('${defaultBanner.src}')`,
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      >
        <div className="w-full h-full backdrop-blur-[5px]"></div>
      </div>
    </div>
  );
}
