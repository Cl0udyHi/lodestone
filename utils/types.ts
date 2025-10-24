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
export type DDItem = { id: DDItemId; label: string; selected?: boolean };

export const makeSection = (
  id: number | string,
  type: "multiple" | "select",
  items: DDItem[]
): DDSection => new DDSection(id, type, items);

export class DDSection {
  id: number | string;
  type: "multiple" | "select";
  items: DDItem[];

  constructor(
    id: number | string,
    type: "multiple" | "select",
    items: DDItem[]
  ) {
    this.id = id;
    this.type = type;
    this.items = items;
  }

  getSelectedLabels(): string[] {
    return this.items.filter((i) => i.selected).map((i) => i.label);
  }

  getSelectedIds(): (string | number)[] {
    return this.items.filter((i) => i.selected).map((i) => i.id);
  }

  getString(): string {
    return this.getSelectedLabels().join(", ");
  }
}
