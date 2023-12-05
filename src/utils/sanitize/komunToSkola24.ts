export function komunToSkola24(namn: string): string {
  // Define a mapping for special characters
  const specialChars: { [key: string]: string } = {
    å: "a",
    ä: "a",
    ö: "o",
    Å: "A",
    Ä: "A",
    Ö: "O",
  };

  // Replace special characters, convert to lowercase, and remove hyphens and whitespaces
  const normalized = namn
    .split("")
    .map((char) => specialChars[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[-\s]/g, "");

  return normalized;
}
