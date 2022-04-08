const prodPlugin = []
if (process.env.NODE_ENV === 'production') {
  prodPlugin.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant'],
    // 发布时的插件数组
    ...prodPlugin,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
