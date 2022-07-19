module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    allowAutomaticSingleRunInference: true,
    ecmaVersion: 2022,
    project: ["./tsconfig.eslint.json", "./web/tsconfig.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  env: {
    es6: true,
  },
  plugins: ["@typescript-eslint", "import"],
  extends: ["plugin:import/typescript"],
  rules: {
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "import/no-cycle": "error", // <- change this to "off"
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.eslint.json"],
      },
    },
  },
  overrides: [
    {
      files: ["web/**"],
      env: {
        browser: true,
      },
      settings: {
        "import/resolver": {
          typescript: {
            project: ["./web/tsconfig.json"],
          },
        },
      },
    },
    {
      files: ["**/*.cjs"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};
