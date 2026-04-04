if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}

window.addEventListener('load', function () {
	window.scrollTo(0, 0);
	let tries = 0;
	const ensureTop = function () {
		if (window.scrollY > 0 && tries < 20) {
			window.scrollTo(0, 0);
			tries++;
			requestAnimationFrame(ensureTop);
		}
	};

	requestAnimationFrame(ensureTop);
	setTimeout(function () {
		window.scrollTo(0, 0);
	}, 200);
});

document.addEventListener('DOMContentLoaded', function () {
	const sections = Array.from(document.querySelectorAll('.section'));

	if ('IntersectionObserver' in window) {
		const sectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						sectionObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 }
		);

		sections.forEach((section) => sectionObserver.observe(section));
	} else {
		sections.forEach((section) => section.classList.add('is-visible'));
	}

	const carousel = document.getElementById('carousel');
	if (!carousel) return;

	const slides = Array.from(carousel.querySelectorAll('.slide'));
	const prevBtn = carousel.querySelector('.carousel-btn.prev');
	const nextBtn = carousel.querySelector('.carousel-btn.next');
	const dotsWrap = document.getElementById('carousel-dots');
	let slideIndex = 1;
	let timer = null;
	let isHovered = false;
	let isInView = false;

	function showSlides(n) {
		if (n > slides.length) slideIndex = 1;
		if (n < 1) slideIndex = slides.length;

		slides.forEach((slide) => {
			slide.style.display = 'none';
			slide.classList.remove('is-active');
		});
		Array.from(dotsWrap.children).forEach((dot) => dot.classList.remove('active'));

		slides[slideIndex - 1].style.display = 'block';
		slides[slideIndex - 1].classList.add('is-active');
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
		restartAuto();
	});

	nextBtn.addEventListener('click', () => {
		plusSlides(1);
		restartAuto();
	});

	function canAutoplay() {
		return !document.hidden && !isHovered && isInView;
	}

	function scheduleNext() {
		if (!canAutoplay()) return;
		timer = setTimeout(function () {
			plusSlides(1);
			timer = null;
			scheduleNext();
		}, 5000);
	}

	function stopAuto() {
		if (timer) clearTimeout(timer);
		timer = null;
	}

	function startAuto() {
		if (timer || !canAutoplay()) return;
		scheduleNext();
	}

	function restartAuto() {
		stopAuto();
		startAuto();
	}

	carousel.addEventListener('mouseenter', function () {
		isHovered = true;
		stopAuto();
	});

	carousel.addEventListener('mouseleave', function () {
		isHovered = false;
		startAuto();
	});

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			stopAuto();
		} else {
			startAuto();
		}
	});

	if ('IntersectionObserver' in window) {
		const carouselObserver = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				isInView = entry.isIntersecting;
				if (isInView) {
					startAuto();
				} else {
					stopAuto();
				}
			},
			{ threshold: 0.35 }
		);

		carouselObserver.observe(carousel);
	} else {
		isInView = true;
	}

	showSlides(slideIndex);
	startAuto();
});

