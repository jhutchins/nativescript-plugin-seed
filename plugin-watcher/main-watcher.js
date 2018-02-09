let chokidar = require('chokidar'),
    nativeBuilder = require('./native-builder')

module.exports = (function () {
    const PLATFORMS_ANDROID = 'platforms/android'
    let watchersArray = []

    function startNativeWatch(dirArray) {
        if (!dirArray) {
            reject(new Error('No dirs passed to native watcher!'))
        }

        dirArray.forEach(element => {
            if (element.endsWith(PLATFORMS_ANDROID)) {
                //TODO: plamen5kov: discuss better warning with the plugins team
                console.warn(`\nPlugin watcher can't handle "${element}" folder.\nIf you are looking for a way to edit the AndroidManifest.xml or resources folder, please go to "src-native/android/src" and eddit all files there.`)
            } else {
                const watcherOptions = {
                    ignoreInitial: true,
                    awaitWriteFinish: {
                        pollInterval: 100,
                        stabilityThreshold: 500
                    },
                    persistent: true,
                    ignored: ['**/.*', '.*'] // hidden files
                }

                let watcher = chokidar.watch(element, watcherOptions).on('all', (event, path) => {
                    nativeBuilder.buildAar()
                }).on('error', function (err) {
                    chokidar.close()
                    console.log(`Chokidar error:\n${err}`)
                })
                watchersArray.push(watcher)
            }
        })
    }

    function stopWatcher() {
        console.log('\nStopping watchers!')
        watchersArray.forEach(watcher => {
            watcher.removeAllListeners()
            watcher.close()
        })
    }

    return {
        startNativeWatch: startNativeWatch,
        stopWatchers: stopWatcher
    }
})()