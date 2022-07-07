const { mountRoutes } = require("remix-mount-routes");

const basePath = process.env.REMIX_BASEPATH ?? "";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  publicPath: `${basePath}/build/`,
  assetsBuildDirectory: `public${basePath}/build`,
  routes: (defineRoutes) => {
    const baseRoutes = mountRoutes(basePath, "routes");

    const routes = {
      ...baseRoutes,
    };
    console.log(routes);
    return routes;
  },
};
