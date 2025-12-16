import { Builder } from "@builder.io/react";
import ImageWithDetails from "./ImageWithDetails";

Builder.registerComponent(ImageWithDetails, {
  name: "ImageWithDetails",
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
      name: "slug",
      type: "string",
    },
    {
      name: "bulletsPoints",
      type: "list",
      subFields: [
        {
          name: "text",
          type: "string",
          defaultValue: "BODY 1",
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
          defaultValue: "TITLE",
        },
        {
          name: "destination",
          type: "string",
          defaultValue: "TITLE",
        },
        {
          name: "variation",
          type: "string",
          enum: ["primary", "secondary", "secondaryWhite", "link"],
          defaultValue: "primary",
        },
      ],
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: false,
    },
    {
      name: "imageModel",
      type: "object",
      subFields: [
        {
          name: "areaFocus",
          type: "string",
          enum: ["Left", "Center", "Right"],
          required: false,
        },
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: true,
          defaultValue:
            "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
        },
        {
          name: "title",
          type: "string",
          defaultValue: "Title 1",
        },
      ],
    },
    {
      name: "side",
      type: "string",
      enum: ["Left", "Right"],
      defaultValue: "Left",
    },
  ],
});
