var mqtt = require('mqtt');
const token = "XEwPLFpmQq2bHe57U6UB";
const ericssonHost = "iotmanager4.westeurope.cloudapp.azure.com";
var timeout;
var publishInterval = 10; //second
console.log('Connecting');
var client = mqtt.connect('mqtt://' + ericssonHost, {
        username: token,
        port: 1883
    });
    
client.on('connect', function () {    console.log('Client connected!');

    console.log('Uploading data per ' + publishInterval + ' seconds...');
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setInterval(publishTelemetry, publishInterval * 1000);
});
function publishTelemetry() {
    var data = getData();
    console.log('Sending: ' + data);
    client.publish('v1/devices/me/telemetry', data);
}

var sensor = require("node-dht-sensor").promises;

sensor.setMaxRetries(10);
sensor.initialize(22, 4);
 
var temp; 
var hum;

function publish(){
console.log(
      `temp: ${temp}°C, ` +
        `humidity: ${hum}%`
    );
}

setTimeout(publish,1000);

function getData() {
    var data = {
            "temperature": temp,
            "humidity": hum
        };
    sensor.read(22, 4).then(
        function(res) {
            temp = res.temperature.toFixed(1);
            hum = res.humidity.toFixed(1);
        },
        function(err) {
            console.error("Failed to read sensor data:", err);
        }
    );

    return JSON.stringify(data);
}
