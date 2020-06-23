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
        });
    }

    handleClick(e) {
        try {
            // click names
            console.log(e._targetInst.child.memoizedProps)
            console.log(e)
            // TODO: handle click_event here
        } catch (error) {
            console.log("catch");
            console.log(error)
        }
    }

    handlePageChange(e) {
        // TODO: handle page_close and page_open
    }

    render() {
        console.log(this.props);
        return <WebView
        ref={(r) => {this.webref = r}}
        originWhitelist={['*']}
        url={{ uri: 'http://unireply.com/andy.html' }}
        source={{ uri: 'http://unireply.com/andy.html' }}
        style={styles.visible}
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

    set(name, obj) {
        console.log("got to set", name, obj);
        if (!name)
            return "not recogonized";
        switch(name) {
            case "userInfo":
                // TODO: Set this in fibotalkSettings of webview
                break;
            case "login":
                // TODO: call fibo.login
                break;
            case "signup":
                // TODO: call fibo.signup
                break;
            case "click_event":
                this.handleClick(e);
                break;
            case "page_open":
                this.handlePageChange(e);
                break;

        }
        // this.webref.injectJavaScript(`fibo.setEvent("${name}")`);
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