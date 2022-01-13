# react-native-fibo-react

## Dependencies
1. react
2. react-native
3. react-native-webview
4. react-native-device-info
5. react-native-exception-handler

## Getting started

`$ npm install fibo-react --save`

### Mostly automatic installation

`$ react-native link fibo-react`

## Usage
```javascript
import Fiboview from 'fibo-react';

// TODO: What to do with the module?
<Fiboview
    appid="your gid"
    ref={(e)=>{fibo = e}}
/>

// To use the fibo library function:

// userInfo
fibo.set("userInfo", { user: { userId: "" }, account: { accountId: "" } });

// login
fibo.set("login", { user: { userId: "" }, account: { accountId: "" } });

// signup
fibo.set("signup", { user: { userId: "" }, account: { accountId: "" } });

// event
fibo.set("event name", "event value", { /* Event properties */ });
```