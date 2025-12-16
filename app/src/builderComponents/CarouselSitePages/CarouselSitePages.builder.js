import { Builder } from "@builder.io/react";
import CarouselSitePages from "./CarouselSitePages";

Builder.registerComponent(CarouselSitePages, {
  name: "CarouselSitePages",
  inputs: [
    {
      name: "header",
      type: "string",
      defaultValue: "Header 1",
    },
    {
      name: "slidesToShow",
      type: "number",
      enum: [1, 2, 3, 4],
      defaultValue: 3,
    },
    {
      name: "slidesToScroll",
      type: "number",
      enum: [1, 2, 3, 4],
      defaultValue: 1,
    },
    {
      name: "ctas",
      type: "list",
      subFields: [
        {
          name: "label",
          type: "string",
          defaultValue: "label",
        },
        {
          name: "external",
          type: "boolean",
          defaultValue: false,
        },
        {
          name: "destination",
          type: "string",
          defaultValue: "/",
        },
        {
          name: "variation",
          type: "string",
          enum: ["primary", "secondary", "secondaryWhite", "link", "linkInverse"],
          defaultValue: "primary",
        },
      ],
    },
    {
      name: "slides",
      type: "list",
      subFields: [
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
              defaultValue: "TITLE 1",
            },
          ],
        },
        {
          name: "title",
          type: "string",
          required: true,
        },
        {
          name: "body",
          type: "string",
          required: true,
        },
        {
          name: "destination",
          type: "string",
          defaultValue: "/",
        },
        {
          name: "external",
          type: "boolean",
          defaultValue: false,
        },
      ],
    },
  ],
});
