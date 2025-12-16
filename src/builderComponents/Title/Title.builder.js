import { Builder } from "@builder.io/react";
import Title from "./Title";

Builder.registerComponent(Title, {
  name: "Title",
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
      name: "color",
      type: "string",
      enum: ["Light", "Dark"],
      defaultValue: "Light",
    },
    {
      name: "imageModel",
      type: "object",
      subFields: [
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
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
      name: "imageSize",
      type: "string",
      enum: ["Small", "Medium", "Large"],
      defaultValue: "Medium",
    },
    {
      name: "cta",
      type: "object",
      subFields: [
        {
          name: "destination link",
          type: "string",
        },
        {
          name: "label",
          type: "string",
        },
      ],
    },
  ],
});
