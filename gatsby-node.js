// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
require("source-map-support").install();

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  const zonesResults = await graphql(`
    {
      allBuilderModels {
        zoneModel {
          name
          data {
            zone
          }
        }
      }
    }
  `);

  const pagesResults = await graphql(`
    {
      allBuilderModels {
        landingPage(options: { cachebust: true }, limit: 1000) {
          query {
            value
            property
          }
          data {
            url
          }
        }
      }
    }
  `);

  const redirectResults = await graphql(`
    {
      allBuilderModels {
        urlRedirects(options: {}) {
          data {
            sourceUrl
            destinationUrl
            redirectToPermanent
          }
        }
      }
    }
  `);

  redirectResults.data.allBuilderModels.urlRedirects.forEach((redirect) => {
    createRedirect({
      fromPath: redirect.data.sourceUrl,
      toPath: redirect.data.destinationUrl,
      isPermanent: redirect.data.redirectToPermanent,
    });
  });

  createPage({
    path: "/en-us/page",
    component: path.resolve("./src/pages/Page.tsx"),
    context: { urlTarget: "/page", zone: "us" },
  });
  zonesResults.data.allBuilderModels.zoneModel.map((zoneModel) => {
    zoneModel.data.zone.countries.map((country) => {
      createPage({
        path: `/en-${country.countryCode.toLowerCase()}/upSellsPage`,
        component: path.resolve("./src/pages/UpSellsPage.tsx"),
        context: { urlTarget: "/upSellsPage", zone: zoneModel.name.toLowerCase(), ...country },
      });
      createPage({
        path: `/en-${country.countryCode.toLowerCase()}/login`,
        component: path.resolve("./src/pages/LoginPage.tsx"),
        context: { urlTarget: "/login", zone: zoneModel.name.toLowerCase(), ...country },
      });
      createPage({
        path: `/en-${country.countryCode.toLowerCase()}/forgot-password`,
        component: path.resolve("./src/pages/ForgotPasswordPage.tsx"),
        context: { urlTarget: "/forgot-password", zone: zoneModel.name.toLowerCase(), ...country },
      });
      createPage({
        path: `/en-${country.countryCode.toLowerCase()}/set-password`,
        component: path.resolve("./src/pages/SetPasswordPage.tsx"),
        context: { urlTarget: "/set-password", zone: zoneModel.name.toLowerCase(), ...country },
      });
      createPage({
        path: `/en-${country.countryCode.toLowerCase()}/profile`,
        component: path.resolve("./src/pages/ProfilePage.tsx"),
        context: { urlTarget: "/profile", zone: zoneModel.name.toLowerCase(), ...country },
      });
      createPage({
        path: `/en-${country.countryCode.toLowerCase()}/subscription`,
        component: path.resolve("./src/pages/SubscriptionPage.tsx"),
        context: { urlTarget: "/subscription", zone: zoneModel.name.toLowerCase(), ...country },
      });
      createPage({
        path: `/en-${country.countryCode.toLowerCase()}/checkout`,
        component: path.resolve("./src/pages/CheckoutPage.tsx"),
        context: { urlTarget: "/checkout", zone: zoneModel.name.toLowerCase(), ...country },
      });
    });
  });

  pagesResults.data.allBuilderModels.landingPage.forEach((page) => {
    var pageZone = "us";
    zonesResults.data.allBuilderModels.zoneModel
      .find((zoneModel) => zoneModel.name.toLowerCase() === pageZone.toLowerCase())
      .data.zone.countries.forEach((country) => {
        createPage({
          path: `/en-${country.countryCode.toLowerCase()}${page.data.url}`,
          component: path.resolve("./src/pages/CommonPage.tsx"),
          context: { urlTarget: page.data.url, zone: pageZone.toLowerCase(), ...country },
        });
      });
  });
};
