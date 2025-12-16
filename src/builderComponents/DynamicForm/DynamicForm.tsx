import clsx from "classnames";
import React, { FormEvent } from "react";
import BuilderBackgroundImage from "../../components/BuilderImage/BuilderBackgroundImage";
import { BuilderImageModel } from "../../components/BuilderImage/BuilderImage.type";
import CustomButton from "../../components/CustomButton/CustomButton";
import FlashMessage, { FlashMessageVM } from "../../components/FlashMessage/FlashMessage";
import DropdownField from "../../components/Form/DropdownField/DropdownField";
import { DropdownOptionType } from "../../components/Form/DropdownField/DropdownOptionType";
import InputField from "../../components/Form/InputField/InputField";
import { DynamicFormPresenter, DynamicFormView } from "../../presenters/DynamicForm/DynamicFormPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import "./DynamicForm.scss";

class DynamicForm extends React.PureComponent<Props, State> implements DynamicFormView {
  presenter: DynamicFormPresenter;
  state: State = {
    formValue: this.props.fields?.map((field) => ({ id: field.id, value: "", error: "" })) ?? [],
    submitted: false,
    flashMessage: {
      message: "",
      type: "none",
    },
  };

  constructor(props) {
    super(props);

    const presenters = new PresenterFactory();
    this.presenter = presenters.dynamicForm(this);
  }

  componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.fields === this.props.fields) return;

    this.clearForm();
  };

  clearForm = () =>
    this.setState({ formValue: this.props.fields!.map((field) => ({ id: field.id, value: "", error: "" })) });

  handleInput = (index: number, value: string, error: string) => {
    const { formValue } = this.state;
    const newFormValue = [...formValue];
    newFormValue?.splice(index, 1, { ...formValue[index], value: value, error: error });
    this.setState({ formValue: newFormValue });
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { campaignName } = this.props;
    const { formValue } = this.state;
    this.setState({ submitted: true });
    if (formValue.some(({ value, error }) => error !== "" || value === "")) return;
    this.setState({ submitted: false });
    const values = formValue.reduce((preValue, { id, value }) => ({ ...preValue, [id]: value }), {});
    this.presenter.submit({ campaignName, ...values });
  };

  showSuccessMessage = () =>
    this.setState(
      {
        flashMessage: {
          message: this.props.successMessage,
          type: "none",
        },
      },
      () => {
        this.setState({ flashMessage: { message: this.props.successMessage, type: "success" } });
        setTimeout(() => {
          this.setState({ flashMessage: { message: "", type: "none" } });
        }, 6000);
      }
    );

  fieldOptionsToDropdownOptions = (options: { option: string }[]) =>
    options?.map(({ option }) => ({ key: option, value: option, text: option } as DropdownOptionType));

  renderFields = () => {
    const { fields } = this.props;
    const { formValue, submitted } = this.state;

    return formValue?.map(({ value: fieldValue, error: fieldError }, index) => {
      const field = fields![index];
      if (field.type === "dropdown") {
        const options = this.fieldOptionsToDropdownOptions(field.options || []);

        return (
          <DropdownField
            key={`input-${field.id}-${index}`}
            width={field.fullWidth ? 100 : 50}
            required={true}
            label={field.label}
            inputEvent={(value, error) => this.handleInput(index, value, error)}
            defaultValue={fieldValue}
            options={options}
          />
        );
      }

      return (
        <InputField
          extraClass={`dynamic-form__body-section__input dynamic-form__body-section__input--${
            field.fullWidth ? "100" : "50"
          }`}
          key={`input-${field.id}-${index}`}
          label={field.label}
          placeholder={field.placeholder}
          width={100}
          type={field.type}
          defaultValue={fieldValue}
          givenError={fieldError}
          inputEvent={(value, error) => this.handleInput(index, value, error)}
          required={true}
          submitted={submitted}
        />
      );
    });
  };

  render() {
    const { background, header, subHeader, body, formTitle, cta } = this.props;
    const { flashMessage } = this.state;

    return (
      <div className='dynamic-form__container'>
        <FlashMessage message={flashMessage?.message} type={flashMessage?.type} />
        <BuilderBackgroundImage
          imageModel={background}
          className={clsx("dynamic-form__image-section__", {
            "dynamic-form__image-section__--shadow": header || subHeader || body,
          })}
        >
          {header && <h1 className='dynamic-form__image-section__header'>{header}</h1>}
          {subHeader && <h4 className='dynamic-form__image-section__sub-header'>{subHeader}</h4>}
          {body && <p className='dynamic-form__image-section__body'>{body}</p>}
        </BuilderBackgroundImage>
        <form className='dynamic-form__body-section__' onSubmit={this.handleSubmit}>
          <h2 className='dynamic-form__body-section__header'>{formTitle}</h2>
          <div className='dynamic-form__body-section__fields'>{this.renderFields()}</div>
          <CustomButton
            text={cta?.label}
            variation={cta?.variation}
            type='submit'
            customClass='dynamic-form__body-section__cta'
          />
        </form>
      </div>
    );
  }
}

interface Props {
  campaignName: string;
  background: BuilderImageModel;
  header?: string;
  subHeader?: string;
  body?: string;
  formTitle: string;
  fields?: {
    label: string;
    placeholder?: string;
    id: string;
    type: "email" | "text" | "dropdown";
    options?: { option: string }[];
    fullWidth: boolean;
  }[];
  cta?: {
    label: string;
    variation: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
  };
  successMessage: string;
}

interface State {
  formValue: { id: string; value: string; error: string }[];
  submitted: boolean;
  flashMessage: FlashMessageVM;
}

export default DynamicForm;
