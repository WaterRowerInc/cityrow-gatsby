import React, { MutableRefObject, useEffect } from "react";
import './TrustPilotReviews.scss'

declare global {
  interface Window {
    Trustpilot: {
      loadFromElement(ref: HTMLDivElement, flag: boolean);
    };
  }
}

interface TrustBoxProps {
  trustBoxRef?: MutableRefObject<HTMLDivElement>;
}

const TrustBox = ({ trustBoxRef }: TrustBoxProps) => (
  <div
    ref={trustBoxRef}
    className='trustpilot-widget'
    data-locale='en-US'
    data-template-id='5763bccae0a06d08e809ecbb'
    data-businessunit-id='6070657dd4b8fb0001737711'
    data-style-height='700px'
    data-style-width='100%'
    data-theme='light'
    data-stars='1,2,3,4,5'
    data-sku='wr-go-1-usd,wr-go-2-usd'
    data-name='Rowers'
    data-review-languages='en'
    data-star-color='#59A4DF'
    data-font-family='Montserrat'
    data-no-reviews='show'
    data-scroll-to-list='true'
    data-allow-robots='true'
  >
    <a href='https://www.trustpilot.com/review/cityrow.com' target='_blank' rel='noreferrer'>
      Trustpilot
    </a>
  </div>
);

const TrustPilotReviews = () => {
  const trustBoxRef = React.useRef<HTMLDivElement>();

  useEffect(() => {
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(trustBoxRef.current as HTMLDivElement, true);
    }
  }, []);

  return (
    <div className='trustpilot-reviews__container'>
      <TrustBox trustBoxRef={trustBoxRef as MutableRefObject<HTMLDivElement>} />
    </div>
  );
};
export default TrustPilotReviews;
