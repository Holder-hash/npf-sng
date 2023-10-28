//burger menu
const panelEndWrapper = document.createElement('div');
panelEndWrapper.classList.toggle('panelEndWrapper')
document.querySelector('.burger-menu').addEventListener('click', () => {
    document.getElementById('bg').style = 'display: none;';
    document.getElementById('panel').style = 'display: none;';
    document.querySelector('nav').classList.toggle('burger-open');
    if (document.querySelector('nav').classList.contains('burger-open')) {
        document.querySelector('nav').style = `top: 78px`
        document.querySelector('.head').style = 'top: 0';
        document.querySelector('#header__cookie'). style = 'display: none';
        if (document.querySelector('.footer__calc')) {
            document.querySelector('.footer__calc').style = `display: none`;
        }

        document.querySelector('.nav').append(panelEndWrapper);
        panelEndWrapper.append(document.querySelector('.nav__list-right'));
        panelEndWrapper.append(document.querySelector('.nav__list__lastChild'));

        document.querySelector('body').classList.toggle('body-overflow-hidden');
    } else {
        document.querySelector('nav').style = `top: 0`;
        document.querySelector('.head').style = 'top: 240px';
        document.querySelector('#header__cookie').style = 'display: block';
        if (document.querySelector('.footer__calc')) {
            document.querySelector('.footer__calc').style = `display: block`;
        }

        document.querySelector('.nav').append(document.querySelector('.nav__list-right'));
        document.querySelector('.nav').append(document.querySelector('.nav__list__lastChild'));
        document.querySelector('.nav').removeChild(panelEndWrapper);

        document.querySelector('body').classList.remove('body-overflow-hidden');
    }
})

// burger menu items
const panel = document.querySelector('.panel__body-fond');
const navItemFond = document.querySelector('.nav__item-fond')
const navListLink = document.querySelectorAll('.nav__list-link');
navListLink.forEach(navLinkElement => {
    navLinkElement.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav__fond-li').onclick = () => {
            document.querySelector('.nav__fond-li').classList.toggle('nav-fond-open');
            document.querySelector('.nav__program-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-program').style = 'display:none';
            document.querySelector('.nav__results-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-results').style = 'display:none';
            document.querySelector('.nav__our-clients-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-ourClients').style = 'display:none';
            if (document.querySelector('.nav__fond-li').classList.contains('nav-fond-open')) {
                document.querySelector('.panel__item-box-fond').style = 'display:block';
                document.querySelector('.nav__arrow-fond').style = 'transform: rotate(45deg);';
            } else {
                document.querySelector('.panel__item-box-fond').style = 'display:none';
                document.querySelector('.nav__arrow-fond').style = 'transform: rotate(-45deg);';
            }
        }
        document.querySelector('.nav__program-li').onclick = () => {
            document.querySelector('.nav__program-li').classList.toggle('nav-fond-open');
            document.querySelector('.nav__fond-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-fond').style = 'display:none';
            document.querySelector('.nav__results-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-results').style = 'display:none';
            document.querySelector('.nav__our-clients-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-ourClients').style = 'display:none';
            if (document.querySelector('.nav__program-li').classList.contains('nav-fond-open')) {
                document.querySelector('.panel__item-box-program').style = 'display:block';
                document.querySelector('.nav__arrow-program').style = 'transform: rotate(45deg);';
            } else {
                document.querySelector('.panel__item-box-program').style = 'display:none';
                document.querySelector('.nav__arrow-program').style = 'transform: rotate(-45deg);'
            }
        }
        document.querySelector('.nav__results-li').onclick = () => {
            document.querySelector('.nav__results-li').classList.toggle('nav-fond-open');
            document.querySelector('.nav__fond-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-fond').style = 'display:none';
            document.querySelector('.nav__program-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-program').style = 'display:none';
            document.querySelector('.nav__our-clients-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-ourClients').style = 'display:none';
            if (document.querySelector('.nav__results-li').classList.contains('nav-fond-open')) {
                document.querySelector('.panel__item-box-results').style = 'display:block';
                document.querySelector('.nav__arrow-results').style = 'transform: rotate(45deg);';
            } else {
                document.querySelector('.panel__item-box-results').style = 'display:none'
                document.querySelector('.nav__arrow-results').style = 'transform: rotate(-45deg);';
            }
        }
        document.querySelector('.nav__our-clients-li').onclick = () => {
            document.querySelector('.nav__our-clients-li').classList.toggle('nav-fond-open');
            document.querySelector('.nav__fond-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-fond').style = 'display:none';
            document.querySelector('.nav__program-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-program').style = 'display:none';
            document.querySelector('.nav__results-li').classList.remove('nav-fond-open');
            document.querySelector('.panel__item-box-results').style = 'display:none';
            if (document.querySelector('.nav__our-clients-li').classList.contains('nav-fond-open')) {
                document.querySelector('.panel__item-box-ourClients').style = 'display:block';
                document.querySelector('.nav__arrow-ourClients').style = 'transform: rotate(45deg);'
            } else {
                document.querySelector('.panel__item-box-ourClients').style = 'display:none';
                document.querySelector('.nav__arrow-ourClients').style = 'transform: rotate(-45deg);';
            }
        }
    })
})