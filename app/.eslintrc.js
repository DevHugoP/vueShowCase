module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  ignorePatterns: ["**/*.d.ts"],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      { allowArgumentsExplicitlyTypedAsAny: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '_', ignoreRestSiblings: true },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
    'vue/require-prop-types': 2,
    'vue/attributes-order': 0,
    'vue/component-definition-name-casing': 0,
    'vue/attribute-hyphenation': 0,
    'vue/html-self-closing': 0,
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 4
      },
      'multiline': {
        'max': 1
      }
    }],
    'vue/singleline-html-element-content-newline': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-v-text-v-html-on-component': 0,
    'vue/v-slot-style': 0,
    'vue/order-in-components': 0,
    'vue/no-v-html': 0,
    'vue/no-mutating-props': 1,
  },
}
