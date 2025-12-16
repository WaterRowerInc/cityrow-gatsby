import { Builder } from "@builder.io/react";
import ApparelCatalog from "./ApparelCatalog";

Builder.registerComponent(ApparelCatalog, {
  name: "ApparelCatalog",
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "Apparel",
    },
  ],
});
