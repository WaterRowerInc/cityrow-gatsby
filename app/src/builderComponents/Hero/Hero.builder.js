import { Builder } from "@builder.io/react";
import Hero from "./Hero";

Builder.registerComponent(Hero, {
  name: "Hero",
  inputs: [
    {
      name: "slides",
      type: "list",
      subFields: [
        { name: "alignment", type: "string", required: true, enum: ["Left", "Right"], defaultValue: "left" },
        { name: "title", type: "string", required: false },
        { name: "subtitle", type: "string", required: false },
        { name: "body", type: "string", required: false },
        {
          name: "cta",
          type: "list",
          required: false,
          subFields: [
            { name: "label", type: "string" },
            {
              name: "image",
              type: "file",
              required: false,
              allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
            },
            { name: "destination", type: "string" },
            { name: "isExternal", type: "boolean", defaultValue: false },
          ],
        },
        {
          name: "media",
          type: "object",
          required: false,
          subFields: [
            {
              name: "image",
              type: "file",
              required: false,
              allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
              defaultValue:
                "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
            },
            {
              name: "position",
              type: "string",
              required: false,
              enum: ["Left", "Right", "Center"],
              defaultValue: "Center",
            },
            { name: "youtubeDesktopVideoId", type: "string", required: false },
            { name: "youtubeMobileVideoId", type: "string", required: false },
            { name: "videoUrl", type: "url", required: false },
          ],
        },
      ],
    },
  ],
});
