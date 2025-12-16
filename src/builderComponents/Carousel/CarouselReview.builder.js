import { Builder } from "@builder.io/react";
import Carousel from "./Carousel";

Builder.registerComponent(Carousel, {
  name: "CarouselReview",
  inputs: [
    {
      name: "itemType",
      type: "string",
      enum: ["review"],
      defaultValue: "review",
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
      name: "theme",
      type: "string",
      enum: ["Black", "White"],
      defaultValue: "Black",
    },
    {
      name: "header",
      type: "string",
      defaultValue: "HEADER 1",
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
          name: "external",
          type: "boolean",
        },
      ],
    },
    {
      name: "items",
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
          name: "ratingImage",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: false,
          defaultValue:
            "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
        },
        {
          name: "imageSize",
          type: "string",
          enum: ["Small", "Medium", "Large"],
          defaultValue: "Small",
        },
        {
          name: "body",
          type: "string",
          defaultValue: "Body 1",
        },
        {
          name: "reviewer",
          type: "string",
          defaultValue: "reviewer commnet",
        },
        {
          name: "source",
          type: "string",
          defaultValue: "Google Play Store Review",
        },
      ],
    },
  ],
});
