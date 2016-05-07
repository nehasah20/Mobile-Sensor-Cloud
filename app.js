
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
var app = express();
var sensorManager = require('./routes/SensorManager')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/getSensorTypes', sensorManager.getSensorTypes);
app.post('/register', routes.register);
app.post('/login', routes.validateUser);
app.post('/getSensorLatestData', sensorManager.getSensorLatestData);
app.post('/addStation', sensorManager.addStation);
app.post('/editStation', sensorManager.editStation);
app.post('/deleteStation', sensorManager.deleteStation);
app.get('/getStationList', sensorManager.getStationList);
app.post('/addSensor', sensorManager.addSensor);
app.post('/editSensor', sensorManager.editSensor);
app.post('/deleteSensor', sensorManager.deleteSensor);
app.post('/retreiveSelectedSensorTypeStations', sensorManager.showSelectedSensorTypeStations)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});