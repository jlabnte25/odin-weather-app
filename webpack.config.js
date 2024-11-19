const path = require("path");

module.exports = {
  entry: "./src/index.js", // Your entry file
  output: {
    filename: "bundle.js", // The bundled output
    path: path.resolve(__dirname, "dist"),
    clean: true, // Cleans up the dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i, // For image files (png, jpg, jpeg, gif)
        type: "asset/resource", // Webpack will process the images
        generator: {
          filename: "assets/images/[name][ext][query]", // Store images in the assets/images folder
        },
      },
    ],
  },
  devServer: {
    contentBase: "./dist",
    open: true,
    port: 3000,
  },
};
