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
  platforms: Platform[];
};

export type ServerSearchQuery = {
  text: string;
  platforms: Platform[];
  versions: string[];
  tags: string[];
};
