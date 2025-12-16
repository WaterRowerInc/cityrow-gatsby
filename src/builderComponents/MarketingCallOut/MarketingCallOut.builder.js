import { Builder } from "@builder.io/react";
import MarketingCallOut from "./MarketingCallOut";

Builder.registerComponent(MarketingCallOut, {
  name: "MarketingCallOut",
  inputs: [
    {
      name: "header",
      type: "string",
      defaultValue: "Header 1",
    },
    {
      name: "body",
      type: "string",
      defaultValue: "Body 1",
    },
    {
      name: "cta",
      type: "object",
      subFields: [
        {
          name: "label",
          type: "string",
        },
        {
          name: "destination",
          type: "string",
        },
        {
          name: "variation",
          type: "string",
          enum: ["primary", "secondary", "secondaryWhite", "link", "linkInverse"],
          defaultValue: "primary",
        },
        {
          name: "external",
          type: "boolean",
        },
      ],
    },
  ],
});
