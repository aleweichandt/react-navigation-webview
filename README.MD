# React Navigation Webview

React Navigation Webview is an extension of React Navigation lib which allows us to include url paths handled by a single WebView component in our navigation's route configuration.

## Installation

To install the latest version of react-navigation-webview you only need to run:

```bash
yarn add react-navigation-webview
```

or

```bash
npm install --save react-navigation-webview
```

## Documentation

### Creating a WebView Navigator

createWebViewNavigator function will create a StackRouter to keep track of uri routes. this Router will be attached to the React Component provided, which needs to handle the "uri" given prop.

```
import React from 'react';
import { View, Text } from 'react-native';
import { createWebViewNavigator } from 'react-navigation';

class UriView extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{this.props.uri}</Text>
      </View>
    );
  }
}

const routesConfig = {
  Home: { path: 'http://www.google.com' },
};

export default createWebViewNavigator(UriView, routesConfig);
```

### WebView Stack Router Configuration

WebView router inherits all react-navigation's StackRouter configuration params. In addition to them, the "noInitialRoute" param was added to prevent router to be initialized with an empty routes stack.


```
const webviewConfig = {
  noInitialRoute: true,
};
export default createWebViewNavigator(UriView, routesConfig, webviewConfig);
```

### Dynamic routing and WebViewDecorator

react-navigation path management comes already with dynamic routing. In order to use this feature you only need to:
- Set paths using templates, setting up vars with the : before.
```
Home: { path: "https://server.com/user/:userid/status" }
```
- when navigating to this route send the declared keys in params.
```
NavigationActions.navigate({ routeName: 'Home', params: { userid: "1" } });
```

If this is not enough. i've added WebViewDecorator High Order Component to handle query params (sent by adding a map with "query" key in your navigation params) and merging all them in a ```source: {uri}``` prop as used in react-native's WebView component.

```
import { WebView } from 'react-native';
import { WebViewDecorator } from 'react-native-webview';

const WithDecorator = WebViewDecorator(WebView);
export default createWebViewNavigator(WithDecorator, routesConfig, webviewConfig);
```


## React Navigation Useful Docs

* The best way to learn is to follow the [Getting started guide](https://reactnavigation.org/docs/getting-started.html). It guides you through the fundamentals of React Navigation.
* The documentation includes solutions for common use cases in the "How do I do ...?" section, such as [tab navigation](https://reactnavigation.org/docs/tab-based-navigation.html) and [Redux integration](https://reactnavigation.org/docs/redux-integration.html).
* If you need to build your own navigator, [there's a section for that](https://reactnavigation.org/docs/custom-navigator-overview.html) too.
* The [API reference](https://reactnavigation.org/docs/api-reference.html) lists all public APIs.
* The [Community Resources](https://github.com/react-navigation/react-navigation/blob/master/COMMUNITY_RESOURCES.md) document lists some other resources submitted to us by people who use React Navigation. Feel free to open a pull request to add your resource to the list.
* You can contribute improvements to the documentation [in the website repository](https://github.com/react-navigation/react-navigation.github.io).
