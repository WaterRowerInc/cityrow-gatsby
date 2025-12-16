import { Builder } from "@builder.io/react";
import GridCollection from "./GridCollection";

Builder.registerComponent(GridCollection, {
  name: "GridCollection",
  inputs: [
    {
      name: "imageStartSide",
      type: "string",
      defaultValue: "Right",
      enum: ["Right", "Left"],
    },
    {
      name: "imagesAndText",
      type: "list",
      defaultValue: [
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
          title: "Titlte 15",
        },
      ],
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
            },
          ],
        },
        {
          name: "title",
          type: "string",
          defaultValue: "Title 1",
        },
        {
          name: "description",
          type: "string",
          defaultValue: "description 1",
        },
      ],
    },
  ],
});
