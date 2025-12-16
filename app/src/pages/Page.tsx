import React from "react";
import { builder, BuilderComponent } from "@builder.io/react";
import { graphql } from "gatsby";

builder.init(process.env.GATSBY_BUILDER_API_KEY!);

// this component is only used in the preview of builder
const Page = (props: { data: any }) => {
  const content = props.data?.allBuilderModels.landingPage?.[0]?.content;

  return <BuilderComponent content={content} model='landing-page' />;
};

export default Page;

export const query = graphql`
  query ($path: String!) {
    allBuilderModels {
      page(target: { urlPath: $path }, limit: 1, options: { cachebust: true }) {
        content
      }
    }
  }
`;
