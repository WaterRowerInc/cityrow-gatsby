import clsx from "classnames";
import React from "react";
import checkWhiteIcon from "../../../assets/images/whiteFilledCheckIcon.png";
import useCheckMobile from "../../../hooks/useCheckMobile";
import "./SubscriptionPlanBox.scss";
import SubscriptionPlanBoxMobile from "./SubscriptionPlanBoxMobile";

const SubscriptionPlanBox = ({
  plan,
  onSelect,
  selected,
}: {
  plan: {
    id: string;
    description: string;
    isPopular: boolean;
    name: string;
    price: string;
  };
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  if (useCheckMobile()) return <SubscriptionPlanBoxMobile plan={plan} onSelect={onSelect} selected={selected} />;

  return (
    <div
      className={clsx("subscription-plan-box__", { "subscription-plan-box__--selected": selected })}
      onClick={() => onSelect(plan.id)}
    >
      <div className='subscription-plan-box__container'>
        <div className='subscription-plan-box__price__container'>
          <h4 className='subscription-plan-box__price__number'>{plan.price}</h4>
          <p className='subscription-plan-box__price__description'>billed {plan.name.toLowerCase()}</p>
        </div>

        <div className='subscription-plan-box__separator' />

        <div className='subscription-plan-box__body__container'>
          <div className='subscription-plan-box__body__title__container'>
            <h4 className='subscription-plan-box__body__title__text'>{plan.name} Plan</h4>
            {plan.isPopular && (
              <div className='subscription-plan-box__body__title__most-popular__container'>
                <p className='subscription-plan-box__body__title__most-popular__text'>Most Popular</p>
              </div>
            )}
          </div>

          <p className='subscription-plan-box__body__description__text'>{plan.description}</p>
        </div>

        <button
          className={clsx("subscription-plan-box__cta", {
            "subscription-plan-box__cta--focus": selected,
          })}
        >
          {selected ? (
            <p>
              <img src={checkWhiteIcon} alt='Icon' />
              PLAN SELECTED
            </p>
          ) : (
            "SELECT PLAN"
          )}
        </button>
      </div>

      {selected && (
        <div className='subscription-plan-box__footer__container'>
          <p className='subscription-plan-box__footer__text'>You will be charged at the end of your trial.</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanBox;
