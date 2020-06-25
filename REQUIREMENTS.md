## Page events
1. Can be sent using 
```javascript
fibo.setEvent("page_open", <page_value>);
fibo.setEvent("page_close", <page_value>);
``` 
2. Setting "pageTs" at page_open.
3. Setting "duration" in event by calculating it using pageTs as
```javascript
var duration = Date.now() - pageTs;
fibo.setEvent("page_close", <page_value>, { duration: duration });
```
4. The page value in every event should be as <page_value>