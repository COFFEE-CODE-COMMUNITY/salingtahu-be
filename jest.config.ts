export default {
  displayName: "backend",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "html"],
  transformIgnorePatterns: [
    "node_modules/(?!(@faker-js|@so-ric|@dabh|color.*|simple-swizzle)/)",
  ],
}
