var Stripe = require('stripe');
var Transaction = Parse.Object.extend('transactions');

Parse.Cloud.define('charge', function(req, res) {
	Parse.Config.get().then(function(config) {
		var stripe_sk = config.get('stripe_sk');
		config_cb(req, res, stripe_sk);
	}, function(err) {
		console.log('Failed to fetch config');
		var config = Parse.Config.current();
		var stripe_sk = config.get('stripe_sk');
		if (stripe_sk == undefined) {
			res.error('Could not load config.');
		} else {
			config_cb(req, res, key);
		}
	});
});


function config_cb(req, res, key) {
	Stripe.initialize(key);
	stripe_charge(req, res);
}

function stripe_charge(req, res) {
	var opts = {
		amount: req.params.amount,
		email: req.params.email,
		firstName: req.params.firstName,
		lastName: req.params.lastName,
		quantityGolf: req.params.quantityGolf,
		quantityDinner: req.params.quantityDinner,
		quantityBoth: req.params.quantityBoth,
		token: req.params.token
	}

	console.log(opts);
	// if (parseInt(opts.quantityDinner) > 0) {
	// 	res.error('There are no more Banquet-Only Tickets Your' +
	// 		' Credit Card has not been charged'
	// 	);
	// }
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
			quantityGolf: parseInt(opts.quantityGolf),
			quantityDinner: parseInt(opts.quantityDinner),
			quantityBoth: parseInt(opts.quantityBoth)
		}
	}, {
		success: function(httpResponse) {
			// save successful transaction to Parse
			var transaction = new Transaction();
			var saveOpts = {
				quantityGolf: opts.quantityGolf,
				quantityDinner: opts.quantityDinner,
				quantityBoth: opts.quantityBoth,
				email: opts.email,
				firstName: opts.firstName,
				lastName: opts.lastName
			}
			transaction.save(saveOpts, {
				success: function(transaction) {
					res.success(transaction.id);
				},
				error: function(transaction, err) {
					// parse errored but transaction was success
					res.success(transaction.id);

					console.log('ERROR', err);

					// try again
					transaction.save(saveOpts, {
						success: function(httpRequest) {
							console.log('Second Attempt Successful');
						},
						error: function(httpRequest) {
							console.error('Second Attempt FAILED', transaction.id);
						}
					});
				}
			});
		},
		error: function(httpResponse, err) {
			console.log('FOO \n' + httpResponse + '\n' + err);
			res.error('Uh oh, something went wrong. Your Credit Card has not been charged', httpResponse);
		}
	});
}
