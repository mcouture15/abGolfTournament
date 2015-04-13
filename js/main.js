$(function() {
	function setupClicks() {
		$('header a').on('click', goToSection);
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
	console.log('ready');
});
