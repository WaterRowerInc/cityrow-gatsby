import { Link } from "gatsby";
import React from "react";

export default function ResubscriptionContainer({ resubscribeUrl }: { resubscribeUrl: string }) {
  return (
    <div className='subscription-info-section__resubscribe-container__'>
      <div className='subscription-info-section__resubscribe-container__text-container'>
        <h5 className='subscription-info-section__resubscribe-container__title'>Get Full Access To The App</h5>
        <p className='subscription-info-section__resubscribe-container__text'>
          Purchase a subscription plan to get full access to all classes, content, and features within the CITYROW App
        </p>
      </div>
      <div className='subscription-info-section__resubscribe-container__button-container'>
        <Link to={resubscribeUrl} className='subscription-info-section__button'>
          GET STARTED
        </Link>
      </div>
    </div>
  );
}
