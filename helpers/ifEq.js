// Block helper: renders body when the two args are strictly equal.
//   {{#ifEq current_page "home"}} ... {{/ifEq}}
module.exports = function (a, b, options) {
  if (a === b) return options.fn(this);
  return options.inverse ? options.inverse(this) : "";
};
