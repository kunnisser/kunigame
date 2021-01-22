module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "globals":{
        "Phaser": true,
        "PIXI": true,
        "ENV": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion" : 6,
        "sourceType" : "module",
        "ecmaFeatures" : {
            "jsx" : true,
            "experimentalObjectRestSpread" : true,
            "modules":true
        }
    },
     "extends": "airbnb",
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
        // "semi": ["error", "always"],
        // "quotes": [
        //     "error",
        //     "single"
        // ],
        // "no-console":"off",
        // "no-unused-vars":"off",
        // "no-unreachable":"off",
        // "no-redeclare":"warn"
    }
};