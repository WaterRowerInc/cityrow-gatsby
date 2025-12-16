import { Builder } from "@builder.io/react";
import FeatureBanner from "./FeatureBanner";

Builder.registerComponent(FeatureBanner, {
  name: "FeatureBanner",
  inputs: [
    {
      name: "theme",
      type: "string",
      defaultValue: "Light",
      enum: ["Dark", "Medium", "Light"],
    },
    {
      name: "title",
      type: "string",
      defaultValue: "Features",
    },
    {
      name: "description",
      type: "longText",
      defaultValue: "",
    },
    {
      name: "features",
      type: "list",
      subFields: [
        {
          name: "icon",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
        },
        {
          name: "header",
          type: "string",
          required: true,
        },
        {
          name: "body",
          type: "string",
          required: true,
        },
        {
          name: "linkText",
          type: "string",
          required: false,
        },
        {
          name: "linkUrl",
          type: "string",
          required: false,
          defaultValue: "/destination",
        },
      ],
    },
  ],
});
