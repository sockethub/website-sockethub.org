// Block helper: renders its body only when the resolved release channel
// matches the given name. Use like:
//
//   {{#ifChannel "alpha"}} shown only during alpha {{/ifChannel}}
//
// The channel name comes from site.release.channel, populated by build.js
// from release.json (or the SOCKETHUB_CHANNEL env var).
module.exports = function (name, options) {
  const channel = this && this.site && this.site.release
    ? this.site.release.channel
    : null;
  if (channel === name) {
    return options.fn(this);
  }
  return options.inverse ? options.inverse(this) : "";
};
