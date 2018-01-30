var fs = require('fs');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');
var exec = require('child_process').exec;

console.log('Preparing native Android project...');

var srcNativeAndroid = "../src-native/android/";

copyPlatformsFiles();

function copyPlatformsFiles() {
    var srcPath = "platforms/android/",
        destPath = srcNativeAndroid + "/src/main/";

    if (fs.existsSync(srcPath + "AndroidManifest.xml") || fs.existsSync(srcPath + "java") || fs.existsSync(srcPath + "jni") ||
        fs.existsSync(srcPath + "res")) {
        ncp(srcPath, destPath);
        var includeGradle = destPath + "include.gradle";
        if (fs.existsSync(includeGradle)) {
            rimraf(includeGradle);
        }
        compileProject();
    } else {
        finishBuild();
    }
}

function compileProject() {
    exec('sh gradlew assembleRelease', { cwd: srcNativeAndroid }, function (err, stdout, stderr) {
        if (err) {
            console.log(err);
        }

        console.log("Building native Android project complete.");
        finishBuild();
    });
}

function finishBuild() {
    process.exit();
}