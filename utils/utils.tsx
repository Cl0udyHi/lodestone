import { Servers, Tags } from "./data";
import { Server } from "./types";

const filteredServers = (search: string, tags: string[]) => {
  let newList: Server[] = Servers;

  if (search.length < 1 || tags.length < 1) {
    newList = Servers;
  }

  if (search.length > 0) {
    const words: string[] = search.trim().toLowerCase().split(/\s+/);

    newList = Servers.filter((server) => {
      return words.every(
        (word) =>
          server.name.toLowerCase().includes(word) ||
          server.ip.toLowerCase().includes(word) ||
          server.description.toLowerCase().includes(word) ||
          server.port.toString() === word
      );
    });
  }

  if (tags.length > 0) {
    newList = newList.filter((server) => {
      return tags.every((tag) => server.tags?.includes(tag));
    });
  }

  return newList;
};

export async function fetchServers(search: string, tags: string[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return filteredServers(search, tags);
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
