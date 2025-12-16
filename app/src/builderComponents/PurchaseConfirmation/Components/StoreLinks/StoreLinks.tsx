import * as React from "react";
import "./StoreLinks.scss";
import googlePlay from "../../../../assets/images/googlePlay.png";
import appStore from "../../../../assets/images/appStore.png";

const StoreLinks = ({ content }: { content: string }) => (
  <div className={"store__"}>
    <p className={"body store__content"}>{content}</p>
    <div className='store__links'>
      <a href='https://play.google.com/store/apps/details?id=com.cityrowgo&hl=en&gl=US' className='store__link'>
        <img src={googlePlay} className='store__link-img' />
      </a>
      <a href='https://apps.apple.com/us/app/cityrow/id1458397452' className='store__link'>
        <img src={appStore} className='store__link-img' />
      </a>
    </div>
  </div>
);

export default StoreLinks;
