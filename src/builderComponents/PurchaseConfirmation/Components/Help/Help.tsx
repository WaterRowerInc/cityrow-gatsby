import * as React from "react";
import "./Help.scss";
import CTAButton from "../../../../components/CTAButton/CTAButton";
import BuilderImage from "../../../../components/BuilderImage/BuilderImage";
import { Section } from "../../PurchaseConfirmation";

const Help = ({ leftSection, rightSection }: { leftSection?: Section; rightSection?: Section }) =>
  leftSection || rightSection ? (
    <div className='help__container'>
      {leftSection && (
        <div className='help__content'>
          <div className='help__icon'>
            <BuilderImage className='help__icon' imageModel={leftSection.icon} />
          </div>
          <h3 className='help__title'>{leftSection.title}</h3>
          <div className='help__body'>
            <p>{leftSection.body}</p>
          </div>
          {leftSection.destination && leftSection.buttonLabel && (
            <CTAButton
              customClass='help__button'
              goTo={leftSection.destination}
              external={leftSection.external}
              text={leftSection.buttonLabel}
              variation='secondary'
            />
          )}
        </div>
      )}

      {rightSection && (
        <div className='help__content'>
          <div className='help__icon'>
            <BuilderImage className='help__icon' imageModel={rightSection.icon} />
          </div>
          <h3 className='help__title'>{rightSection.title}</h3>
          <div className='help__body'>
            <p>{rightSection.body}</p>
          </div>
          {rightSection.destination && rightSection.buttonLabel && (
            <CTAButton
              customClass='help__button'
              goTo={rightSection.destination}
              external={rightSection.external}
              text={rightSection.buttonLabel}
              variation='secondary'
            />
          )}
        </div>
      )}
    </div>
  ) : null;

export default Help;
