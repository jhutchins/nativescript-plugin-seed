var exec = require('child_process').exec,
    path = require('path')
module.exports = (function () {
    function buildAar(dirArray) {
        let androidProjectDir = path.resolve(`${__dirname}/../src-native/android`).toString()
        return new Promise(function (resolve, reject) {
            let proc = exec(`./gradlew assembleRelease`, {
                    cwd: androidProjectDir
                },
                function (err, data) {
                    if (err) {
                        return reject(err)
                    }
                    resolve(data)
                })

            proc.stderr.pipe(process.stderr)
            proc.stdout.pipe(process.stdout)
        })
    }

    return {
        buildAar: buildAar
    }
})()