import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    // plugins: null,
    categories: {},
    rules: {},
    settings: {
      "jsx-a11y": {
        // polymorphicPropName: null,
        components: {},
        attributes: {},
      },
      next: {
        rootDir: [],
      },
      react: {
        formComponents: [],
        linkComponents: [],
        // version: null,
        componentWrapperFunctions: [],
      },
      jsdoc: {
        ignorePrivate: false,
        ignoreInternal: false,
        ignoreReplacesDocs: true,
        overrideReplacesDocs: true,
        augmentsExtendsReplacesDocs: false,
        implementsReplacesDocs: false,
        exemptDestructuredRootsFromChecks: false,
        tagNamePreference: {},
      },
      vitest: {
        typecheck: false,
      },
    },
    env: {
      builtin: true,
    },
    globals: {},
    ignorePatterns: [],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    singleQuote: true,
    printWidth: 80,
  },
  // staged: {
  //   "*": "vp check --fix",
  // },
});
