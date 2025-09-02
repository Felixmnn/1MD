const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function removeMediaPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // Prüfen, ob überhaupt Permissions existieren
    if (manifest['uses-permission']) {
      manifest['uses-permission'] = manifest['uses-permission'].filter(
        (p) =>
          !['android.permission.READ_MEDIA_IMAGES', 'android.permission.READ_MEDIA_VIDEO'].includes(
            p.$['android:name']
          )
      );
    }

    return config;
  });
};
