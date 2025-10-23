import { Servers, Tags } from "./data";
import { ServerSearchQuery } from "./types";

const filterServers = (query: ServerSearchQuery) => {
  const { text, platforms, tags, versions } = query;

  let list = Servers;

  // Filter with text
  if (text.length >= 1) {
    const words: string[] = text.trim().toLowerCase().split(/\s+/);
    list = list.filter((server) => {
      return words.every(
        (word) =>
          server.name.toLowerCase().includes(word) ||
          server.ip.toLowerCase().includes(word) ||
          server.description.toLowerCase().includes(word) ||
          server.port.toString() === word
      );
    });
  }

  // Filter with platform - server must have EXACTLY these platforms
  if (platforms && platforms.length > 0) {
    list = list.filter((server) => {
      return platforms.every((platform) => server.platforms.includes(platform));
    });
  }

  // Filter with version - server must support at least one selected version
  if (versions && versions.length > 0) {
    list = list.filter((server) => {
      return versions.some((version) =>
        server.supportedVersions.includes(version)
      );
    });
  }

  // Filter with tags - server must have all selected tags (keep as every)
  if (tags && tags.length > 0) {
    list = list.filter((server) => {
      return tags.every((tag) => server.tags?.includes(tag));
    });
  }

  return list;
};

export async function fetchServers(query: ServerSearchQuery) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return filterServers(query);
}

function filterTags(word: string, tags: string[]) {
  return word !== undefined
    ? Tags.filter(
        (tag) => tag.toLowerCase().includes(word) && !tags.includes(tag)
      )
    : [];
}

export async function fetchTags(word: string, tags: string[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return filterTags(word, tags);
}

export function AddTag(
  tag: string,
  tags: string[],
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  setSearch?: React.Dispatch<React.SetStateAction<string>>
): boolean {
  if (!tags.includes(tag)) {
    setTags((prevTags) => [...prevTags, tag]);
    setSearch?.((prev) => {
      const words = prev.trim().split(/\s+/);
      words.pop();

      let result = words.join(" ");
      if (words.length > 0) result += " ";

      return result;
    });

    return true;
  }

  return false;
}
