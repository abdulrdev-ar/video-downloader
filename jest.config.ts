import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFiles: ["reflect-metadata"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          moduleResolution: "bundler",
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          paths: { "@/*": ["./src/*"] },
        },
      },
    ],
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

export default config;
