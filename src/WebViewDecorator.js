import React from "react";
import PropTypes from "prop-types";
import asQuery from "jquery-param";

const withWebViewDecorator = (WebView, BackHandler = null) => {
  class WebViewDecorator extends React.Component {
    _didFocusSubscription;
    _willBlurSubscription;
    _hasFocusSubscription;

    state = {
      canGoBack: false
    };

    constructor(props) {
      super(props);
      if (BackHandler) {
        // this can fire before component has mounted ...
        this._didFocusSubscription = this.props.navigation.addListener(
          "didFocus",
          // ...so this call also goes into componentDidMount
          payload => this.addBackButtonListener()
        );
      }
    }

    componentDidMount() {
      if (BackHandler) {
        this.addBackButtonListener();
        this._willBlurSubscription = this.props.navigation.addListener(
          "willBlur",
          payload =>
            BackHandler.removeEventListener(
              "hardwareBackPress",
              this.onBackButtonPressAndroid
            )
        );
      }
    }

    addBackButtonListener() {
      // guard against adding this twice
      if (!this.hasFocusSubscription) {
        this.hasFocusSubscription = true;
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        );
      }
    }

    onNavigationStateChange(navState) {
      if (BackHandler) {
        this.setState({
          canGoBack: navState.canGoBack
        });
      }
    }

    onBackButtonPressAndroid = () => {
      if (this.state.canGoBack) {
        this.webViewRef.goBack();
        return true;
      }
      return false;
    };

    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    render() {
      const { uri, navigation, ...navProps } = this.props;
      const params = navigation.getParam("query") || undefined;
      const url = params ? `${uri}?${asQuery(params)}` : uri;
      const props = { ...navProps, navigation, source: { uri: url } };
      return (
        <WebView
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          ref={ref => (this.webViewRef = ref)}
          {...props}
        />
      );
    }
  }

  WebViewDecorator.propTypes = {
    uri: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      getParam: PropTypes.func.isRequired
    }).isRequired
  };
  return WebViewDecorator;
};

export default withWebViewDecorator;
