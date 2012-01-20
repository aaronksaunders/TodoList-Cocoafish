//load dependencies
var Todo = require('model/Todo'), network = require('services/network');

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

	var userId = network.currentUser().id;
	network.doAPICall({
		"method" : "GET",
		"call" : "https://api.cocoafish.com/v1/objects/todo/query.json",
		"params" : {
			"where" : JSON.stringify({
				"user_id" : userId
			})
		}
	}, function(resp) {
		if(resp.success === true) {
			var obj = JSON.parse(resp.response)
			_callback(obj.response.todo);
		}

	})
}

function save(todo, _callback) {

	network.doAPICall({
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
	network.doAPICall({
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