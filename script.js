document.addEventListener('DOMContentLoaded', function () {
	const carousel = document.getElementById('carousel');
	if (!carousel) return;

	const slides = Array.from(carousel.querySelectorAll('.slide'));
	const prevBtn = carousel.querySelector('.carousel-btn.prev');
	const nextBtn = carousel.querySelector('.carousel-btn.next');
	const dotsWrap = document.getElementById('carousel-dots');
	let slideIndex = 1;
	let timer = null;

	function showSlides(n) {
		if (n > slides.length) slideIndex = 1;
		if (n < 1) slideIndex = slides.length;

		slides.forEach((slide) => { slide.style.display = 'none'; });
		Array.from(dotsWrap.children).forEach((dot) => dot.classList.remove('active'));

		slides[slideIndex - 1].style.display = 'block';
		dotsWrap.children[slideIndex - 1].classList.add('active');
	}

	function plusSlides(n) {
		slideIndex += n;
		showSlides(slideIndex);
	}

	function currentSlide(n) {
		slideIndex = n;
		showSlides(slideIndex);
	}

	// Build dots once, matching number of slides
	slides.forEach((_, i) => {
		const dot = document.createElement('button');
		dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
		dot.addEventListener('click', () => {
			currentSlide(i + 1);
			restart();
		});
		dotsWrap.appendChild(dot);
	});

	prevBtn.addEventListener('click', () => {
		plusSlides(-1);
		restart();
	});

	nextBtn.addEventListener('click', () => {
		plusSlides(1);
		restart();
	});

	function start() {
		timer = setInterval(function () {
			plusSlides(1);
		}, 5000);
	}

	function stop() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	function restart() {
		stop();
		start();
	}

	carousel.addEventListener('mouseenter', stop);
	carousel.addEventListener('mouseleave', start);

	showSlides(slideIndex);
	start();
});

