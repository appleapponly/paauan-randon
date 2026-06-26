module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // ปลั๊กอินของ Reanimated v4 ต้องอยู่ "บรรทัดล่างสุด" เสมอ
    plugins: ['react-native-worklets/plugin'],
  };
};
