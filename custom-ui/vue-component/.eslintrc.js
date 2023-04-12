module.exports = {
    // 默认情况下，ESLint会在所有父级组件中寻找配置文件，一直到根目录。ESLint一旦发现配置文件中有   "root": true，它就会停止在父级目录中寻找。
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
      ecmaVersion: 8,
      sourceType: 'module',
      parser: 'babel-eslint',
    },
    env: {
      // 预定义的全局变量，这里是浏览器环境
      browser: true,
      node: true,
      es6: true,
    },
    // 扩展风格
    extends: ['eslint-config-tencent'],
    plugins: [
      'html',
      'vue',
    ],
    // 规则的细节请到ESLint官方网站查看http://eslint.org/docs/rules/
    rules: {
      eqeqeq: 0,
      'no-param-reassign': 0,
      'no-underscore-dangle': 0,
      radix: 0,
      'no-nested-ternary': 0,
      'prefer-destructuring': 0,
      'no-restricted-syntax': 0,
      camelcase: 0,
      'no-mixed-operators': 0,
      'array-callback-return': 0,
      'no-useless-escape': 0,
      'new-cap': 0,
      'linebreak-style': ["off", "windows"]
    },
  };
  