var fs = require('fs');
var bleno = require('./bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var EchoCharacteristic = require('./characteristic');
var ftp = require('./ftp');
console.log('bleno - echo');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('ZELDA', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'ec00',
        characteristics: [
          new EchoCharacteristic()
        ]
      })
    ]);
  }
});

// fs.watch('./zelda.log', {
// 	    persistent : true,
// 	    interval : 15000
//     } ,
// 	function(event, filename) {
// 	    ftp.put();
// });
