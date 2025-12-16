import { Builder } from "@builder.io/react";
import ProductComparison from "./ProductComparison";

Builder.registerComponent(ProductComparison, {
  name: "ProductComparison",
  inputs: [
    {
      name: "header",
      type: "string",
      defaultValue: "",
    },
    {
      name: "theme",
      type: "string",
      enum: ["light", "dark", "blue"],
      defaultValue: "blue",
    },
    {
      name: "leftProduct",
      type: "object",
      subFields: [
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: true,
        },
        {
          name: "title",
          type: "string",
          defaultValue: "",
        },
        {
          name: "subTitle",
          type: "string",
          defaultValue: "",
        },
        {
          name: "slug",
          type: "string",
        },
        {
          name: "cta",
          type: "object",
          subFields: [
            {
              name: "label",
              type: "string",
              defaultValue: "label",
            },
            {
              name: "external",
              type: "boolean",
              defaultValue: false,
            },
            {
              name: "destination",
              type: "string",
              defaultValue: "/",
            },
            {
              name: "variation",
              type: "string",
              enum: ["primary", "secondary", "secondaryWhite", "link", "linkInverse"],
              defaultValue: "secondaryWhite",
            },
          ],
        },
        {
          name: "uniqueFeatures",
          type: "list",
          defaultValue: [],
          subFields: [
            {
              name: "feature",
              type: "string",
              defaultValue: "",
            },
          ],
        },
        {
          name: "ctas",
          type: "list",
          subFields: [
            {
              name: "label",
              type: "string",
              defaultValue: "label",
            },
            {
              name: "external",
              type: "boolean",
              defaultValue: false,
            },
            {
              name: "destination",
              type: "string",
              defaultValue: "/",
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
    },
    {
      name: "rightProduct",
      type: "object",
      subFields: [
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: true,
        },
        {
          name: "title",
          type: "string",
          defaultValue: "",
        },
        {
          name: "subTitle",
          type: "string",
          defaultValue: "",
        },
        {
          name: "slug",
          type: "string",
        },
        {
          name: "cta",
          type: "object",
          subFields: [
            {
              name: "label",
              type: "string",
              defaultValue: "label",
            },
            {
              name: "external",
              type: "boolean",
              defaultValue: false,
            },
            {
              name: "destination",
              type: "string",
              defaultValue: "/",
            },
            {
              name: "variation",
              type: "string",
              enum: ["primary", "secondary", "secondaryWhite", "link", "linkInverse"],
              defaultValue: "secondaryWhite",
            },
          ],
        },
        {
          name: "uniqueFeatures",
          type: "list",
          defaultValue: [],
          subFields: [
            {
              name: "feature",
              type: "string",
              defaultValue: "",
            },
          ],
        },
        {
          name: "ctas",
          type: "list",
          subFields: [
            {
              name: "label",
              type: "string",
              defaultValue: "label",
            },
            {
              name: "external",
              type: "boolean",
              defaultValue: false,
            },
            {
              name: "destination",
              type: "string",
              defaultValue: "/",
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
    },
  ],
});
