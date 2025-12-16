import React, { FormEvent } from "react";
import CustomButton from "../../components/CustomButton/CustomButton";
import InputField from "../../components/Form/InputField/InputField";
import { DynamicFormPresenter, DynamicFormView } from "../../presenters/DynamicForm/DynamicFormPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import "./ContactField.scss";

class ContactField extends React.PureComponent<Props, State> implements DynamicFormView {
  presenter: DynamicFormPresenter;
  state: State = {
    email: "",
    emailError: "",
    submitted: false,
  };

  constructor(props) {
    super(props);

    const presenters = new PresenterFactory();
    this.presenter = presenters.dynamicForm(this);
  }

  handleInput = (email: string, emailError: string) => this.setState({ email, emailError });

  handleSubmit = (e: FormEvent) => {
    const { campaignName } = this.props;
    const { email, emailError } = this.state;
    this.setState({ submitted: true });

    if (emailError) return;
    this.presenter.submit({ campaignName, email });
    e.preventDefault();
  };

  clearForm = () => this.setState({ email: "", submitted: false });

  render() {
    const { body, cta, header, input } = this.props;
    const { email, emailError, submitted } = this.state;

    return (
      <div className='contact-field__container'>
        <div className='contact-field__inner-container'>
          <div className='contact-field__text__container'>
            {header && <h4 className='contact-field__text__title'>{header}</h4>}
            <p className='contact-field__text__description'>{body}</p>
          </div>
          <form className='contact-field__cta_field__container' onSubmit={this.handleSubmit}>
            <InputField
              extraClass='contact-field__cta_field__input'
              placeholder={input?.title}
              width={100}
              type={input?.type}
              required
              defaultValue={email}
              givenError={emailError}
              inputEvent={this.handleInput}
              submitted={submitted}
            />
            <CustomButton
              type='submit'
              customClass='contact-field__cta_field__cta'
              text={cta?.label}
              variation={cta?.variation}
            />
          </form>
        </div>
      </div>
    );
  }
}
interface Props {
  campaignName: string;
  header: string;
  body: string;
  input: {
    title: string;
    type: "email" | "text";
  };
  cta: {
    label: string;
    variation: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
  };
}
interface State {
  email: string;
  emailError: string;
  submitted: boolean;
}

export default ContactField;
