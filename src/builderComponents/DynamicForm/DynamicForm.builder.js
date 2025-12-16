import { Builder } from "@builder.io/react";
import DynamicForm from "./DynamicForm";

Builder.registerComponent(DynamicForm, {
  name: "DynamicForm",
  inputs: [
    {
      name: "campaignName",
      type: "string",
      required: true,
    },
    {
      name: "successMessage",
      type: "string",
      required: true,
    },
    {
      name: "background",
      type: "object",
      required: true,
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
      name: "header",
      type: "string",
      defaultValue: "header",
    },
    {
      name: "subHeader",
      type: "string",
      defaultValue: "sub-header",
    },
    {
      name: "body",
      type: "string",
      defaultValue: "body",
    },
    {
      name: "formTitle",
      type: "string",
      defaultValue: "form title",
      required: true,
    },
    {
      name: "fields",
      type: "list",
      subFields: [
        {
          name: "label",
          type: "string",
          defaultValue: "label",
          required: true,
        },
        {
          name: "id",
          type: "string",
          defaultValue: "an id for segment / vero field",
        },
        {
          name: "placeholder",
          type: "string",
          defaultValue: "placeholder",
        },
        {
          name: "type",
          type: "string",
          enum: ["text", "email", "dropdown"],
          defaultValue: "text",
        },
        {
          name: "options",
          type: "list",
          subFields: [
            {
              name: "option",
              type: "string",
              defaultValue: "option",
              required: true,
            },
          ],
        },
        {
          name: "fullWidth",
          type: "boolean",
          defaultValue: false,
        },
      ],
    },
    {
      name: "cta",
      type: "object",
      required: true,
      subFields: [
        {
          name: "label",
          type: "string",
          defaultValue: "label",
        },
        {
          name: "variation",
          type: "string",
          enum: ["primary", "secondary", "secondaryWhite", "link", "linkInverse"],
          defaultValue: "primary",
        },
      ],
    },
  ],
});
