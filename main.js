let parser = require('./ParseManualPage');
var args = process.argv.slice(2);
var path = require('path');

const fs = require('fs');
fs.readdir(args[0], (err, files) => {
    files.forEach(file => {

        var filePath = path.join(__dirname, args[0] + '/' + file);

        if(filePath.split('.').pop() === 'xml') {

            parser(filePath, function(fileName) {

                console.log(fileName);
                var exec = require('child_process').exec

                exec('asciidoctor -r ./csound-block-macro.rb -b html5 -a stylesheet=../stylesheets/foundation.css ' + fileName, function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    console.log('error: ' + error);
                });
            });

        }
    });
})
