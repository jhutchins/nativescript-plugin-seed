let spawn = require('child_process').spawn;
let child = spawn('node', [`${__dirname}/initialize-watchers.js`], {
  detached: false,
  stdio: ['inherit', 'inherit', 'inherit'] // child inherits stdin, stdout, stderr
});

child.unref() //don't block parent loop