function LoginWindow() {

	// Dependencies
	var network = require('services/network')

	var self = Ti.UI.createWindow({
		modal : true,
		title : 'TodoApp Login',
		backgroundColor : '#fff'
	})

	var scrollView = Ti.UI.createScrollView({
		backgroundColor : '#fff',
		layout : 'vertical'
	});

	var unField = Titanium.UI.createTextField({
		hintText : 'E-mail',
		height : '40dp',
		left : '20dp',
		right : '20dp',
		top : '20dp',
		paddingLeft : 5,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
	});

	var pwdField = Titanium.UI.createTextField({
		hintText : 'Password',
		height : '40dp',
		left : '20dp',
		right : '20dp',
		top : '10dp',
		paddingLeft : 5,
		passwordMask : true,
		returnKeyType : Titanium.UI.RETURNKEY_GO,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
	});
	unField.value = "fred@test.com";
	pwdField.value = "fred"

	var loginButton = Ti.UI.createButton({
		title : 'Login',
		height : '40dp',
		left : '40dp',
		right : '40dp',
		top : '20dp',
		paddingLeft : 5
	})

	var registerButton = Ti.UI.createButton({
		title : 'Register',
		height : '40dp',
		left : '40dp',
		right : '40dp',
		top : '10dp',
		paddingLeft : 5
	})

	loginButton.addEventListener('click', function() {
		network.login({
			login : unField.value,
			password : pwdField.value
		}, function(data) {
			if(data.success === false) {
				alert('error logging in');
			} else {
				self.fireEvent('loggedIn');
				self.close();
			}
		})
	})

	registerButton.addEventListener('click', function() {
		network.createAccount({
			username : unField.value,
			password : pwdField.value
		}, function(data) {
			if(data.success) {
				self.fireEvent('loggedIn');
				self.close();
			} else {
				alert('error creating account');
			}
		})
	})

	scrollView.add(unField);
	scrollView.add(pwdField);
	scrollView.add(loginButton);
	scrollView.add(registerButton);

	self.add(scrollView)

	return self;
}

module.exports = LoginWindow;
