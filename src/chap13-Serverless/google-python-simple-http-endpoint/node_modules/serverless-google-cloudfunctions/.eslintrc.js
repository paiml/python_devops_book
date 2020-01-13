module.exports = {
  "extends": "airbnb-base",
  "plugins": ["import"],
  "rules": {
    "func-names": "off",

    // support for node v4
    "strict": "off",
    "prefer-rest-params": "off",
    "react/require-extension" : "off",
    "import/no-extraneous-dependencies" : "off"
  },
  "env": {
    "jest": true
  }
};
