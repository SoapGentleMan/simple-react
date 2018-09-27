module.exports = ({file, options, env}) => ({
  parser: false,
  plugins: [
    require('autoprefixer')({
      browsers: ['last 20 version', '> 0.5%'],
    }),
  ],
});