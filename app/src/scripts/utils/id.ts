export function stringToId(s: string) {
  return s.replace(/\W/g, " ").trim().replace(/ +/g, "-").toLowerCase();
}
