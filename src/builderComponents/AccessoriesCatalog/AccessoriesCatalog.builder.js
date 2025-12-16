import { Builder } from "@builder.io/react";
import AccessoriesCatalog from "./AccessoriesCatalog";

Builder.registerComponent(AccessoriesCatalog, {
  name: "AccessoriesCatalog",
  inputs: [
    {
      name: "kitsTitle",
      type: "string",
      defaultValue: "Kits",
    },
    {
      name: "accessoriesTitle",
      type: "string",
      defaultValue: "Accessories",
    },
  ],
});
