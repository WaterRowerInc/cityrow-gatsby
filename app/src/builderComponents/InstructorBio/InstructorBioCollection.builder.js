import { Builder } from "@builder.io/react";
import InstructorBioCollection from "./InstructorBioCollection";

Builder.registerComponent(InstructorBioCollection, {
  name: "InstructorBioCollection",
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "Meet Your Instructors",
    },
    {
      name: "bios",
      type: "list",
      subFields: [
        {
          name: "name",
          type: "string",
          defaultValue: "",
        },
        {
          name: "username",
          type: "string",
          defaultValue: "@",
        },
        {
          name: "description",
          type: "longText",
          defaultValue: "",
        },
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
          name: "upcomingClasses",
          type: "list",
          subFields: [
            {
              name: "name",
              type: "string",
              defaultValue: "New Class",
            },
            {
              name: "day",
              type: "string",
              enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
              defaultValue: "MONDAY",
            },
            {
              name: "date",
              type: "string",
              defaultValue: "",
            },
            {
              name: "time",
              type: "string",
              defaultValue: "",
            },
            {
              name: "duration",
              type: "string",
              defaultValue: "",
            },
            {
              name: "badgeColor",
              type: "color",
              defaultValue: "#000000",
            },
            {
              name: "badgeText",
              type: "string",
              defaultValue: "BADGE",
            },
          ],
        },
      ],
    },
  ],
});
