import { Builder } from "@builder.io/react";
import Ribbon from "./Ribbon";

Builder.registerComponent(Ribbon, {
  name: "Ribbon",
  inputs: [
    {
      name: "primaryInfo",
      type: "string",
    },
    {
      name: "secondaryInfo",
      type: "string",
    },
    {
      name: "linkText",
      type: "string",
    },
    {
      name: "destination",
      type: "string",
    },
    {
      name: "isExternalLink",
      type: "boolean",
    },
  ],
});
