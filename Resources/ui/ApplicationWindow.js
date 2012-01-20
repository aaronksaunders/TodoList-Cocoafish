function ApplicationWindow() {
	//load dependencies
	var TodoFormView = require('ui/TodoFormView'), TodoTableView = require('ui/TodoTableView'), network = require('services/network'), datastore = require('services/datastore');

	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		exitOnClose : true
	});

	//construct UI
	var todoForm = new TodoFormView();
	todoForm.top = 0;
	self.add(todoForm);

	var todoList = new TodoTableView();
	todoList.top = 60;
	self.add(todoList);

	//add behavior
	todoForm.addEventListener('todoSaved', function() {
		todoList.fireEvent('todosUpdated');
	});
	var saved = null; //Ti.App.Properties.getString('credentials');
	if(saved) {
		network.login(null, function(resp) {
			if(resp.success === false) {
				Ti.App.Properties.removeProperty('credentials');

				// @TODO - refactor
				var window, LoginWindow = require('ui/LoginWindow');
				window = new LoginWindow();

				//add behavior
				window.addEventListener('loggedIn', function() {
					todoList.fireEvent('todosUpdated');
				});

				window.open();
			} else {
				todoList.fireEvent('todosUpdated');
			}
		});
	} else {
		var window, LoginWindow = require('ui/LoginWindow');
		window = new LoginWindow();

		//add behavior
		window.addEventListener('loggedIn', function() {
			todoList.fireEvent('todosUpdated');
		});
		window.open();
	}

	//return instance from constructor
	return self;
}

module.exports = ApplicationWindow;
