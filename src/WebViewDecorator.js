import React from 'react';
import PropTypes from 'prop-types';
import asQuery from 'jquery-param';

const withWebViewDecorator = (WebView) => {
  const WebViewDecorator = ({ uri, navigation, ...navProps }) => {
    const params = navigation.getParam('query') || undefined;
    const url = params ? `${uri}?${asQuery(params)}` : uri;
    const props = { ...navProps, navigation, source: { uri: url } };
    return (
      <WebView {...props} />
    );
  };
  WebViewDecorator.propTypes = {
    uri: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      getParam: PropTypes.func.isRequired,
    }).isRequired,
  };
  return WebViewDecorator;
};

export default withWebViewDecorator;
