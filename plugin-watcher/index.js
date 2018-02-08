if (process.argv.indexOf("--watch") != -1) {
  let spawn = require('child_process').spawn;
  let child = spawn('node', [`${__dirname}/initialize-watchers.js`], {
    detached: false,
    stdio: ['inherit', 'inherit', 'inherit'] // child inherits stdin, stdout, stderr
  });

  child.unref() //don't block parent loop
} else {
  let nativeBuilder = require("./native-builder")

  nativeBuilder.buildAar()
}