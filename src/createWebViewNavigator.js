import { createNavigationContainer } from 'react-navigation';

import createNavigator from './createNavigator';
import WebViewRouter from './WebViewRouter';

const createWebViewNavigator = (WebView, routeConfigMap, webviewConfig = {}) => {
  const {
    initialRouteKey,
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
    // disableKeyboardHandling,
    noInitialRoute,
  } = webviewConfig;

  const webviewRouterConfig = {
    initialRouteKey,
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
    noInitialRoute,
  };

  const router = WebViewRouter(routeConfigMap, webviewRouterConfig);

  // Create a navigator with WebView as the view
  const Navigator = createNavigator(WebView, router, webviewConfig);
  // TODO not yet supported
  // if (!disableKeyboardHandling) {
  //   Navigator = createKeyboardAwareNavigator(Navigator);
  // }

  // HOC to provide the navigation prop for the top-level navigator (when the prop is missing)
  return createNavigationContainer(Navigator);
};

export default createWebViewNavigator;
