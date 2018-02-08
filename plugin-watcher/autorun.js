let pluginWatcher = require("./main-watcher"),
    path = require("path")

//TODO: plamen5kov: add logic to find config file inside process.cwd() and if not found use hardcoded path


let pathToNativeProject = "src-native/android/src",
    pathToTscFiles = "src",
    pathToPluginOldResourcesDir = `${pathToTscFiles}/platforms/android`,
    srcNativeDirs = [
        path.resolve(process.cwd(), `../${pathToNativeProject}`),
        path.resolve(process.cwd(), `../${pathToPluginOldResourcesDir}`)
    ],
    srcTscDirs = [
        path.resolve(process.cwd(), `../${pathToTscFiles}`),
    ]

pluginWatcher.startNativeWatch(srcNativeDirs)

process.on('SIGINT', function () {
    pluginWatcher.stopNativeWatcher()
    process.exit(0)
})