$(function() {
	Parse.initialize(
		'Yfj9RlamVjaC4pzsmlxpgJDubjrclBF2c1euYJRs',
		'i1uz71A2H7Vi9oFOWNMS0q6M1YisFLdA90eEFsFT'
	);
	var handler;

	function setupStripe() {

		handler = StripeCheckout.configure({
			key: 'pk_test_TLxz9k2Ooxu3rUL0uNY8ljrH',
			image: '/img/documentation/checkout/marketplace.png',
			allowRememberMe: false,
			currency: 'cad',
			token: function(token) {
				// Use the token to create the charge with a server-side script.
				chargeCard(token);
			}
		});

		// Close Checkout on page navigation
		$(window).on('popstate', function() {
			handler.close();
		});
	}

	function chargeCard(token) {
		Parse.Cloud.run('charge', {
			token: token.id,
			email: token.email
		}, {
			success: function(res) {
				toastr.success('Purchase Success! Here is your Transaction ID: ' + res);
			},
			error: function(err) {
				toastr.error('An error occured, please try again');
				console.error('cloud_err=', err);
			}
		});
	}

	function setupClicks() {
		$('header a').on('click', goToSection);

		$('#buyTicket').on('click', function(e) {
			// Open Checkout with further options
			handler.open({
				name: 'AB Memorial Golf Tournament',
				description: '1 Ticket',
				amount: 4500 + 165
			});
			e.preventDefault();
		});
	}

	function setupToastr() {
		toastr.options = {
			'closeButton': true,
			'debug': false,
			'newestOnTop': false,
			'progressBar': false,
			'positionClass': 'toast-top-center',
			'preventDuplicates': false,
			'onclick': null,
			'showDuration': '300',
			'hideDuration': '1000',
			'timeOut': '0',
			'extendedTimeOut': '0',
			'showEasing': 'swing',
			'hideEasing': 'linear',
			'showMethod': 'fadeIn',
			'hideMethod': 'fadeOut',
			'tapToDismiss': false
		}
	}

	function goToSection(e) {
		e.preventDefault();
		$('html, body').animate(
			{
				scrollTop: $('#' + $(e.target).attr('label-for')).offset().top
			},
			'slow'
		);
	}
	setupClicks();
	setupStripe();
	setupToastr();
	console.log('ready');
});
