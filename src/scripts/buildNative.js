"use strict";

var fs = require('fs');
var copy = require('recursive-copy');
var rimraf = require('rimraf');
var exec = require('child_process').exec;
var path = require("path");
var xml2js = require("xml2js");

console.log('Preparing native Android project...');

var srcNativeAndroid = "../src-native/android/";

copyPlatformsFiles();

function copyPlatformsFiles() {
    var srcPath = "platforms/android/",
        destPath = srcNativeAndroid + "/src/main/";

    if (fs.existsSync(srcPath + "AndroidManifest.xml") || fs.existsSync(srcPath + "java") || fs.existsSync(srcPath + "jni") ||
        fs.existsSync(srcPath + "res")) {
        copy(srcPath, destPath, { overwrite: true }, function (err) {
            if (err) {
                console.error(err);
                finishBuild();
                return;
            }

            var includeGradle = destPath + "include.gradle";
            if (fs.existsSync(includeGradle)) {
                rimraf.sync(includeGradle);
            }
            updateManifest();
        });
    } else {
        finishBuild();
    }
}

function updateManifest() {
    var manifest = srcNativeAndroid + "src/main/AndroidManifest.xml";
    if (fs.existsSync(manifest)) {
        var content;
        try {
            content = fs.readFileSync(manifest, "utf8");
        } catch (err) {
            console.error("Failed to read the manifest file" + err);
            return finishBuild();
        }
        getXml(content).then(function (xml) {
            var pluginName;
            try {

                var packageJsonPath = path.join(__dirname, "../package.json");
                if (fs.existsSync(packageJsonPath)) {
                    var packageJsonContents = require(packageJsonPath);
                    pluginName = packageJsonContents ? packageJsonContents.name : "";
                }
            } catch (e) {
                console.error("Couldn't read package.json 'name' property of the plugin." + e);
            }

            pluginName = pluginName || "yourplugin";
            var packageName = "org.nativescript.";
            var shortPluginName = getShortPluginName(pluginName);
            packageName += shortPluginName;

            // if the manifest file is full-featured and declares settings inside the manifest scope
            if (xml.manifest) {
                if (xml.manifest["$"]["package"]) {
                    packageName = xml.manifest["$"]["package"];
                }

                // set the xml as the value to iterate over its properties
                xml = xml.manifest;
            }

            // if the manifest file doesn't have a <manifest> scope, only the first setting will be picked up 
            var newManifest = { manifest: {} };
            for (var prop in xml) {
                newManifest.manifest[prop] = xml[prop];
            }

            newManifest.manifest["$"]["package"] = packageName;

            var xmlBuilder = new xml2js.Builder();
            var newManifestContent = xmlBuilder.buildObject(newManifest);
            console.log("Updating manifest with package name " + packageName);
            try {
                fs.writeFileSync(manifest, newManifestContent);
            } catch (err) {
                console.error("Failed to write the manifest file " + err);
                return finishBuild();
            }

            compileProject();
        }).catch(function (err) {
            console.error("Failed to parse the manifest file" + err);
            finishBuild();
        });
    }
}

function compileProject() {
    exec('sh gradlew assembleRelease', { cwd: srcNativeAndroid }, function (err, stdout, stderr) {
        if (err) {
            console.error(err);
        }

        console.log("Building native Android project complete.");
        finishBuild();
    });
}

function finishBuild() {
    process.exit();
}

//helper
var NATIVESCRIPT_PLUGIN_PREFIX = "nativescript-";

function getXml(stringContent) {
    var parseString = xml2js.parseString;

    var promise = new Promise((resolve, reject) =>
        parseString(stringContent, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }));

    return promise;
}

function getShortPluginName(pluginName) {
    let shortPluginName = "";

    if (pluginName.indexOf("nativescript-") === 0) {
        shortPluginName = pluginName.substr(NATIVESCRIPT_PLUGIN_PREFIX.length);
    } else {
        shortPluginName = pluginName;
    }

    return sanitize(shortPluginName);
}

function sanitize(name) {
    return name.replace(/[\-_]/g, "");
}