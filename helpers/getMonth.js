module.exports = function (date) {
  if (date) {
    const dateObj = new Date(date);
    return date.getMonth()+1;
  }
};