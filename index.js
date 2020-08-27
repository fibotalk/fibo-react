import React, { Component } from 'react';
import { StyleSheet, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

var currentPage = "", pageTs = "", appName = "";

/**
 * Main Fiboview component
 */
export default class Fiboview extends Component {
    componentDidMount() {
        AppState.addEventListener("change", (params) => {
            console.log(params);
            let state = AppState.currentState;
            let closeState = ['background', 'inactive'];
            let openState = ['active'];

            if (closeState.includes(state))
                this.handlePageClose();
            else if (openState.includes(state))
                this.handlePageOpen(currentPage);
        });
        appName = DeviceInfo.getApplicationName();
        setJSExceptionHandler((error, isFatal) => {
          console.log(error, isFatal);
          try {
            let err = JSON.parse(JSON.stringify(error));
            try {
                err.fatal = isFatal;
            } catch (error) {}
            this.webref.injectJavaScript(`fibo.setEvent("application_crash", null, ${JSON.stringify(err)}, { website: "${appName}", page: "${currentPage}" })`);
          } catch (error) {}
          throw new Error("unhandled exception");
        }, true);
        
        setNativeExceptionHandler((errorString) => {
          console.log(errorString);
          try {
            this.webref.injectJavaScript(`fibo.setEvent("application_crash", ${JSON.stringify(errorString)}, {}, { website: "${appName}", page: "${currentPage}" })`);
          } catch (error) {}
          throw new Error("unhandled exception");
        });
    }

    handleClick(e) {
        let misc = {};
        try {
            // click names
            console.log(e._targetInst.child.memoizedProps);
            misc.text = e._targetInst.child.memoizedProps || "";
        } catch (error) {
            if (typeof e === "string") {
                misc.text = e;
            }
        }
        try {
            this.webref.injectJavaScript(`fibo.setEvent("click_event", "${misc.text}", { misc: ${JSON.stringify(misc)} }, { website: "${appName}", page: "${currentPage}" })`);
        } catch (error) {}
    }

    handlePageClose() {
        if (currentPage) {
            let duration = 0;
            if (pageTs && !isNaN(pageTs)) {
                duration = Date.now() - pageTs;
            }
            try {
                this.webref.injectJavaScript(`fibo.setEvent("page_close", "${currentPage}", { duration: ${duration} }, { website: "${appName}", page: "${currentPage}" })`);
            } catch (error) {}
        }
    }

    handlePageOpen(newPage) {
        pageTs = Date.now();
        currentPage = newPage;
        try {
            this.webref.injectJavaScript(`fibo.setEvent("page_open", "${currentPage}", {}, { website: "${appName}", page: "${currentPage}" })`);
        } catch (error) {}
    }

    render() {
        console.log(this.props);
        let url = 'https://appsuite.fibotalk.com/andy.html?appid=' + this.props.appid;
        let uiFunc = `window.fibotalkSettings=${JSON.stringify(this.props.userInfo)}`;

        return <WebView
        ref={(r) => {this.webref = r}}
        originWhitelist={['*']}
        url={{ uri: url }}
        source={{ uri: url }}
        style={styles.hidden}
        injectedJavaScriptBeforeContentLoaded={uiFunc}
        onError={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
        }}
        domStorageEnabled={true}
        javaScriptCanOpenWindowsAutomatically={true}
        mixedContentMode={"compatibility"}
        thirdPartyCookiesEnabled={true}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={false}
        dataDetectorTypes={['all']}
        directionalLockEnabled={false}
        geolocationEnabled={false}
        keyboardDisplayRequiresUserAction={true}
        allowsBackForwardNavigationGestures={true}
        allowFileAccess={true}
        cacheMode={"LOAD_NO_CACHE"}
        pagingEnabled={true}
        allowsLinkPreview={true}
        sharedCookiesEnabled={true}
        textZoom={100} />;
    }

    set(name, val, obj) {
        if (!name)
            return "not recogonized";
        try {
            switch(name) {
                case "userInfo":
                    this.webref.injectJavaScript(`fibo.setUserInfo(${JSON.stringify(val)})`);
                    break;
                case "login":
                    this.webref.injectJavaScript(`fibo.login(${JSON.stringify(val)}, { website: "${appName}", page: "${currentPage}" })`);
                    break;
                case "signup":
                    this.webref.injectJavaScript(`fibo.signup(${JSON.stringify(val)}, { website: "${appName}", page: "${currentPage}" })`);
                    break;
                case "click_event":
                    this.handleClick(val);
                    break;
                case "page_open":
                    this.handlePageClose();
                    setTimeout(() => {
                        this.handlePageOpen(val);
                    }, 51);
                    break;
                // case "open":
                //     this.webref.injectJavaScript(`fibo.open({name: "messenger", type: "open"})`);
                //     this.webref.style = styles.visible;
                //     break;
                // case "close":
                //     this.webref.injectJavaScript(`fibo.open({name: "messenger", type: "close"})`);
                //     this.webref.style = styles.hidden;
                //     break;
                default:
                    this.webref.injectJavaScript(`fibo.setEvent("${name}", "${val}", ${JSON.stringify(obj)}, { website: "${appName}", page: "${currentPage}" })`);
            }
        } catch (error) {}
    }
}

const styles = StyleSheet.create({
    visible: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
        flex: 1,
        zIndex: 999999
    },
    hidden: {
        position: "absolute",
        height: 0,
        width: 0,
        backgroundColor: "transparent",
        flex: 0,
    }
});