module.exports = {
  out: "build/docs",

  exclude: [
    "**/__tests__/**/*",
    "**/__test_utils__/**/*",
    "**/__fixtures__/**/*",
    "**/*.spec.ts"
  ],

  target: "ES6",
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
  mode: "file"
};
