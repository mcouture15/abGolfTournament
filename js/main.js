$(function() {
	Parse.initialize(
		'Yfj9RlamVjaC4pzsmlxpgJDubjrclBF2c1euYJRs',
		'i1uz71A2H7Vi9oFOWNMS0q6M1YisFLdA90eEFsFT'
	);
	var amount,
		carouselInt,
		firstName,
		handler,
		lastName,
		myScroll,
		q,
		t;

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
			firstName: firstName,
			lastName: lastName,
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
			$('body').addClass('noScroll');
		});

		$('#purchaseClose').on('click', function() {
			$('#purchaseContent input').removeClass('invalid');
			$('body').removeClass('noScroll');
			$('#purchaseOverlay').removeClass('active').delay(1).hide();
		});

		$('#purchase').on('click', purchaseClicked);

		$('html, body').keyup(function(e) {
			if (e.keyCode == 27) $('#purchaseClose').trigger('click');
			else if (e.keyCode == 37 || e.keyCode == 39) restartTimers();
		});

		$('.quantityChange').on('click', function(e) {
			if (e.target.classList.contains('disabled') || e.target.parentElement.classList.contains('disabled')) return;

			if (e.target.id == 'increaseGolf') {
				var val = parseInt($('#golf p').text());
				plus('#golf', val);
			} else if (e.target.id == 'decreaseGolf') {
				var val = parseInt($('#golf p').text());
				minus('#golf', val);
			} else if (e.target.id == 'increaseNoGolf') {
				var val = parseInt($('#noGolf p').text());
				plus('#noGolf', val);
			} else if (e.target.id == 'decreaseNoGolf') {
				var val = parseInt($('#noGolf p').text());
				minus('#noGolf', val);
			} else if (e.target.children[0].id == 'increaseGolf') {
				var val = parseInt($('#golf p').text());
				plus('#golf', val);
			} else if (e.target.children[0].id == 'decreaseGolf') {
				var val = parseInt($('#golf p').text());
				minus('#golf', val);
			} else if (e.target.children[0].id == 'increaseNoGolf') {
				var val = parseInt($('#noGolf p').text());
				plus('#noGolf', val);
			} else {
				var val = parseInt($('#noGolf p').text());
				minus('#noGolf', val);
			}
		});

		$('.scroll').on('click', function() {
			restartTimers();
			if ($(this).hasClass('scrollLeft')) myScroll.prev();
			else myScroll.next();
		});
	}

	function restartTimers() {
		clearTimeout(t);
		clearInterval(carouselInt);

		t = setTimeout(function() {
			carouselInt = setInterval(nextCara, 5000);
		}, 10000);
	}

	function purchaseClicked(e) {
			var invalid = validateFields();
			if (invalid.length) {
				invalid.forEach(function(i) {
					i.addClass('invalid');
				});
				$('#purchaseContent').addClass('shake');
				setTimeout(function() {
					$('#purchaseContent').removeClass('shake');
				}, 401);
			} else {
				q = parseInt($('#quantity p').text());
				amount = Math.round(100 * ((45 + 1.35)*q + 0.3));
				firstName = $('#firstName').val();
				lastName = $('#lastName').val();

				handler.open({
					amount: amount,
					currency: 'cad',
					description: q + ' Ticket' + (q > 1 ? 's' : '') + ' @ $45 each + Service Charge',
					name: 'AB Memorial Golf Tournament'
				});
				e.preventDefault();
				setTimeout(function() {
					$('#purchaseClose').trigger('click');
				}, 200);
			}
	}

	function plus(e, val) {
		$(e + ' p').text(val + 1);
		if (val == 1) $(e).prev().removeClass('disabled');
	}

	function minus(e, val) {
		$(e + ' p').text(val - 1);
		if (val == 2) $(e).prev().addClass('disabled');
	}

	function validateFields() {
		var invalid = [];
		if ($('#firstName').val().trim().length < 2) {
			invalid.push($('#firstName'));
		}
		if ($('#lastName').val().trim().length < 2) {
			invalid.push($('#lastName'));
		}
		return invalid
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
		$('html, body').animate({
			scrollTop: $('#' + $(e.target).attr('label-for')).offset().top
		},
			'slow'
		);
	}

	function nextCara() {
		myScroll.next();
	}

	function setupCarousel() {
		$("#viewport").height($("body").height() * .85 - $("#gallery h1").outerHeight(true));
		myScroll = new IScroll('#wrapper', {
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 400,
			keyBindings: true
		});
		carouselInt = setInterval(nextCara, 5000);
	}

	setupClicks();
	setupStripe();
	setupToastr();
	setupCarousel();

	console.log('ready');
});
