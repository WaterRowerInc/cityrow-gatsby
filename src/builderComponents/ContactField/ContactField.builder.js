import { Builder } from "@builder.io/react";
import ContactField from "./ContactField";

Builder.registerComponent(ContactField, {
  name: "ContactField",
  inputs: [
    {
      name: "campaignName",
      type: "string",
      required: true,
    },
    {
      name: "header",
      type: "string",
      defaultValue: "Header",
    },
    {
      name: "body",
      type: "string",
      defaultValue: "Body",
    },
    {
      name: "input",
      type: "object",
      required: true,
      subFields: [
        {
          name: "title",
          type: "string",
        },
        {
          name: "type",
          type: "string",
          enum: ["email", "text"],
          defaultValue: "text",
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
          defaultValue: "SEND",
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
