import React, { Component } from 'react';
import { StyleSheet, AppState } from 'react-native';
import { WebView } from 'react-native-webview';

// ...
export default class Fiboview extends Component {
    componentDidMount() {
        // window.addEventListener("click", this.handleClick, false)
        AppState.addEventListener("change", function (params) {
            console.log(AppState.currentState); // (active/background) for page changes
            // (inactive) for ios
            // TODO: handle page_open, page_close here
        });
    }

    handleClick(e) {
        let misc = {};
        try {
            // click names
            console.log(e._targetInst.child.memoizedProps);
            misc.text = e._targetInst.child.memoizedProps || "";
        } catch (error) {
        }
        this.webref.injectJavaScript(`fibo.setEvent("click_event", "${misc.text}", { misc: ${misc} })`);
    }

    handlePageChange(e) {
        console.log(e);
        // TODO: handle page_close and page_open
    }

    render() {
        console.log(this.props);
        let url = 'http://unireply.com/andy.html?appid=' + this.props.appid;
        let uiFunc = `window.fibotalkSettings=${JSON.stringify(this.props.userInfo)}`;

        return <WebView
        ref={(r) => {this.webref = r}}
        originWhitelist={['*']}
        url={{ uri: url }}
        source={{ uri: url }}
        style={styles.visible}
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
        console.log("got to set", name, val);
        if (!name)
            return "not recogonized";
        switch(name) {
            case "userInfo":
                this.webref.injectJavaScript(`fibo.setUserInfo(${JSON.stringify(val)})`);
                break;
            case "login":
                this.webref.injectJavaScript(`fibo.login(${JSON.stringify(val)})`);
                break;
            case "signup":
                this.webref.injectJavaScript(`fibo.signup(${JSON.stringify(val)})`);
                break;
            case "click_event":
                this.handleClick(e);
                break;
            case "page_open":
                this.handlePageChange(e);
                break;
            case "open":
                this.webref.injectJavaScript(`fibo.open({name: "messenger", type: "open"})`);
                this.webref.style = styles.visible;
                break;
            case "close":
                this.webref.injectJavaScript(`fibo.open({name: "messenger", type: "close"})`);
                this.webref.style = styles.hidden;
                break;
            default:
                this.webref.injectJavaScript(`fibo.setEvent("${name}", "${val}", ${JSON.stringify(obj)})`);
        }
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