import { Servers } from "./data";
import { Server } from "./types";

const filteredServers = (search: string) => {
  let newList: Server[] = Servers;

  //   if (search.length < 1 || tags.length < 1) {
  if (search.length < 1) {
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

  //   if (tags.length > 0) {
  //     newList = newList.filter((server) => {
  //       return tags.every((tag) => server.tags?.includes(tag));
  //     });
  //   }

  return newList;
};

export async function fetchServersData(search: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return filteredServers(search);
}
