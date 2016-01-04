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

  this.log("Registered X10accessory via log");

  this.service = new Service.Switch(this.name);

  this.service
    .getCharacteristic(Characteristic.On)
    .on('get', this.getState.bind(this));

  this.service
    .getCharacteristic(Characteristic.On)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));

  this.log("Completed registration of get/set state functions");

}

X10accessory.prototype.setState = function(powerOn, callback) {
  var accessory = this;
  var state = powerOn ? 1 : 0;

  this.log("setState called with powerOn = " + powerOn);

  var device = x10.device();
  device.open( accessory.comm_name, function() {
    device.sendCommand( accessory.house_code, accessory.module_code, state, function() {
      this.log("Turned on device");
    }, function(err) {
      this.log("Unable to send to device");
    });
  }, function(err) {
    this.log(err);
  });
}

X10accessory.prototype.getState = function(callback) {
  var accessory = this;

  this.log("Getting current state");

  var state = 1;
  callback(null, state);
}

X10accessory.prototype.getServices = function() {
/*  var informationService = new Service.AccessoryInformation();
  var switchService = new Service.Switch(this.name);

  this.log("Someone's calling the getServices function");

  informationService
  .setCharacteristic(Characteristic.Manufacturer, 'X10')
  .setCharacteristic(Characteristic.Model,        'Firecracker')
  .setCharacteristic(Characteristic.SerialNumber, '10001');

  var characteristic = switchService.getCharacteristic(Characteristic.On)
  .on('set', this.setState.bind(this));

  if (this.stateCommand) {
    characteristic.on('get', this.getState.bind(this))
  };

  this.log("finished getServices");
  return [switchService];
*/
  return [this.service];
}

