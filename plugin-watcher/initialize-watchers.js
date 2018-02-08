let pluginWatcher = require('./main-watcher'),
    path = require('path'),
    config = null

const DEFAULT_PATH_TO_NATIVE_PROJECT = 'src-native/android/src',
    DEFAULT_PATH_TO_TSC_FILES = 'src',
    DEFAULT_PATH_TO_LEGACY_RESOURCES = `${DEFAULT_PATH_TO_TSC_FILES}/platforms/android`,
    DEFAULT_NATIVE_DIRS = [
        path.resolve(process.cwd(), `../${DEFAULT_PATH_TO_NATIVE_PROJECT}`),
        path.resolve(process.cwd(), `../${DEFAULT_PATH_TO_LEGACY_RESOURCES}`)
    ],
    DEFAULT_TSC_DIRS = [
        path.resolve(process.cwd(), `../${DEFAULT_PATH_TO_TSC_FILES}`),
    ],
    CONFIG_FILE_NAME = 'pluginwatcher.config.json',
    CONFIG_FILE_PATH = `${process.cwd()}/${CONFIG_FILE_NAME}`

try {
    config = require(CONFIG_FILE_PATH)
    if (config) {
        console.info(`Using config file: ${CONFIG_FILE_PATH}`)
        if (!config.nativeDirs) {
            config.typescriptDirs = DEFAULT_NATIVE_DIRS
        }
        if (!config.typescriptDirs) {
            config.typescriptDirs = DEFAULT_TSC_DIRS
        }
    }
} catch (e) {
    console.info(`Couldn't load config file: ${CONFIG_FILE_PATH}. Default paths will be used!`)
}

pluginWatcher.startNativeWatch(config.nativeDirs)
pluginWatcher.startTscWatch(config.typescriptDirs)

process.on('SIGINT', function () {
    pluginWatcher.stopWatchers()
    process.exit(0)
})