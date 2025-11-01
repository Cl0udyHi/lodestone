import Image from "next/image";
import steve from "@/public/assets/images/steve.png";
import ServersSection from "@/components/search/servers-section";
import QueryProvider from "@/components/providers/query-provider";
import classNames from "classnames";

export default function Home() {
  return (
    <QueryProvider>
      <div className="w-full min-h-screen">
        <section
          className={classNames(
            "relative w-full min-h-[400px] flex flex-col px-8 md:px-16 pt-16 justify-end items-center bg-neutral-700",
            "md:flex-row md:justify-center md:items-end md:h-[400px] md:gap-16 md:pt-0"
          )}
        >
          <h1
            className={classNames(
              "text-neutral-100 font-bold text-[3em] uppercase my-auto z-10 text-center",
              "xl:text-left"
            )}
          >
            Find the Minecraft server
            <br />
            you're looking for
          </h1>
          <Image
            className={classNames(
              "shrink-0 select-none right-0 bottom-0 mr-0 z-0",
              "xl:static md:absolute md:mr-16"
            )}
            src={steve}
            alt="Steve looking through a Spyglass"
          />
        </section>

        <ServersSection />
      </div>
    </QueryProvider>
  );
}
