var fs = require('fs');
console.log('logs - echo');

var logBody = 'default log\n';
var writeLog = function () {
    fs.appendFile('./zelda.log', logBody, encoding='utf8', function (err) {
	    if (err) throw err;
    });
}
var setBody = function (body) {
    logBody = body + '\n';
}
//writeLog();

module.exports.setBody  = setBody;
module.exports.writeLog = writeLog;

