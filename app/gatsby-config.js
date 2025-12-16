/*eslint-disable @typescript-eslint/no-var-requires*/
require("dotenv").config({ path: ".env" });
const path = require("path");

module.exports = {
  siteMetadata: {
    title: "GoCityrow",
    description:
      "CITYROW GO is a rowing-based fitness app for your smartphone/tablet. All you need is a rowing machine or WaterRower! We offer rowing classes for all fitness",
  },
  plugins: [
    `gatsby-plugin-less`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-resolve-src`,
    {
      resolve: "gatsby-plugin-rollbar",
      options: {
        accessToken: "3861ced931d244209e6f3fcee58f5d2e",
        captureUncaught: true,
        captureUnhandledRejections: true,
        payload: {
          environment: "production",
        },
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassOptions: {
          quietDeps: true, // Suppresses deprecation warnings from dependencies
          silenceDeprecations: [
            'mixed-decls',
            'import',
            'color-functions',
            'global-builtin',
            'slash-div',
          ], // Suppresses specific types of deprecation warnings
        },
      },
    },
    {
      resolve: "@builder.io/gatsby",
      options: {
        publicAPIKey: process.env.GATSBY_BUILDER_API_KEY,
        templates: {
          landingPage: path.resolve("src/pages/CommonPage.tsx"),
        },
      },
    },
    `gatsby-plugin-meta-redirect`,
  ],
};
