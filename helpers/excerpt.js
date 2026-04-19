/**
 * Strip HTML tags from a body blob and trim to ~180 characters at a word
 * boundary. Used by the news timeline to show a one-line teaser next to
 * each title.
 *
 * Usage:
 *   {{excerpt this.body}}
 *   {{excerpt this.body 220}}   {{!-- custom max length --}}
 */
const ENTITY_MAP = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&([a-z]+);/gi, (m, name) => ENTITY_MAP[name.toLowerCase()] || m);
}

module.exports = function excerpt(body, maxCharsOrOptions) {
  if (!body) return "";
  const maxChars =
    typeof maxCharsOrOptions === "number" ? maxCharsOrOptions : 180;

  const text = decodeEntities(
    String(body).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  );

  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
};
