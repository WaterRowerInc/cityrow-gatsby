// noinspection JSUnusedGlobalSymbols

import * as React from "react";
import { BuilderComponent } from "@builder.io/react";
import { graphql } from "gatsby";
import "@builder.io/widgets";
import { PresenterFactory } from "../presenters/PresenterFactory";
import { CommonPagePresenter, CommonPageView } from "../presenters/CommonPage/CommonPagePresenter";
import Loader from "../components/Loader/Loader";
import Impact from "../components/Impact/Impact";

class CommonPage extends React.Component<CommonPageProps, State> implements CommonPageView {
  state: State = { content: null, isLoading: true };
  presenter: CommonPagePresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.commonPage(this);
  }

  componentDidMount = async () => {
    const { path, data } = this.props;
    await this.presenter.start(data, path);
  };

  hideLoader = () => this.setState({ isLoading: false });

  showContent = (content: any) => this.setState({ content });

  showLoader = () => this.setState({ isLoading: true });

  render = () => {
    const { isLoading, content } = this.state;
    if (isLoading) return <Loader visible={isLoading} />;
    return (
      <>
        <Impact />
        <BuilderComponent model='landing-page' content={content} />
      </>
    );
  };
}

export default CommonPage;

// generates the data prop
export const commonPageQuery = graphql`
  query {
    allBuilderModels {
      # if the limit is omitted it will only return the first 20 pages.
      landingPage(options: { cachebust: true }, limit: 1000) {
        data {
          html
          css
          url
          jsCode
          cssCode
          inputs
          httpRequests
          blocks
          customFonts
          state
          title
          description
          analyticsPageTitle
        }
      }
      zoneModel {
        data {
          zone
        }
      }
    }
  }
`;

interface CommonPageProps {
  path: string;
  data: { allBuilderModels: { landingPage: { content: any; query: any }[] } };
}

interface State {
  content: any;
  isLoading: boolean;
}
