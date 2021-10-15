module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["warn", "double"],
    "quote-props": ["error", "as-needed"],
    "object-curly-spacing": ["error", "always"],
    "import/no-unresolved": 0,
    "linebreak-style": ["off", "windows"],
    indent: ["warn", 2],
    camelcase: [0, { properties: "never", ignoreDestructuring: true }],
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "require-jsdoc": [
      2,
      {
        require: {
          FunctionDeclaration: false,
          MethodDefinition: false,
          ClassDeclaration: false,
          ArrowFunctionExpression: false,
          FunctionExpression: true,
        },
      },
    ],
  },
};
