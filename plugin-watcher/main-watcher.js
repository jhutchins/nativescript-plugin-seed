let chokidar = require('chokidar'),
    nativeBuilder = require("./native-builder")

module.exports = (function () {
    const PLATFORMS_ANDROID = "platforms/android"
    let watchersArray = []

    function startNativeWatch(dirArray) {
        if (!dirArray) {
            reject(new Error("No dirs passed to native watcher!"))
        }

        dirArray.forEach(element => {
            if (element.endsWith(PLATFORMS_ANDROID)) {
                console.log("we need to warn that the files are not in the propper place and ask the user to move them to src-native/android ... ")
            } else {
                const watcherOptions = {
                    ignoreInitial: true,
                    awaitWriteFinish: {
                        pollInterval: 100,
                        stabilityThreshold: 500
                    },
                    persistent: true,
                    ignored: ["**/.*", ".*"] // hidden files
                }

                var watcher = chokidar.watch(element, watcherOptions).on('all', (event, path) => {
                    console.log(`event: ${event} file changed: ${path}`)
                    nativeBuilder.buildAar().then(function (data) {
                        console.log(`choki resolve: ${data}`)
                    }, function (err) {
                        console.log(`choki reject ${err}`)
                    })
                }).on("error", function (err) {
                    chokidar.close()
                    console.log(`Chokidar error:\n${err}`)
                })
                watchersArray.push(watcher)
            }
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
            })
        })
    }

    function stopNativeWatcher() {
        console.log("\nStopping native watcher listeners!")
        watchersArray.forEach(watcher => {
            watcher.removeAllListeners()
            watcher.close()
        })
    }

    return {
        startNativeWatch: startNativeWatch,
        startTscWatch: startTscWatch,
        stopNativeWatcher: stopNativeWatcher
    }
})()