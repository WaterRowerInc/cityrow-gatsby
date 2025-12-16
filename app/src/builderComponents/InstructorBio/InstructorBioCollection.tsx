import React from "react";
import "./InstructorBioCollection.scss";
import InstructorBioItem from "./Components/InstructorBioItem/InstructorBioItem";
import InstructorBioCollectionProps from "./InstructorBioCollectionProps";

const InstructorBioCollection = ({ title, bios }: InstructorBioCollectionProps) => {
  return (
    <div className='instructor-bio-collection__container__'>
      <h1 className='instructor-bio-collection__container__title'>{title}</h1>
      <div className='instructor-bio-collection__container__title-border'>.</div>
      <div className='instructor-bio-collection__container__items-box'>
        {bios && bios.map((bio, index) => <InstructorBioItem key={`sa${index}`} bio={bio} />)}
      </div>
    </div>
  );
};

export default InstructorBioCollection;
