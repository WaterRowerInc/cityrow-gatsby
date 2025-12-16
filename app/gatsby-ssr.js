import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./src/assets/stylesheets/typography.scss";
import "./src/assets/stylesheets/theme.scss";
import PageLayout from "./src/layouts/PageLayout";

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  getPreBodyComponents,
  replacePreBodyComponents,
}) => {
  const headerScripts = [
    ...getHeadComponents(),
    <script
      key='ire'
      id='ire'
      dangerouslySetInnerHTML={{
        __html: `(function(a,b,c,d,e,f,g){e['ire_o']=c;e[c]=e[c]||function(){(e[c].a=e[c].a||[]).push(arguments)};f=d.createElement(b);g=d.getElementsByTagName(b)[0];f.async=1;f.src=a;g.parentNode.insertBefore(f,g);})('//d.impactradius-event.com/A2428145-c6c4-4b22-9669-a5373a4c37f11.js','script','ire',document,window);`,
      }}
    />,
  ];
  const bodyScripts = [
    ...getPreBodyComponents(),
    <script
      key='trustpilot-library'
      type='text/javascript'
      src='//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js'
      async
    />,
  ];
  replaceHeadComponents(headerScripts);
  replacePreBodyComponents(bodyScripts);
};

export const wrapPageElement = ({ element, props }) => <PageLayout {...props}>{element}</PageLayout>;
