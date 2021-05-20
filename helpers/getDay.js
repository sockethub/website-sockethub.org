module.exports = function (date) {
  if (date) {
    const dateObj = new Date(date);
    return date.getDate();
  }
};

// function parseDate(files, metalsmith, done) {
//   for (let i = 0, len = files.length; i < len; i += 1) {
//     if (files[i].date) {
//       const date = new Date(files[i].date);
//       files[i].year = date.getFullYear();
//       files[i].month = date.getMonth()+1;
//       files[i].day = date.getDate();
//     }
//   }
//   done();
// }