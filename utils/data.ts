import { Server } from "./types";
import hypixelBanner from "@/public/assets/images/hypixel/hypixelBanner.png";
import hypixeIcon from "@/public/assets/images/hypixel/hypixelIcon.png";

import cubeBanner from "@/public/assets/images/cubecraft/cubeBanner.png";
import cubeIcon from "@/public/assets/images/cubecraft/cubeIcon.png";

import PVPLBanner from "@/public/assets/images/pvplegacy/banner.png";
import PVPLIcon from "@/public/assets/images/pvplegacy/logo.png";

export const Servers: Server[] = [
  // DEMO data
  {
    id: "0",
    name: "Hypixel",
    description:
      "Hypixel is one of the world's largest Minecraft: Java Edition server networks, famous for its custom minigames like Bedwars, Skywars, and SkyBlock.",
    ip: "mc.hypixel.net",
    port: 25565,
    tags: ["minigames", "skyblock", "pvp", "adventure"],
    iconUrl: hypixeIcon.src,
    bannerUrl: hypixelBanner.src,
    supportedVersions: ["1.8.9", "1.21.10"],
    platforms: ["Java Edition"],
  },
  {
    id: "1",
    name: "CubeCraft",
    description:
      "CubeCraft is a popular Minecraft server network that offers a variety of multiplayer minigames and game modes. It's one of the largest Minecraft server communities, featuring games like SkyWars, EggWars, BlockWars, and various PvP (player versus player) modes.",
    ip: "play.cubecraft.net",
    port: 25565,
    tags: ["minigames", "pvp"],
    iconUrl: cubeIcon.src,
    bannerUrl: cubeBanner.src,
    supportedVersions: ["1.16.5", "1.21.10"],
    platforms: ["Java Edition", "Bedrock Edition"],
  },
  {
    id: "2",
    name: "PVP Legacy",
    description:
      "PVP Legacy is a competitive Minecraft server focused on pure PvP gameplay, featuring practice arenas, duels, and ranked matchmaking. Known for its high-quality combat experience and active community.",
    ip: "play.pvplegacy.net",
    port: 25565,
    tags: ["pvp", "kitpvp", "minigames", "community"],
    iconUrl: PVPLIcon.src,
    bannerUrl: PVPLBanner.src,
    supportedVersions: ["1.21.8"],
    platforms: ["Java Edition"],
  },
  {
    id: "3",
    name: "Localhost",
    description: "A local Minecraft server for testing and development.",
    ip: "localhost",
    port: 25565,
    tags: ["testing", "development"],
    supportedVersions: ["1.21.10"],
    platforms: ["Java Edition"],
  },
];

export const Tags: string[] = [
  // DEMO data
  "pvp",
  "skyblock",
  "minigames",
  "survival",
  "creative",
  "factions",
  "roleplay",
  "economy",
  "parkour",
  "adventure",
  "vanilla",
  "hardcore",
  "modded",
  "events",
  "building",
  "quests",
  "community",
  "redstone",
  "prison",
  "kitpvp",
  "towny",
  "Requires Resourcepack",
];
