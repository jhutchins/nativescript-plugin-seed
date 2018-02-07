var cp = require('child_process');
var child = cp.fork(`${__dirname}/autorun.js`);

child.on('message', function(m) {
  // Receive results from child process
  console.log('received: ' + m);
});

// child.send('Please up-case this string');
// process.on('SIGINT', function () {
//     console.log("#### HANDLING SIGINT CTRL + C!")
//     child.send('Please up-case this string');
//     // process.exit(0)
// });