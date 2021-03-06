var users = [];
var station = [];
var mongo = require("./mongo");
var mongoURL = "mongodb://ec2-52-35-61-80.us-west-2.compute.amazonaws.com:27017/sensor";

exports.index = function(req, res){
	res.render('index');
};

exports.partials = function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};

exports.getCurrentUser = function(req, res){
	console.log(req.session.userid);
	res.send(req.session.userid);
}

exports.logout = function(req,res)
{
	req.session.destroy();
	res.send("success");
};

exports.register = function (req, res) {
	var email , pwd  , firstname, lastname  ;
	firstname = req.body.firstName;
	lastname = req.body.lastName;
	email = req.body.email;
	pwd = req.body.password;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		var count = 0;
		coll.insert({firstname: firstname, lastname:lastname, email:email, password : pwd , stationInfo : [], counter : count }, function(err, user){
			if (user) {
				console.log( "Inserted Id " + user.insertedIds);
				req.session.userid=email;
				console.log("Successful Registration");
				res.send("Registration Successful");

			} else {
				console.log("Invalid Registration");
				res.send("Registration UnSuccessful");
			}
		});
	});
};

exports.validateUser = function(req, res){
	var username , password;
	username = req.body.username;
	password = req.body.password;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		if(username == 'admin' && password == 'admin'){
			console.log("admin it is");
			req.session.userid='admin';
			res.send({message:'Login Successful',userType:"admin"});
		}else{
			coll.findOne({email: username, password:password }, function(err, user){
				if (user) {
					console.log( "Inserted Id " + user.insertedIds);
					req.session.userid=user.email;
					console.log("Successful Login" + req.session.userid );
					res.send({message:'Login Successful',userType:"endUser"});

				} else {
					console.log("Invalid Registration");
					res.send({message:'Login Unsuccessful'});
				}
			});
		}
	});
};
