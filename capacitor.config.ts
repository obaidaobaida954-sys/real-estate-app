import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sy.aqari.app',
  appName: 'عقاري',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      showSpinnerOnFullScreen: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
      overlaysWebView: true,
    },
  },
};

export default config;
