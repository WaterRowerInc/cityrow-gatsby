import { Builder } from "@builder.io/react";
import Product from "./Product";

Builder.registerComponent(Product, {
  name: "Product",
  inputs: [
    {
      name: "headerImage",
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
          name: "title",
          type: "string",
        },
      ],
    },
    {
      name: "title",
      type: "string",
    },
    {
      name: "slug",
      type: "string",
      required: true,
    },
    {
      name: "originalPrice",
      type: "string",
    },
    {
      name: "salePrice",
      type: "string",
    },
    {
      name: "subscriptionLoggedCta",
      type: "string",
      required: false,
    },
    {
      name: "subscriptionCta",
      type: "string",
      required: false,
    },
    {
      name: "cta",
      type: "object",
      required: false,
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
          enum: ["primary", "secondary", "secondaryWhite", "link"],
        },
      ],
    },
    {
      name: "productDetailAccordion",
      type: "list",
      subFields: [
        {
          name: "header",
          type: "string",
          required: true,
        },
        {
          name: "body",
          type: "richText",
          required: true,
        },
      ],
    },
  ],
});
