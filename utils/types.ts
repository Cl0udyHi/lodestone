export type Platform = "Java Edition" | "Bedrock Edition";

export type Server = {
  name: string;
  id: string;
  description: string;
  ip: string;
  port: number;
  tags?: string[];
  iconUrl?: string;
  bannerUrl?: string;
  supportedVersions: string[];
  platforms: string[];
};

export type ServerSearchQuery = {
  text: string;
  platforms: string[];
  versions: string[];
  tags: string[];
};

export type DDItemId = string | number;
export type DDItem = { id: DDItemId; label: string };
