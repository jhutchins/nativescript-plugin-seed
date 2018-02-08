var gradleBuild = require('child_process').spawn,
    gradleStop = require('child_process').spawn,
    path = require('path')
module.exports = (function () {
    function buildAar(dirArray) {
        let androidProjectDir = path.resolve(`${__dirname}/../src-native/android`).toString()
        return new Promise(function (resolve, reject) {
            let proc = gradleBuild(`./gradlew`, ['assembleRelease'], { cwd: androidProjectDir })

            proc.stdout.on('data', function (data) {
                resolve(data)
            })
            proc.stderr.on('data', function (data) {
                reject(data)
                gradleStop(`./gradlew`, ['--stop'], { cwd: androidProjectDir })
            })
            proc.on('close', function (data) {
                reject(data)
                gradleStop(`./gradlew`, ['--stop'], { cwd: androidProjectDir })
            })

            proc.stderr.pipe(process.stderr)
            proc.stdout.pipe(process.stdout)
        })
    }

    return {
        buildAar: buildAar
    }
})()