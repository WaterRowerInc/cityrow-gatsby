import { Link } from "gatsby";
import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "./AddressField.scss";

const AddressField = ({
  country,
  width,
  label,
  linkText,
  linkDestination,
  extraClass,
  required,
  selectProps,
}: {
  country: any;
  width: 100 | 85 | 50 | 30 | 15;
  label: string;
  linkText?: string;
  linkDestination?: string;
  extraClass?: string;
  required?: boolean;
  selectProps: any;
}) => {
  const error = required ? "This field is required" : "";
  return (
    <div className={`address-field__container__ address-field__size-${width} ${extraClass}`}>
      <div className='address-field__container__label-row__'>
        <h4>{label}</h4>
        {linkText && <Link to={`${linkDestination}`}>{linkText}</Link>}
      </div>
      <div className='address-field__container__input-row__'>
        <div>
          <GooglePlacesAutocomplete
            autocompletionRequest={{ componentRestrictions: { country: country || "" } }}
            apiKey={process.env.GATSBY_GOOGLE_PLACES_AUTOCOMPLETE_KEY}
            apiOptions={{
              language: "en",
              region: country || "",
            }}
            selectProps={selectProps}
          />
        </div>
        <h4 className='address-field__container__input-row__error-label'>{error}</h4>
      </div>
    </div>
  );
};

export default AddressField;
