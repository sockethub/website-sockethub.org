/**
 * Group a collection of posts by year, return groups in descending year order.
 *
 * Input:  [{ date: '2026-03-29', ... }, { date: '2021-05-20', ... }, ...]
 * Output: [
 *   { year: 2026, posts: [...] },
 *   { year: 2021, posts: [...] },
 *   ...
 * ]
 *
 * Usage in Handlebars:
 *   {{#each (groupByYear collections.news)}}
 *     <h2>{{this.year}}</h2>
 *     {{#each this.posts}} ... {{/each}}
 *   {{/each}}
 */
module.exports = function groupByYear(posts) {
  if (!Array.isArray(posts)) return [];
  const groups = new Map();
  for (const post of posts) {
    const year = new Date(post.date).getUTCFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(post);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }));
};
