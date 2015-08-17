# asynchronous-for-each

An asynchronous implementation of forEach.

File size: **xxx bytes**.<br/>
Supported platforms: **browser and server**.<br/>
Supported language versions: **ES5+**.

## Example

```javascript
var forEach = require('asynchronous-for-each');

forEach([1,2,3], { cb: function(i) {
	console.log(i);
}}); // 1, 2, 3 
```

## License & Copyright

This software is released under the MIT License. It is Copyright 2015, Ben Aston. I may be contacted at ben@bj.ma.

## How to Contribute

Pull requests including bug fixes, new features and improved test coverage are welcomed. Please do your best, where possible, to follow the style of code found in the existing codebase.