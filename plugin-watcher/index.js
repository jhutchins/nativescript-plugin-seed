var spawn = require('child_process').spawn;
var child = spawn('node', [`${__dirname}/autorun.js`], {
  detached: false,
  stdio: ['inherit', 'inherit', 'inherit']
});

child.unref()