import { Builder } from "@builder.io/react";
import GrandImage from "./GrandImage";

Builder.registerComponent(GrandImage, {
  name: "GrandImage",
  inputs: [
    {
      name: "introText",
      type: "string",
      defaultValue: "introText",
    },
    {
      name: "header",
      type: "string",
      defaultValue: "HEADER 1",
    },
    {
      name: "body",
      type: "string",
      defaultValue: "BODY 1",
    },
    {
      name: "containerPosition",
      type: "string",
      enum: ["Left", "Right"],
      defaultValue: "Right",
    },
    {
      name: "imageModel",
      type: "object",
      subFields: [
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: true,
          defaultValue:
            "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
        },
        {
          name: "position",
          type: "string",
          enum: ["Center", "Left", "Right"],
          defaultValue: "Center",
        },
        {
          name: "title",
          type: "string",
        },
      ],
    },
    {
      name: "productBullets",
      type: "list",
      subFields: [
        {
          name: "text",
          type: "string",
        },
      ],
    },
    {
      name: "ctas",
      type: "list",
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
