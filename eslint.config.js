import jsdoc from "eslint-plugin-jsdoc";

export default [
  {
    files: ["**/*.js"],
    ignores: ["**/template.js", "**/tests/**"],
    rules: {
      "max-lines-per-function": ["warn", { max: 14, skipBlankLines: true, skipComments: true }],
      "max-lines": ["warn", { max: 650 }],
      "semi": ["error", "always"],
      "no-console": ["warn"],
      "prefer-const": ["warn"],
      "jsdoc/require-jsdoc": [
        "warn",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
    },
    plugins: {
      jsdoc: jsdoc,
    },
  },
];