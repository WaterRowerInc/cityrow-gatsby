import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./src/assets/stylesheets/typography.scss";
import "./src/assets/stylesheets/theme.scss";
import "./node_modules/slick-carousel/slick/slick.scss"; //"./node_modules/slick-carousel/slick/slick.scss'";
import "./node_modules/slick-carousel/slick/slick-theme.scss";
import PageLayout from "./src/layouts/PageLayout";

export const wrapPageElement = ({ element, props }) => <PageLayout {...props}>{element}</PageLayout>;
