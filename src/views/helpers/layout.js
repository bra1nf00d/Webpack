/* eslint-disable global-require */
module.exports = (htmlWebpackPlugin, options) => {
  const innerHTML = options.fn(this);

  return require('./layout.hbs')({
    innerHTML,
  });
};
