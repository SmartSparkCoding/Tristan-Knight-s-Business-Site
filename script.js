document.addEventListener('DOMContentLoaded', function () {
	const carousel = document.getElementById('carousel');
	if (!carousel) return;
	const slidesWrap = carousel.querySelector('.slides');
	const slides = Array.from(carousel.querySelectorAll('.slide'));
	const prevBtn = carousel.querySelector('.carousel-btn.prev');
	const nextBtn = carousel.querySelector('.carousel-btn.next');
	const dotsWrap = document.getElementById('carousel-dots');
	let index = 0;
	let timer = null;

	function goTo(i) {
		index = (i + slides.length) % slides.length;
		slidesWrap.style.transform = `translateX(-${index * 100}%)`;
		updateDots();
	}

	function next() { goTo(index + 1); }
	function prev() { goTo(index - 1); }

	function updateDots() {
		if (!dotsWrap) return;
		Array.from(dotsWrap.children).forEach((btn, i)=>{
			btn.classList.toggle('active', i === index);
		});
	}

	// build dots
	slides.forEach((_, i)=>{
		const b = document.createElement('button');
		b.addEventListener('click', ()=> { goTo(i); restart(); });
		dotsWrap.appendChild(b);
	});

	prevBtn.addEventListener('click', ()=> { prev(); restart(); });
	nextBtn.addEventListener('click', ()=> { next(); restart(); });

	function start() { timer = setInterval(next, 4000); }
	function stop() { clearInterval(timer); timer = null; }
	function restart() { stop(); start(); }

	carousel.addEventListener('mouseenter', stop);
	carousel.addEventListener('mouseleave', start);

	goTo(0);
	start();
});

