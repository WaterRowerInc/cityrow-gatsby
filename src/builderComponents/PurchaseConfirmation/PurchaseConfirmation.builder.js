import { Builder } from "@builder.io/react";
import PurchaseConfirmation from "./PurchaseConfirmation";

Builder.registerComponent(PurchaseConfirmation, {
  name: "PurchaseConfirmation",
  inputs: [
    {
      name: "downloadMessage",
      type: "string",
      defaultValue:
        "Before your rower arrives, we encourage you to download the CITYROW GO app from the App Store now to check it out.",
      required: true,
    },
    {
      name: "greetingMessage",
      type: "string",
      defaultValue: ", Thank You For Your Order!",
      required: true,
    },
    {
      name: "subTitle",
      type: "string",
      defaultValue: "Your order has been submitted and we're getting to work on your rower!",
      required: true,
    },
    {
      name: "hideDetails",
      type: "boolean",
      defaultValue: false,
    },
    {
      name: "leftSection",
      type: "object",
      subFields: [
        {
          name: "icon",
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
          required: true,
        },
        {
          name: "body",
          type: "string",
          required: true,
        },
        {
          name: "buttonLabel",
          type: "string",
        },
        {
          name: "destination",
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
      name: "rightSection",
      type: "object",
      subFields: [
        {
          name: "icon",
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
              name: "title",
              type: "string",
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
          name: "buttonLabel",
          type: "string",
        },
        {
          name: "destination",
          type: "string",
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
