var x10 = require('node-x10-comm');

//var comm_name = "/dev/ttyUSB1";
//var house_code = 0; //A
//var module_code = 0; //01 

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-x10-cm17a", "X10", X10accessory);
}

function X10accessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.comm_port = config["comm_port"];
  this.house_code = config["house_code"];
  this.module_code = config["module_code"];

//  this.service = new Service.Switch(this.name);

}

X10accessory.prototype.setState = function(powerOn, callback) {
  var accessory = this;
  var state = powerOn ? 1 : 0;

  var device = x10.device();
  device.open( accessory.comm_name, function() {
    device.sendCommand( accessory.house_code, accessory.module_code, state, function() {
      console.log("Turned on device");
    }, function(err) {
      console.log("Unable to send to device");
    });
  }, function(err) {
    console.log(err);
  });
}

X10accessory.prototype.getState = function(callback) {
  var accessory = this;

  var state = 'on';
}

X10accessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  var switchService = new Service.Switch(this.name);

  informationService
  .setCharacteristic(Characteristic.Manufacturer, 'X10')
  .setCharacteristic(Characteristic.Model,        'Firecracker')
  .setCharacteristic(Characteristic.SerialNumber, '10001');

  var characteristic = switchService.getCharacteristic(Characteristic.On)
  .on('set', this.setState.bind(this));

  if (this.stateCommand) {
    characterist.on('get', this.getState.bind(this))
  };

  return [switchService];

}

