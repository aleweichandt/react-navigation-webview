import { StackRouter } from 'react-navigation';

const WebViewRouter = (routeConfigs, stackConfig = {}) => {
  const withScreenConfig = Object.keys(routeConfigs).reduce((acc, k) => {
    acc[k] = { ...routeConfigs[k], screen: 'none' };
    return acc;
  }, {});
  const stackRouter = new StackRouter(withScreenConfig, stackConfig);

  // Replace functions here if needed
  const { noInitialRoute } = stackConfig;
  const stackRouterGetStateForAction = stackRouter.getStateForAction;
  stackRouter.getStateForAction = (action, state) => {
    const nextState = stackRouterGetStateForAction(action, state);
    if (!state && noInitialRoute) {
      nextState.routes = [];
    }
    return nextState;
  };

  return stackRouter;
};

export default WebViewRouter;
