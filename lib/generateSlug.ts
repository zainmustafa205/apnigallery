export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // special characters remove
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/-+/g, "-") // multiple hyphens → single
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphen
}
