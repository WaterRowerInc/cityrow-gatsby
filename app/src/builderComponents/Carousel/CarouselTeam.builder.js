import { Builder } from "@builder.io/react";
import Carousel from "./Carousel";

Builder.registerComponent(Carousel, {
  name: "CarouselTeam",
  inputs: [
    {
      name: "header",
      type: "string",
      defaultValue: "TEAM",
    },
    {
      name: "theme",
      type: "string",
      enum: ["Gray", "Blue"],
      defaultValue: "Gray",
    },
    {
      name: "itemType",
      type: "string",
      enum: ["team"],
      defaultValue: "team",
    },
    {
      name: "slidesToShow",
      type: "number",
      enum: [1, 2, 3, 4],
      defaultValue: 1,
    },
    {
      name: "slidesToScroll",
      type: "number",
      enum: [1, 2, 3, 4],
      defaultValue: 1,
    },
    {
      name: "items",
      type: "list",
      subFields: [
        {
          name: "name",
          type: "string",
          defaultValue: "Name 1",
        },
        {
          name: "theme",
          type: "string",
          enum: ["Black", "White"],
          defaultValue: "Black",
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
              name: "title",
              type: "string",
              defaultValue: "Title 1",
            },
            {
              name: "position",
              type: "string",
              enum: ["Center", "Left", "Right"],
              defaultValue: "Center",
            },
          ],
        },
        {
          name: "instagram",
          type: "string",
          defaultValue: "Social name",
        },
      ],
    },
  ],
});
