var Stripe = require('stripe');
var SECRET_KEY = 'sk_test_GwidMDFTUicUGVkBpa8bsFvR';
var Transaction = Parse.Object.extend('transactions');

Parse.Cloud.define('charge', function(req, res) {
	Stripe.initialize(SECRET_KEY);
	stripe_charge(req, res);
});

function stripe_charge(req, res) {
	var opts = {
		amount: req.params.amount || 4500,
		email: req.params.email,
		firstName: req.params.firstName,
		lastName: req.params.lastName,
		quantity: req.params.quantity || 1,
		token: req.params.token
	}

	Stripe.Charges.create({
		amount: opts.amount,
		currency: 'cad',
		source: opts.token, // the token id should be sent from the client
		receipt_email: opts.email,
		metadata: {
			amount: opts.amount,
			email: opts.email,
			firstName: opts.firstName,
			lastName: opts.lastName,
			quantity: opts.quantity,
		}
	},{
		success: function(httpResponse) {
			var transaction = new Transaction();
			transaction.save({
				quantity: opts.quantity,
				email: opts.email,
				firstName: opts.firstName,
				lastName: opts.lastName
			}, {
				success: function(transaction) {
					res.success(transaction.id);
				},
				error: function(transaction, err) {
					// parse errored but transaction was success
					res.success(transaction.id);

					console.log('ERROR', err);
					var t = new Transaction();
					transaction.save({
						quantity: parseInt(opts.quantity),
						email: opts.email,
						firstName: opts.firstName,
						lastName: opts.lastName
					}), {
						success: function(httpRequest) {
							console.log('Second Attempt Successful');
						},
						error: function(httpRequest) {
							console.error('Second Attempt FAILED', transaction.id);
						}
					};
				}
			});
		},
		error: function(httpResponse) {
			console.log('FOO', httpResponse);
			res.error('Uh oh, something went wrong', httpResponse);
		}
	});
}
