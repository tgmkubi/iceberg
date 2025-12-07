module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },

    testEnvironment: "node",

    // MongoDB Server Setup for Integration tests using memory server
    globalSetup: "<rootDir>/../test/global-setup.ts",
    globalTeardown: "<rootDir>/../test/global-teardown.ts",
};
