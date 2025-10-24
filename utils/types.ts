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
  playerCount: number;
  rating: number;
};

export type ServerSearchQuery = {
  text: string;
  platforms: string[];
  versions: string[];
  tags: string[];
  sort: { [k: string]: SearchSort };
};

export type SearchSort = "most" | "least";

export type DDItem = { id: string; label: string; selected?: boolean };

export const makeSection = (
  id: string,
  type: "multiple" | "select",
  items: DDItem[]
): DDSection => new DDSection(id, type, items);

export class DDSection {
  id: string;
  type: "multiple" | "select";
  items: DDItem[];

  constructor(id: string, type: "multiple" | "select", items: DDItem[]) {
    this.id = id;
    this.type = type;
    this.items = items;
  }

  getSelectedLabels(): string[] {
    return this.items.filter((i) => i.selected).map((i) => i.label);
  }

  getSelectedItems(): DDItem[] {
    return this.items.filter((i) => i.selected);
  }

  getSelectedIds(): string[] {
    return this.items.filter((i) => i.selected).map((i) => i.id);
  }

  getString(): string {
    return this.getSelectedLabels().join(", ");
  }
}
