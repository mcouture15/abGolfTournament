var Stripe = require('stripe');
var SECRET_KEY = 'sk_test_GwidMDFTUicUGVkBpa8bsFvR';

Parse.Cloud.define('charge', function(req, res) {
	Stripe.initialize(SECRET_KEY);
	stripe_charge(req, res);

	// charge_id = ch_15rfVGFMPUOlSJVlBL0CGNSG
	// Stripe.Charges.retrieve('ch_15rfVGFMPUOlSJVlBL0CGNSG'
	// , {
	// 	success: function(httpResponse) {
	// 		response.success('Found it!');
	// 	},
	// 	error: function(httpResponse) {
	// 		response.error('Uh oh, something went wrong');
	// 	}
	// });
});

function stripe_charge(req, res) {
	Stripe.Charges.create({
		// amount: 100 * 45 * req.params.quantity, // $10 expressed in cents
		amount: 100 * 45,
		source: req.params.token, // the token id should be sent from the client
		currency: 'cad'
		// email: req.params.email
	},{
		success: function(httpResponse) {
			res.success('Purchase made!');
		},
		error: function(httpResponse) {
			res.error('Uh oh, something went wrong');
		}
	});
}
