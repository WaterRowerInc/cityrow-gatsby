import { Builder } from "@builder.io/react";
import CarouselFullImage from "./CarouselFullImage";

Builder.registerComponent(CarouselFullImage, {
  name: "CarouselFullImage",
  inputs: [
    {
      name: "firstCta",
      type: "object",
      subFields: [
        {
          name: "destination",
          type: "string",
        },
        {
          name: "label",
          type: "string",
        },
        {
          name: "external",
          type: "boolean",
          defaultValue: false,
        },
      ],
    },
    {
      name: "secondCta",
      type: "object",
      subFields: [
        {
          name: "destination",
          type: "string",
        },
        {
          name: "label",
          type: "string",
        },
        {
          name: "external",
          type: "boolean",
          defaultValue: false,
        },
      ],
    },
    {
      name: "items",
      type: "list",
      subFields: [
        {
          name: "header",
          type: "string",
        },
        {
          name: "title",
          type: "string",
        },
        {
          name: "body",
          type: "string",
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
              defaultValue: "Title 1",
            },
          ],
        },
      ],
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: true,
    },
  ],
});
