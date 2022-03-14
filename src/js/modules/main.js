const burger = () => {
    const trigger = document.querySelector('.burger');
    const  close = document.querySelector('.burger__close');
    const  menu = document.querySelector('.burger__overlay');
    const  links = document.querySelectorAll('.burger__item');

    trigger.addEventListener('click', () => {
        menu.classList.add('burger__overlay_active');
    });

    close.addEventListener('click', () => {
        menu.classList.remove('burger__overlay_active');
    });

    links.forEach(item => {
        item.addEventListener('click', () => {
            menu.classList.remove('burger__overlay_active');
        });
    });
};
function scroll() {

    const links = document.querySelectorAll('a[href^="#"]');

    function slowScroll(event,link) {
        event.preventDefault();

        const id = link.getAttribute('href');

        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    links.forEach(link => {
        link.addEventListener('click', event => {
            slowScroll(event,link);
        });
    });
}

export {
    burger,
    scroll
};
