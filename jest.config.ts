export default {
  displayName: "backend",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  transformIgnorePatterns: [
    "node_modules/(?!(@faker-js)/)",
  ],
}