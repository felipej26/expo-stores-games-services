import {
  withInfoPlist,
  withAndroidManifest,
  AndroidConfig,
  ConfigPlugin,
} from "expo/config-plugins";

export type Parameters = {
  android: {
    projectId: string;
  };
};

const withInitialConfigs: ConfigPlugin<Parameters> = (config, { android }) => {
  config = withInfoPlist(config, (config) => {
    if (!config.ios) {
      config.ios = {};
    }

    config.ios.entitlements = {
      ...config.ios.entitlements,
      "com.apple.developer.game-center": true,
    };

    return config;
  });

  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "com.google.android.gms.games.APP_ID",
      android.projectId
    );

    return config;
  });

  return config;
};

export default withInitialConfigs;
