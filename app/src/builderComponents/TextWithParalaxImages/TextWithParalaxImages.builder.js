import { Builder } from "@builder.io/react";
import TextWithParalaxImages from "./TextWithParalaxImages";

Builder.registerComponent(TextWithParalaxImages, {
  name: "TextWithParalaxImages",
  inputs: [
    {
      name: "subtitle",
      type: "string",
      required: false,
      placeholder: "Subtitle",
    },
    {
      name: "title",
      type: "string",
      required: false,
      placeholder: "Title",
    },
    {
      name: "body",
      type: "longText",
      required: false,
      placeholder: "Content goes here",
    },
    {
      name: "items",
      type: "list",
      subFields: [
        {
          name: "icon",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: true,
        },
        {
          name: "title",
          type: "string",
          required: true,
        },
        {
          name: "body",
          type: "longText",
          required: true,
        },
      ],
    },
    {
      name: "image1",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
      required: true,
    },
    {
      name: "image2",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
      required: true,
    },
    {
      name: "image3",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
      required: false,
    },
    {
      name: "image4",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
      required: false,
    },
  ],
});
