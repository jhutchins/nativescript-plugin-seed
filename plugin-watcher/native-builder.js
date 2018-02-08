let gradleBuild = require('child_process').spawn,
    gradleStop = require('child_process').spawn,
    path = require('path')

module.exports = (function () {
    function buildAar(dirArray) {
        let androidProjectDir = path.resolve(`${__dirname}/../src-native/android`).toString()

        let proc = gradleBuild(`./gradlew`, ['assembleRelease'], {
            cwd: androidProjectDir,
            stdio: ['inherit', 'inherit', 'inherit'] //stdin, stdout, stderr
        })

        proc.on('close', function (data) {
            console.log("STOPING DEAMONS GRADLE!")
            gradleStop(`./gradlew`, ['--stop'], { cwd: androidProjectDir })
        })
    }

    return {
        buildAar: buildAar
    }
})()