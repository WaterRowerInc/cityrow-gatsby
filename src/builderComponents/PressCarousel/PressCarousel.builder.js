import { Builder } from "@builder.io/react";
import PressCarousel from "./PressCarousel";

Builder.registerComponent(PressCarousel, {
  name: "PressCarousel",
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "",
    },
    {
      name: "pressSlides",
      type: "list",
      subFields: [
        {
          name: "comment",
          type: "string",
          defaultValue: "",
        },
        {
          name: "image",
          type: "file",
          allowFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          defaultValue:
            "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
        },
      ],
    },
  ],
});
