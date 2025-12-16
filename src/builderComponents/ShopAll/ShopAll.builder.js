import { Builder } from "@builder.io/react";
import ShopAll from "./ShopAll";

Builder.registerComponent(ShopAll, {
  name: "ShopAll",
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "Shop All Block",
    },
    {
      name: "description",
      type: "longText",
      defaultValue: "",
    },
    {
      name: "items",
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
              required: false,
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
          name: "name",
          type: "string",
          defaultValue: "Item",
        },
        {
          name: "slug",
          type: "string",
          description: "Put the product slug to get the price in Swell",
          defaultValue: "",
        },
        {
          name: "priceClarification",
          type: "string",
          defaultValue: "",
        },
        {
          name: "priceDetail",
          type: "string",
          defaultValue: "",
        },
        {
          name: "description",
          type: "longText",
          defaultValue: "",
        },
        {
          name: "includes",
          type: "list",
          subFields: [
            {
              name: "itemIncluded",
              type: "string",
              defaultValue: "",
            },
          ],
        },
        {
          name: "link",
          type: "string",
          defaultValue: "",
        },
      ],
    },
  ],
});
