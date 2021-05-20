module.exports = function (record) {
    return !((record.data.root.news_count !== 0) && (record.data.index >= record.data.root.news_count));
};
