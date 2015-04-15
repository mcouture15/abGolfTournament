var Stripe = require('stripe');
var SECRET_KEY = 'sk_test_GwidMDFTUicUGVkBpa8bsFvR';
var Transaction = Parse.Object.extend('transactions');

Parse.Cloud.define('charge', function(req, res) {
	Stripe.initialize(SECRET_KEY);
	stripe_charge(req, res);
});

function stripe_charge(req, res) {
	var quantity = req.params.quantity || 1;
	Stripe.Charges.create({
		// amount: 100 * 45 * req.params.quantity, // $10 expressed in cents
		amount: 100 * (45 + 1.65) * quantity,
		source: req.params.token, // the token id should be sent from the client
		currency: 'cad'
	},{
		success: function(httpResponse) {
			var transaction = new Transaction();
			transaction.save({
				quantity: quantity,
				email: req.params.email
			}, {
				success: function(transaction) {
					res.success(transaction.id);
				},
				error: function(transaction, err) {
					res.error(err);
				}
			});
		},
		error: function(httpResponse) {
			res.error('Uh oh, something went wrong');
		}
	});
}
