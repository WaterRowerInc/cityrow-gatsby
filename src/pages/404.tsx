import React from "react";
import { Builder, BuilderComponent } from "@builder.io/react";
import womenUsingRower from "assets/images/women_using_rower.webp";
import "@builder.io/widgets";
import "../components/404/404.scss";
import Loader from "../components/Loader/Loader";
import Impact from "../components/Impact/Impact";

const NotFound = (props: { path: string }) => {
  if (!props?.path.includes("/en-")) return <Loader />;

  if (Builder.isPreviewing || Builder.isEditing) {
    return <BuilderComponent model='content' />;
  }

  const mail = (
    <a href={"mailto:go@cityrow.com"} target={"_blank"} rel={"noreferrer"}>
      {"go@cityrow.com"}
    </a>
  );

  return (
    <div className='not-found-page__container__'>
      <div className='not-found-page__container__image'>
        <img src={womenUsingRower} alt='pageNotFund' />
      </div>
      <div className='not-found-page__container__text-content'>
        <h1>We can't Find That Page!</h1>
        <p>Don't sweat it - head back to our homepage or contact us at {mail} if you need help!</p>
      </div>
      <Impact />
    </div>
  );
};

export default NotFound;
