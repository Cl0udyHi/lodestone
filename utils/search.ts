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
