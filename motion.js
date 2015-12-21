var gpio = require('onoff').Gpio;
var mail = require('./mail');
var logs = require('./logs');
var dateFormat = require('dateformat');
console.log("motion - echo");

var wrptr = 0;
var pirSensor = [];
var MAXDEPTH = 16;
var onDate;


motion = new gpio(17, 'in', 'both');
for (var i=0; i <MAXDEPTH; i++) {
	pirSensor[i] = "010203040506070000";
}

function exit() {
	console.log("Terminated");
	motion.unexport();
	process.exit();
}

function getDateTime(date) {
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + month + day + hour + min + sec;
}

function getDelta(delta) {
    var temp;
    temp = (delta < 10) ? ("000" + delta) : (delta < 100) ? ("00" + delta) : 
		   (delta < 1000) ? ("0" + delta) : delta;
    return temp;
}

process.on('SIGINT', exit);

motion.watch(function(err, value) {
    var body, date, log;
	if (err) throw err;
    date = new Date();
	if (value==1) {
		onDate = date;
	} else {
		delta = Math.round(Math.abs(date - onDate) / 1000);
		log = getDateTime(date) + getDelta(delta); 
		pirSensor[wrptr] = log;
		body = dateFormat(date, "mmm dd, yyyy HH:MM:ss") + " - " + delta + " secs";
		mail.setBody(body);
		mail.sendMail();
		logs.setBody(log);
		logs.writeLog();
		wrptr = (wrptr + 1) % MAXDEPTH;
		console.log(log);
	}
});


module.exports = {
	getMAXDEPTH: function() {
		return MAXDEPTH;
	},
	getPirSensor: function(index) {
		return pirSensor[index];
	}
};
