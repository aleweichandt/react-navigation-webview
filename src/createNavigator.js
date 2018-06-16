import React from 'react';
import PropTypes from 'prop-types';

const createNavigator = (WebView, router, webviewConfig = {}) => {
  class WebViewNavigator extends React.Component {
    static router = router;

    _getRouteFocused = () => {
      const { navigation } = this.props;
      const { state } = navigation;
      const { routes, index } = state;
      return routes[index];
    }

    _isRouteFocused = (route) => {
      const focusedRoute = this._getRouteFocused();
      return route === focusedRoute;
    };

    dangerouslyGetParent = () => this.props.navigation;

    render() {
      const { navigation, screenProps } = this.props;
      const { dispatch, state, addListener } = navigation;
      const pathAndParams = router.getPathAndParamsForState(state);
      const { path: uri } = pathAndParams;

      const route = this._getRouteFocused();
      // subscribe route.key -> addListener
      const actionCreators = {
        ...navigation.actions,
        ...router.getActionCreators(route, state.key),
      };
      const actionHelpers = {};
      Object.keys(actionCreators).forEach((actionName) => {
        actionHelpers[actionName] = (...args) => {
          const actionCreator = actionCreators[actionName];
          const action = actionCreator(...args);
          dispatch(action);
        };
      });
      const childNavigation = {
        ...actionHelpers,
        actions: actionCreators,
        addListener,
        dispatch,
        state: route,
        isFocused: () => this._isRouteFocused(route),
        dangerouslyGetParent: this.dangerouslyGetParent,
        getParam: (paramName, defaultValue) => {
          const { params } = route;
          if (params && paramName in params) {
            return params[paramName];
          }
          return defaultValue;
        },
      };

      return (
        <WebView
          {...this.props}
          uri={uri}
          screenProps={screenProps}
          navigation={childNavigation}
          navigationConfig={webviewConfig}
        />
      );
    }
  }
  WebViewNavigator.propTypes = {
    screenProps: PropTypes.shape({}),
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
      state: PropTypes.shape({
        routes: PropTypes.arrayOf(PropTypes.shape({
          routeName: PropTypes.string,
        })),
        index: PropTypes.number,
      }),
      addListener: PropTypes.func,
    }).isRequired,
  };
  WebViewNavigator.defaultProps = {
    screenProps: undefined,
  };
  return WebViewNavigator;
};

export default createNavigator;