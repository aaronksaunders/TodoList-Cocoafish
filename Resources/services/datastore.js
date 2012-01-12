//load dependencies
var Todo = require('model/Todo');

//bootstrap datastore
var saved = Ti.App.Properties.getString('db');
var datastore = (saved) ? JSON.parse(saved) : [];
var COCOAFISH_APPLICATION_KEY = "9c7OpOUMIaChxK8P5sSBIc51CzN9y5Bo";

exports.login = function() {
	doAPICall({
		"method" : "POST",
		"call" : "https://api.cocoafish.com/v1/users/login.json",
		"params" : {
			"login" : "aaron@clearlyinnovative.com",
			"password" : "password"
		}
	}, function(resp) {
		if(resp.success === true) {
			alert("Logged In");
		}

	})
}
//implement service interface
exports.getList = function(_callback) {
	query(_callback);
};
//save a Todo object to our data store
exports.saveTodo = function(todo, _callback) {
	if(todo.guid) {
		update(todo, _callback);
	} else {
		todo.guid = new Date().getTime();
		save(todo, _callback);
	}
};
function query(_callback) {

	doAPICall({
		"method" : "GET",
		"call" : "https://api.cocoafish.com/v1/objects/todo/query.json",
		"params" : {}
	}, function(resp) {
		if(resp.success === true) {
			var obj = JSON.parse(resp.response)
			_callback(obj.response.todo);
		}

	})
}

function save(todo, _callback) {

	doAPICall({
		"method" : "POST",
		"call" : "https://api.cocoafish.com/v1/objects/todo/create.json",
		"params" : {
			"fields" : JSON.stringify(todo)
		}
	}, function(resp) {
		if(resp.success === true) {
			alert("Saved Item");
		}
		_callback();
	})
}

function update(todo, _callback) {
	doAPICall({
		"method" : "PUT",
		"call" : "https://api.cocoafish.com/v1/objects/todo/update.json",
		"params" : {
			"id" : todo.id,
			"class_name" : "todo",
			"fields" : JSON.stringify(todo)
		}
	}, function(resp) {
		if(resp.success === true) {
			alert("Updated Item");
		}
		_callback();
	})
}

function doAPICall(args, callback) {
	var that = this;
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(r) {
		Titanium.API.error(xhr.responseText);
		callback({
			"success" : false,
			"response" : xhr.responseText,
			"error" : r
		});
		xhr.abort();
		xhr = null;
	};
	xhr.onload = function() {
		Titanium.API.info("APICall success \n" + xhr.responseText);
		callback({
			"success" : true,
			"response" : xhr.responseText
		});

		xhr.abort();
		xhr = null;

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