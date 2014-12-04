# broccoli-cmd #


Command line plugin for Broccoli

## Usage ##

```javascript
var cmd = require('broccoli-cmd');
var path = require('path');

var src = 'src';

src = cmd(src, {
  cmd: path.resolve(__dirname + '/node_modules/.bin/traceur'),
  arguments: '--modules=inline --source-maps=file --dir "<%= srcDir %>/"' +
    ' "<%= destDir %>/"'
});
```
