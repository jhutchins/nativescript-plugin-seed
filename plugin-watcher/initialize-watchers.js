let pluginWatcher = require("./main-watcher"),
    path = require("path"),
    DEFAULT_PATH_TO_NATIVE_PROJECT = "src-native/android/src",
    DEFAULT_PATH_TO_TSC_FILES = "src",
    DEFAULT_PATH_TO_LEGACY_RESOURCES = `${DEFAULT_PATH_TO_TSC_FILES}/platforms/android`,
    srcNativeDirs = [
        path.resolve(process.cwd(), `../${DEFAULT_PATH_TO_NATIVE_PROJECT}`),
        path.resolve(process.cwd(), `../${DEFAULT_PATH_TO_LEGACY_RESOURCES}`)
    ],
    srcTscDirs = [
        path.resolve(process.cwd(), `../${DEFAULT_PATH_TO_TSC_FILES}`),
    ],
    CONFIG_FILE_NAME = "pluginwatcher.config.json",
    configFilePath = `${process.cwd()}/${CONFIG_FILE_NAME}`,
    config = undefined
try{
    config = require(configFilePath)
    if(config) {
        console.info(`Using config file: ${configFilePath}`)
        if(config.nativeDirs) {
            srcNativeDirs = config.nativeDirs
        }
        if(config.typescriptDirs) {
            srcTscDirs = config.typescriptDirs
        }
    }
} catch(e) {
    console.info(`Couldn't load config file: ${configFilePath}. Default paths will be used!`)
}

pluginWatcher.startNativeWatch(srcNativeDirs)
pluginWatcher.startTscWatch(srcTscDirs)

process.on('SIGINT', function () {
    pluginWatcher.stopWatchers()
    process.exit(0)
})