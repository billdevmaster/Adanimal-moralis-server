module.exports = {
  extends: ['@moralisweb3'],
  ignorePatterns: ['**/build/**/*'],
  env: {
    browser: true,
  },
  "rules": {
    "eqeqeq": "off",
    "no-console": "off",
    "prefer-destructuring": ["error", {"object": false, "array": false}]
  }
};
