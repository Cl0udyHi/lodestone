import { Server } from "./types";
import hypixelBanner from "@/public/assets/images/hypixel/hypixelBanner.png";
import hypixeIcon from "@/public/assets/images/hypixel/hypixelIcon.png";
import cubeBanner from "@/public/assets/images/cubecraft/cubeBanner.png";
import cubeIcon from "@/public/assets/images/cubecraft/cubeIcon.png";

export const Servers: Server[] = [
  // DEMO data
  {
    name: "Hypixel",
    description:
      "Hypixel is one of the world's largest Minecraft: Java Edition server networks, famous for its custom minigames like Bedwars, Skywars, and SkyBlock.",
    ip: "mc.hypixel.net",
    port: 25565,
    tags: ["minigames", "skyblock", "pvp", "adventure"],
    iconUrl: hypixeIcon.src,
    bannerUrl: hypixelBanner.src,
    bannerBlurUrl: hypixelBanner.blurDataURL,
  },
  {
    name: "CubeCraft",
    description:
      "CubeCraft is a popular Minecraft server network that offers a variety of multiplayer minigames and game modes. It's one of the largest Minecraft server communities, featuring games like SkyWars, EggWars, BlockWars, and various PvP (player versus player) modes.",
    ip: "play.cubecraft.net",
    port: 25565,
    tags: ["minigames", "pvp"],
    iconUrl: cubeIcon.src,
    bannerUrl: cubeBanner.src,
    bannerBlurUrl: cubeBanner.blurDataURL,
  },
  {
    name: "Localhost",
    description: "A local Minecraft server for testing and development.",
    ip: "localhost",
    port: 25565,
    tags: ["testing", "development"],
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
];
