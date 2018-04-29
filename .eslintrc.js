module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'plugin:vue/strongly-recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  // add your custom rules here
  rules: {
    "vue/html-self-closing": ["error", {
      html: {
        void: "any",
        normal: "any",
        component: "always"
      },
      svg: "always",
      math: "always",
    }],
    "vue/max-attributes-per-line": ["error", {
      singleline: 3,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],
  },
};
