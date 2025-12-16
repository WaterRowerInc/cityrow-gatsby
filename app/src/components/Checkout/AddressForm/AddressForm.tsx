import InputField from "../../Form/InputField/InputField";
import AddressField from "../../Form/AddressField/AddressField";
import DropdownField from "../../Form/DropdownField/DropdownField";
import React from "react";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import Country from "../../../core/domain/localization/Country";
import StateVM from "../../../core/domain/localization/StateVM";
import CheckboxField from "../../Form/CheckboxField/CheckboxField";

const AddressForm = ({
  city,
  country,
  countryOptions,
  isSubscriptionOnlyPurchase,
  place,
  postalCode,
  replicateEmailValues,
  state,
  stateOptions,
  updateCountryValue,
  updateEmail,
  updateFormValue,
  updateShippingOptions,
  userEmailRef,
  submitted,
}: {
  city: string;
  country: Country;
  countryOptions: any;
  isSubscriptionOnlyPurchase?: boolean;
  place: any;
  postalCode: string;
  replicateEmailValues: any;
  state: StateVM;
  stateOptions: any;
  updateCountryValue?: any;
  updateEmail: (value: string) => void;
  updateFormValue: any;
  updateShippingOptions: any;
  userEmailRef: any;
  submitted: boolean;
}) => {
  const [apartmentError, setApartmentError] = React.useState("");
  const [addressError, setAddressError] = React.useState("This field is required");
  const [cityError, setCityError] = React.useState("");
  const [contactMeError, setContactMeError] = React.useState("");
  const [countryError, setCountryError] = React.useState("");
  const [firstNameError, setFirstNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [placeError, setPlaceError] = React.useState("");
  const [postalCodeError, setPostalCodeError] = React.useState("");
  const [stateError, setStateError] = React.useState("");
  const [userEmailError, setUserEmailError] = React.useState("");

  const extractZipCode = (places) => {
    if (!places?.[0]) return "";
    const addressComponents = places[0].address_components;
    const lastComponent = addressComponents?.[addressComponents.length - 1].long_name;
    const semiLastComponent = addressComponents?.[addressComponents.length - 2].long_name;
    if (parseInt(semiLastComponent) > 0) {
      return `${semiLastComponent}-${lastComponent}`;
    } else if (parseInt(lastComponent) > 0) {
      return `${lastComponent}`;
    } else {
      return "";
    }
  };
  const setDropdownOption = (key, value) => {
    let options;
    if (key === "state") {
      options = stateOptions;
    } else if (key === "country") {
      options = countryOptions;
    }
    options.map((option: any) => {
      if (option?.key === value) {
        updateErrorValue(key, option, "");
      }
    });
  };
  const updateAddressData = async (place) => {
    const terms = place?.value?.terms;
    const postalCode = extractZipCode(await geocodeByPlaceId(place?.value?.place_id));
    const address = place?.value?.terms?.length === 5 ? `${terms[0].value} ${terms[1].value}` : terms[0]?.value;
    const city = terms[terms?.length - 3]?.value;
    const state = terms[terms?.length - 2]?.value;
    const country = terms[terms?.length - 1]?.value.length > 3 ? "" : terms[terms?.length - 1]?.value.substr(0, 2);

    updateErrorValue("place", place || "", "");
    updateErrorValue("address", address || "", "");
    updateErrorValue("city", city || "", "");
    setDropdownOption("state", state || "");
    updateErrorValue("postalCode", postalCode || "", !postalCode ? "This field is required" : "");
    updateShippingOptions({ city, country, postalCode, state });
  };
  const updateErrorValue = (key, value, errorFound) => {
    switch (key) {
      case "address":
        setAddressError(errorFound);
        break;
      case "city":
        setCityError(errorFound);
        break;
      case "place":
        setPlaceError(errorFound);
        break;
      case "phone":
        setPhoneError(errorFound);
        break;
      case "userEmail":
        setUserEmailError(errorFound);
        break;
      case "postalCode":
        setPostalCodeError(errorFound);
        break;
      case "country":
        setCountryError(errorFound);
        break;
      case "contactMe":
        setContactMeError(errorFound);
        break;
      case "apartment":
        setApartmentError(errorFound);
        break;
      case "firstName":
        setFirstNameError(errorFound);
        break;
      case "lastName":
        setLastNameError(errorFound);
        break;
      case "state":
        setStateError(errorFound);
        break;
      default:
        return;
    }
    updateFormValue(key, value);
  };

  React.useEffect(() => {
    if (stateOptions.length > 1) {
      updateFormValue("state", stateOptions[0]);
    }
  }, [stateOptions]);

  React.useEffect(() => {
    if (countryOptions.length > 1) {
      updateFormValue("country", countryOptions[0]);
    }
  }, [countryOptions]);

  React.useEffect(() => {
    updateFormValue(
      "isAddressFormOk",
      !addressError.length &&
        !apartmentError.length &&
        !cityError.length &&
        !contactMeError.length &&
        !countryError.length &&
        !firstNameError.length &&
        !lastNameError.length &&
        !phoneError.length &&
        !placeError.length &&
        !postalCodeError.length &&
        !stateError.length &&
        !userEmailError.length
    );
  }, [
    addressError,
    apartmentError,
    cityError,
    contactMeError,
    countryError,
    firstNameError,
    lastNameError,
    phoneError,
    placeError,
    postalCodeError,
    stateError,
    userEmailError,
  ]);

  return (
    <>
      <h1 className='checkout-page__container__flow-container__big-title'>
        {isSubscriptionOnlyPurchase ? "User Information" : "Shipping & Delivery Address"}
      </h1>
      <div className='checkout-page__container__flow-container__input-row'>
        <InputField
          inputEvent={(value, errorFound) => {
            updateErrorValue("userEmail", value, errorFound);
            replicateEmailValues("userEmail", value, errorFound);
          }}
          label='EMAIL'
          onBlur={updateEmail}
          required={true}
          refe={userEmailRef}
          submitted={submitted}
          type='email'
          width={50}
        />
        <InputField
          submitted={submitted}
          width={50}
          required={true}
          label='PHONE'
          type='text'
          inputEvent={(value, errorFound) => updateErrorValue("phone", value, errorFound)}
        />
      </div>
      <div className='checkout-page__container__flow-container__input-row'>
        <InputField
          submitted={submitted}
          width={50}
          required={true}
          label='FIRST NAME'
          type='text'
          inputEvent={(value, errorFound) => updateErrorValue("firstName", value, errorFound)}
        />
        <InputField
          submitted={submitted}
          width={50}
          required={true}
          label='LAST NAME'
          type='text'
          inputEvent={(value, errorFound) => updateErrorValue("lastName", value, errorFound)}
        />
      </div>
      {!isSubscriptionOnlyPurchase && (
        <div className='checkout-page__container__flow-container__input-row'>
          <DropdownField
            width={100}
            disabled={true}
            defaultValue={country.value}
            required={true}
            label='COUNTRY/REGION'
            inputEvent={(value) => updateCountryValue && updateCountryValue(value)}
            options={countryOptions}
          />
          <AddressField
            extraClass='d-md-none'
            country={country?.key?.toLowerCase()}
            width={85}
            label='ADDRESS'
            required={submitted && addressError.length > 0}
            selectProps={{
              value: place,
              onChange: updateAddressData,
            }}
          />
          <AddressField
            extraClass='d-md-block'
            country={country?.key?.toLowerCase()}
            width={100}
            label='ADDRESS'
            required={submitted && addressError.length > 0}
            selectProps={{
              value: place,
              onChange: updateAddressData,
            }}
          />
          <InputField
            submitted={submitted}
            width={15}
            label='APT/SUITE'
            type='text'
            inputEvent={(value, errorFound) => updateErrorValue("apartment", value, errorFound)}
          />
          <InputField
            submitted={submitted}
            extraClass='visible-medium'
            width={30}
            label='POSTAL CODE'
            defaultValue={postalCode}
            type='zip'
            required={true}
            inputEvent={(value, errorFound) => updateErrorValue("postalCode", value, errorFound)}
          />
        </div>
      )}
      {!isSubscriptionOnlyPurchase && (
        <div className='checkout-page__container__flow-container__input-row'>
          <InputField
            submitted={submitted}
            width={30}
            label='CITY'
            required={true}
            type='text'
            defaultValue={city}
            inputEvent={(value, errorFound) => updateErrorValue("city", value, errorFound)}
          />
          <DropdownField
            width={30}
            required={true}
            defaultValue={state.value}
            label='STATE'
            afterInputEvent={(value) => updateShippingOptions({ state: value })}
            inputEvent={(value, errorFound) => updateErrorValue("state", value, errorFound)}
            options={stateOptions}
          />
          <InputField
            submitted={submitted}
            extraClass='hidden-medium'
            width={30}
            label='POSTAL CODE'
            defaultValue={postalCode}
            type='zip'
            required={true}
            onBlur={() => updateShippingOptions({ postalCode: postalCode })}
            inputEvent={(value, errorFound) => updateErrorValue("postalCode", value, errorFound)}
          />
        </div>
      )}
      <CheckboxField
        width={100}
        defaultValue={true}
        label='Let CITYROW contact me with exclusive offers and news.'
        inputEvent={(value, errorFound) => updateErrorValue("contactMe", value, errorFound)}
      />
    </>
  );
};

export default AddressForm;
