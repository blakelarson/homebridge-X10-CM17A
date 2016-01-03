var x10 = require('node-x10-comm');
var comm_name = "/dev/ttyUSB1";
var house_code = 0; //A
var module_code = 0; //01 

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-x10-cm17a", "X10", X10accessory);
}

function X10accessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.comm_port = config["comm_port"];

  this.service = new Service.Switch(this.name);

  var device = x10.device();
  device.open(comm_name, function() {
    device.sendCommand(house_code, module_code, 1, function() {
      console.log("Turned on device A01");
    }, function(err) {
      console.log("Unable to send to device");
    });
  }, function(err) {
    console.log(err);
  });
}

