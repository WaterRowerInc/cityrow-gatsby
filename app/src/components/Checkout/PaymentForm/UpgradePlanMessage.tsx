import React from "react";
import "./UpgradePlanMessage.scss";

const UpgradePlanMessage = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className='upgrade-plan-message__container'>
      <p className='upgrade-plan-message__text'>
        Your subscription plan has been upgraded to an Annual Plan for a financing purchase. This plan saves you $59
        during your first year with your new rower.
      </p>
    </div>
  );
};

export default UpgradePlanMessage;
