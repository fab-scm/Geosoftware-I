var path = require('path')
var fs = require('fs');
console.log(__dirname);
console.log(path.resolve(__dirname, "data/uploads/42a112eff3585d96badc649bde3c090c"));

var json = fs.readFileSync(path.resolve(__dirname, "data/uploads/42a112eff3585d96badc649bde3c090c.geojson"));
console.log(json);

var json2 = fs.readFileSync(path.resolve(__dirname, "data/uploads/3b6de8fd972dba3efe307e6c91c23a74"));
console.log(json2);