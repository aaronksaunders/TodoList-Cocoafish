//load dependencies
var Todo = require('model/Todo');
var COCOAFISH_APPLICATION_KEY = "9c7OpOUMIaChxK8P5sSBIc51CzN9y5Bo";

// get credentials
var saved = Ti.App.Properties.getString('credentials');

exports.currentUser = function() {
	return JSON.parse(Ti.App.Properties.getString('credentials'));
}

exports.login = function(_creds, _callback) {
	var creds = _creds || JSON.parse(saved);

	this.doAPICall({
		"method" : "POST",
		"call" : "https://api.cocoafish.com/v1/users/login.json",
		"params" : {
			"login" : creds.login,
			"password" : creds.password
		}
	}, function(resp) {
		if(resp.success === true) {

			// get the user object
			var respObject = JSON.parse(resp.response);
			var user = respObject.response.users[0];

			// save credentials
			Ti.App.Properties.setString('credentials', JSON.stringify({
				"login" : creds.login,
				"password" : creds.password,
				"id" : user.id
			}));
		}

		_callback(resp);

	})
}
exports.createAccount = function(_creds, _callback) {

	this.doAPICall({
		"method" : "POST",
		"call" : "https://api.cocoafish.com/v1/users/create.json",
		"params" : {
			"username" : _creds.username,
			"email" : _creds.username,
			"password" : _creds.password,
			"password_confirmation" : _creds.password
		}
	}, function(resp) {
		if(resp.success === true) {

			// save credentials
			Ti.App.Properties.setString('credentials', JSON.stringify({
				"login" : _creds.username,
				"password" : _creds.password
			}));
		}

		_callback(resp);

	})
}
//implement service interface
exports.getList = function(callback) {
	var xhr = Ti.Network.createHTTPClient();
	xhr.onload = function() {
		var data = JSON.parse(this.responseText), todos = [];

		for(var i = 0, l = data.length; i < l; i++) {
			var todo = new Todo(data[i].todo);
			todos.push(todo);
		}

		//call callback function with an array of Todos
		callback.call(this, todos);
	};
	xhr.open('GET', 'http://titaniumtodos.appspot.com/todos');
	xhr.send();
};

exports.doAPICall = function(args, callback) {
	var that = this;
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(r) {
		Titanium.API.error(xhr.responseText);
		callback({
			"success" : false,
			"response" : xhr.responseText,
			"error" : r
		});
	};
	xhr.onload = function() {
		Titanium.API.info("APICall success \n" + xhr.responseText);
		callback({
			"success" : true,
			"response" : xhr.responseText
		});
	};
	if(args.method == 'PUT' || args.method == 'POST') {
		xhr.open(args.method, args.call + "?key=" + COCOAFISH_APPLICATION_KEY);
		xhr.send(args.params);
	} else {
		var body = args.call + "?key=" + COCOAFISH_APPLICATION_KEY + "&";
		var paramMap = args.params || {};
		for(var a in paramMap) {
			body += Titanium.Network.encodeURIComponent(a) + '=' + (paramMap[a] ? Titanium.Network.encodeURIComponent(paramMap[a]) : "") + '&';
		}
		xhr.open(args.method, body);
		xhr.send();
	}
};
