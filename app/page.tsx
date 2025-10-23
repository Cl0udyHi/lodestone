import Image from "next/image";
import steve from "@/public/assets/images/steve.png";
import ServersSection from "@/components/search/servers-section";
import QueryProvider from "@/components/providers/query-provider";

export default function Home() {
  return (
    <QueryProvider>
      <div className="w-full min-h-screen">
        <section className="w-full h-[400px] flex gap-16 px-16 justify-center items-end bg-neutral-700">
          <h1 className="text-neutral-100 font-bold text-[3em] uppercase my-auto">
            Find the Minecraft server
            <br />
            you're looking for
          </h1>
          <Image
            className="select-none"
            src={steve}
            alt="Steve looking through a Spyglass"
          />
        </section>

        <ServersSection />
      </div>
    </QueryProvider>
  );
}
