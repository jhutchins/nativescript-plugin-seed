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

                let watcher = chokidar.watch(element, watcherOptions).on('all', (event, path) => {
                    nativeBuilder.buildAar()
                }).on("error", function (err) {
                    chokidar.close()
                    console.log(`Chokidar error:\n${err}`)
                })
                watchersArray.push(watcher)
            }
        })
    }

    function startTscWatch(dirArray) {
        if (!dirArray) {
            reject(new Error("No dirs passed to tsc watcher!"))
        }

        dirArray.forEach(element => {
            let proc = require("child_process", {
                cwd: __dirname
            }).spawn(`tsc`, ['-w', '-p', element], {
                stdio: ['inherit', 'inherit', 'inherit'] //stdin, stdout, stderr
            })

            proc.on('close', function (data) {
                console.log("Shutting down tsc process")
            })
        })
    }

    function stopWatchers() {
        console.log("\nStopping watchers!")
        watchersArray.forEach(watcher => {
            watcher.removeAllListeners()
            watcher.close()
        })
    }

    function stopTscWatcher() {
        console.log("\nStopping tsc watcher!")

    }

    return {
        startNativeWatch: startNativeWatch,
        startTscWatch: startTscWatch,
        stopWatchers: stopWatchers
    }
})()