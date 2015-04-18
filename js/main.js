$(function() {
	Parse.initialize(
		'Yfj9RlamVjaC4pzsmlxpgJDubjrclBF2c1euYJRs',
		'i1uz71A2H7Vi9oFOWNMS0q6M1YisFLdA90eEFsFT'
	);
	var amount,
			handler,
			q;

	function setupStripe() {
		handler = StripeCheckout.configure({
			key: 'pk_test_TLxz9k2Ooxu3rUL0uNY8ljrH',
			image: '/img/documentation/checkout/marketplace.png',
			allowRememberMe: false,
			currency: 'cad',
			token: chargeCard
		});

		// Close Checkout on page navigation
		$(window).on('popstate', function() {
			handler.close();
		});
	}

	function chargeCard(token) {
		// activate spinner
		$('#spinner').removeClass('hidden').spin();
		// Use the token to create the charge with a server-side script.
		Parse.Cloud.run('charge', {
			amount: amount,
			email: token.email,
			quantity: q,
			token: token.id
		}, {
			success: function(res) {
				$('#spinner').addClass('hidden').spin(false);
				toastr.success('Purchase Success! Here is your Transaction ID: ' + res);
			},
			error: function(err) {
				$('#spinner').addClass('hidden').spin(false);
				toastr.error('An error occured, please try again');
				console.error('cloud_err=', err);
			}
		});
	}

	function setupClicks() {
		$('header a').on('click', goToSection);

		$('#buyTicket').on('click', function() {
			// Open Checkout with further options
			$('#purchaseOverlay').show().addClass('active');
		});

		$('#purchaseClose').on('click', function() {
			$('#purchaseOverlay').removeClass('active');
		});

		$('#purchaseOverlay').on(
			'webkitTransitionEnd ' +
			'otransitionend ' +
			'oTransitionEnd ' +
			'msTransitionEnd ' +
			'transitionend'
		, function() {
			$('#purchaseOverlay').hide();
		});

		$('#purchase').on('click', function(e) {
			q = parseInt($('#quantity p').text());
			amount = Math.round(100 * ((45 + 1.35)*q + 0.3));
			handler.open({
				name: 'AB Memorial Golf Tournament',
				description: q + ' Ticket' + (q > 1 ? 's' : '') + ' @ $45 each + Service Charge',
				amount: amount
			});
			e.preventDefault();
			setTimeout(function() {
				$('#purchaseClose').trigger('click');
			}, 200);
		});

		$('.quantityChange').on('click', function(e) {
			if (e.target.classList.contains('disabled') || e.target.parentElement.classList.contains('disabled')) return;
			var val = parseInt($('#quantity p').text());

			if (e.target.id == 'increaseQuantity') {
				plus(val);
			} else if (e.target.id == 'decreaseQuantity') {
				minus(val);
			} else if (e.target.children[0].id == 'increaseQuantity') {
				plus(val);
			} else {
				minus(val);
			}
		});
	}

	function plus(val) {
		$('#quantity p').text(val + 1);
		if (val == 1) $('.quantityChange:first-child').removeClass('disabled');
	}

	function minus(val) {
		$('#quantity p').text(val - 1);
		if (val == 2) $('.quantityChange:first-child').addClass('disabled');
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
