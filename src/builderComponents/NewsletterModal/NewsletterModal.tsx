import React from "react";
import { Modal } from "semantic-ui-react";
import CustomButton from "../../components/CustomButton/CustomButton";
import InputField from "../../components/Form/InputField/InputField";
import {
  NewsletterModalPresenter,
  NewsletterModalView,
} from "../../presenters/NewsletterModal/NewsletterModalPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import "./NewsletterModal.scss";

class NewsletterModal extends React.Component<NewsletterModalProps, State> implements NewsletterModalView {
  state: State = {
    isModalVisible: false,
    isEmailValid: false,
  };
  presenter: NewsletterModalPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.newsLetter(this);
  }

  componentDidMount = () =>
    setTimeout(() => this.setModalVisible(true), this.props.delaySeconds > 0 ? this.props.delaySeconds * 1000 : 1);

  hideModal = () => {
    this.setModalVisible(false);
  };

  private setModalVisible = (isModalVisible: boolean) => this.setState({ isModalVisible });

  private setEmail = (email: string, errorFound: string) => this.setState({ email, isEmailValid: !errorFound });

  render = () => {
    const { email, isModalVisible, isEmailValid } = this.state;
    const { body, disclaimer, header, image, placeholder } = this.props;
    return (
      <div>
        <Modal
          className='newsletterModal__container'
          onClose={() => this.setModalVisible(false)}
          onOpen={() => this.setModalVisible(true)}
          open={isModalVisible}
        >
          <Modal.Content>
            <Modal.Description>
              <div
                className='cart__header__close-button newsletterModal__close'
                onClick={() => this.setModalVisible(false)}
                role={"button"}
                onKeyPress={(e) => e.key.toLowerCase() === "enter" && this.setModalVisible(false)}
                tabIndex={0}
              />
              {image && <img src={image} alt='modal-img' className='newsletterModal__image' />}
              <div className='newsletterModal__right-container'>
                {header && <h5 className='newsletterModal__title'>{header}</h5>}
                {body && <p className='newsletterModal__body'>{body}</p>}
                <InputField
                  placeholder={placeholder}
                  width={100}
                  label='EMAIL'
                  type='email'
                  required={true}
                  inputEvent={(value, errorFound) => this.setEmail(value, errorFound)}
                />
                <CustomButton
                  customClass='newsletterModal__cta'
                  disabled={!isEmailValid}
                  variation='primary'
                  text='Submit'
                  onClick={() => this.presenter.trackEmailSubmitted(email)}
                />
                {disclaimer && <p className='newsletterModal__disclaimer'>{disclaimer}</p>}
              </div>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  };
}

interface State {
  isModalVisible: boolean;
  isEmailValid: boolean;
  email?: string;
}

interface NewsletterModalProps {
  disclaimer?: string;
  delaySeconds: number;
  header: string;
  headerPosition: "Left" | "Center" | "Right";
  image?: string;
  body: string;
  bodyPosition: "Left" | "Center" | "Right";
  placeholder: string;
  buttonText: string;
  buttonType: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
  buttonPosition: "Left" | "Center" | "Right";
}

export default NewsletterModal;
