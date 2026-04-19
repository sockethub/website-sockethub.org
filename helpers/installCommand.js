// Returns the npm install command for the current release channel, e.g.
//   "npm install -g sockethub@alpha"  (alpha)
//   "npm install -g sockethub"        (stable)
module.exports = function () {
  const release = this && this.site && this.site.release;
  const tag = release && release.installTag ? release.installTag : "";
  return "npm install -g sockethub" + tag;
};
