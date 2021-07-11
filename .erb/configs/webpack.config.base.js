/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from '../../src/package.json';

// Prevent nedb from substituting browser storage when running from the
// Electron renderer thread.
const fixNedbForElectronRenderer = {
  apply(resolver) {
    resolver
      // Plug in after the description file (package.json) has been
      // identified for the import, because we'll depend on it for some of
      // the logic below.
      .getHook('beforeDescribed-relative')
      .tapAsync(
        'FixNedbForElectronRenderer',
        (request, resolveContext, callback) => {
          // Detect that the import is from NeDB via the description file
          // dectect for the import. Calling `callback` with no parameters
          // "bails", which proceeds with the normal resolution process.
          if (!request.descriptionFileData.name === 'nedb') {
            return callback();
          }

          // When a require/import matches the target files from nedb, we
          // can form the paths to the Node-specific versions of the files
          // relative to the location of the description file. We can then
          // short-circuit the Webpack resolution process by calling the
          // callback with the finalized request object -- meaning that
          // the `path` is pointing at the file that should be imported.
          let relativePath;
          if (
            request.path.startsWith(
              resolver.join(request.descriptionFileRoot, 'lib/storage')
            )
          ) {
            relativePath = 'lib/storage.js';
          } else if (
            request.path.startsWith(
              resolver.join(request.descriptionFileRoot, 'lib/customUtils')
            )
          ) {
            relativePath = 'lib/customUtils.js';
          } else {
            // Must be a different file from NeDB, so bail.
            return callback();
          }

          const path = resolver.join(request.descriptionFileRoot, relativePath);
          const newRequest = Object.assign({}, request, { path });
          callback(null, newRequest);
        }
      );
  },
};

export default {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '../../src'), 'node_modules'],
    plugins: [fixNedbForElectronRenderer],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
