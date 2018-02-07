var pluginWatcher = require("./main-watcher"),
    path = require("path")

//TODO: plamen5kov: add logic to find config file inside process.cwd() and if not found use hardcoded path

var pathToNativeProject = "src-native/android",
    pathToTscFiles = "src",
    pathToPluginOldResourcesDir = `${pathToTscFiles}/platforms/android`,
    srcNativeDirs = [
        path.resolve(process.cwd(), `../${pathToNativeProject}`),
        path.resolve(process.cwd(), `../${pathToPluginOldResourcesDir}`)
    ],
    srcTscDirs = [
        path.resolve(process.cwd(), `../${pathToTscFiles}`),
    ]


pluginWatcher.startNativeWatch(srcNativeDirs).then(function (data) {
    console.log(data)
}, function (err) {
    console.log(err)
})

pluginWatcher.startTscWatch(srcTscDirs)

process.on('SIGINT', function () {
    console.log("SIGINT")
    process.exit(0)
});

process.on('SIGTERM', function () {
    console.log("Caught interrupt signal");
    pluginWatcher.stopNativeWatcher()
    process.exit(0)
});

// process.once('beforeExit', function () {
//     console.log("Caught interrupt signal");
//     pluginWatcher.stopNativeWatcher()
//     process.exit(0)
// });