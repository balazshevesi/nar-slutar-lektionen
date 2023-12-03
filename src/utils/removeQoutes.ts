export default function removeQuotes(str: string) {
  return str.replace(/^"(.+(?="$))"$/, "$1");
}
