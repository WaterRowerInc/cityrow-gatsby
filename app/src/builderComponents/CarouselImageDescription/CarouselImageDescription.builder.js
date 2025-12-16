import { Builder } from "@builder.io/react";
import CarouselImageDescription from "./CarouselImageDescription";

Builder.registerComponent(CarouselImageDescription, {
  name: "CarouselImageDescription",
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "Member Stories",
    },
    {
      name: "description",
      type: "longText",
      required: false,
    },
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
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: false,
          defaultValue:
            "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
        },
        {
          name: "name",
          type: "string",
          defaultValue: "",
        },
        {
          name: "location",
          type: "string",
          defaultValue: "",
        },
        {
          name: "description",
          type: "longText",
          defaultValue: "",
        },
      ],
    },
  ],
});
