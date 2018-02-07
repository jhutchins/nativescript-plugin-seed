var chokidar = require('chokidar');

module.exports = (function () {
    const PLATFORMS_ANDROID = "platforms/android"
    let watchersArray = [];

    function startNativeWatch(dirArray) {
        return new Promise(function (resolve, reject) {
            if (!dirArray) {
                reject(new Error("No dirs passed to native watcher!"))
            }

            dirArray.forEach(element => {
                if (element.endsWith(PLATFORMS_ANDROID)) {
                    console.log("we need to warn that the files are not in the propper place and ask the user to move them to src-native/android ... ")
                } else {

                    var watcher = chokidar.watch(element, {
                        // One-liner for current directory, ignores .dotfiles
                        ignored: /(^|[\/\\])\../,
                        persistent: true
                    }).on('all', (event, path) => {
                        require("./native-builder").buildAar().then(function () {
                            resolve(path)
                        }, function (err) {
                            reject(err)
                        })
                    }).on("error", function (err) {
                        chokidar.close();
                        console.log(`Chokidar error:\n${err}`)
                    })
                    watchersArray.push(watcher);
                }
            })
        })
    }

    function startTscWatch(dirArray) {
        return new Promise(function (resolve, reject) {
            if (!dirArray) {
                reject(new Error("No dirs passed to tsc watcher!"))
            }

            dirArray.forEach(element => {
                let proc = require("child_process", {
                    cwd: __dirname
                }).exec(`tsc -w -p ${element}`, function (data, err) {
                    if (err) {
                        return reject(err)
                    }
                    resolve(data)
                })
                proc.stderr.pipe(process.stderr)
                proc.stdout.pipe(process.stdout)
            });
        })
    }

    function stopNativeWatcher() {
        console.log("Stopping native watcher listeners!")
        watchersArray.forEach(watcher => {
            watcher.removeAllListeners()
            watcher.close()
        });
    }

    return {
        startNativeWatch: startNativeWatch,
        startTscWatch: startTscWatch,
        stopNativeWatcher: stopNativeWatcher
    }
})()