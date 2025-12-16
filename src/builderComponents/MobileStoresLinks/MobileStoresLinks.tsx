import * as React from "react";
import "./MobileStoresLinks.scss";
import googlePlay from "../../assets/images/googlePlay.png";
import appStore from "../../assets/images/appStore.png";

const MobileStoresLinks = ({ title, body }: { title: string; body: string }) => {
  return (
    <div>
      <div className='mobile-stores-links__content'>
        <h2 className={"mobile-stores-links__header-title"}>{title}</h2>
        <div className={"mobile-stores-links__title-border"}></div>
        <p className='mobile-stores-links__body'>{body}</p>
        <div className='mobile-stores-links__store-links'>
          <a
            href='https://play.google.com/store/apps/details?id=com.cityrowgo&hl=en&gl=US'
            className='mobile-stores-links__store-link'
          >
            <img src={googlePlay} className='mobile-stores-links__store-link-img' />
          </a>
          <a href='https://apps.apple.com/us/app/cityrow/id1458397452' className='mobile-stores-links__store-link'>
            <img src={appStore} className='mobile-stores-links__store-link-img' />
          </a>
        </div>
      </div>
      <div className='mobile-stores-links__footer-waves'></div>
    </div>
  );
};

export default MobileStoresLinks;
