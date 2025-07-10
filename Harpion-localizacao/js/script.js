const header = document.querySelector("header");

window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 80);
});


let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.header__navbar');
let navLinks = document.querySelectorAll('.header__navbar-link');


menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('open');
    document.body.classList.toggle('menu-open'); 
};


navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('open');
        document.body.classList.remove('menu-open');
    });
});


window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section, div[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


const sr = ScrollReveal({
    distance: '65px',
    duration: 1600, 
    delay: 250,    
    reset: true,
});


sr.reveal('.hero__text', { delay: 200, origin: 'top' });
sr.reveal('.hero__img', { delay: 300, origin: 'top' });
sr.reveal('.content-section', { delay: 200, origin: 'bottom' });
sr.reveal('.contact__form-container', { delay: 150, origin: 'left' });
sr.reveal('.contact__image', { delay: 150, origin: 'right' });
sr.reveal('.partner-card', { delay: 150, origin: 'bottom', interval: 200 });
sr.reveal('.section--team .section__header', { delay: 100, origin: 'top' });
sr.reveal('.card', { delay: 200, origin: 'bottom', interval: 100 });

// Essa merda que eu peguei no github faz voltar ao topo
const btnScrollToTop = document.createElement('button');
btnScrollToTop.id = 'btn-scroll-to-top';
btnScrollToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
btnScrollToTop.setAttribute('aria-label', 'Voltar ao topo');
document.body.appendChild(btnScrollToTop);

btnScrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        btnScrollToTop.classList.add('visible');
    } else {
        btnScrollToTop.classList.remove('visible');
    }
});
