export function isIanaTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function formatTimeZone(timeZone: string) {
  const genericName = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longGeneric",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
  const city = timeZone.split("/").at(-1)?.replaceAll("_", " ");

  if (genericName && city) return `${genericName} (${city})`;
  return city || timeZone;
}
