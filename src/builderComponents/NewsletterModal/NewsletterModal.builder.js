import { Builder } from "@builder.io/react";
import NewsletterModal from "./NewsletterModal";

Builder.registerComponent(NewsletterModal, {
  name: "NewsletterModal",
  inputs: [
    {
      name: "header",
      type: "string",
      defaultValue: "Title goes here",
    },
    {
      name: "body",
      type: "string",
      defaultValue: "Body copy goes here",
    },
    {
      name: "placeholder",
      type: "string",
      required: true,
      defaultValue: "",
    },
    {
      name: "disclaimer",
      type: "string",
      placeholder: "* Optional disclaimer text",
      required: false,
    },
    {
      name: "delaySeconds",
      type: "enum",
      required: true,
      defaultValue: 0,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      name: "image",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
      required: false,
      defaultValue:
        "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
    },
  ],
});
