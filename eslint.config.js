import jsdoc from "eslint-plugin-jsdoc";

export default [
  {
    files: ["**/*.js"],
    rules: {
      "max-lines-per-function": ["error", { max: 14, skipBlankLines: true, skipComments: true }],
      "max-lines": ["error", { max: 500 }],
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