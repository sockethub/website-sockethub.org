/**
 * Format a Date (or date-like string) as "YYYY-MM-DD" for the `datetime`
 * attribute of <time> elements. Uses UTC to avoid off-by-one errors from
 * local-zone conversions around midnight.
 *
 * Usage: <time datetime="{{isoDate this.date}}">
 */
module.exports = function isoDate(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
