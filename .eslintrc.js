module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    //空行最多不能超过3行
    "no-multiple-empty-lines": [0, {"max": 3}],
    "no-trailing-spaces": 'off',
    //允许禁止混用tab和空格
    "no-mixed-spaces-and-tabs": 'off'
    // 'semi': [2, 'never']
  }
}
