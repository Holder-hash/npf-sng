//burger menu
const panelEndWrapper = document.createElement('div');
// panelEndWrapper.classList.toggle('panelEndWrapper');
if (panelEndWrapper.classList.contains('panelEndWrapper')) {
    panelEndWrapper.classList.remove('panelEndWrapper')
} else {
    panelEndWrapper.classList.add('panelEndWrapper')
}
document.querySelector('.burger-menu').addEventListener('click', () => {
    document.getElementById('bg').style = 'display: none;';
    document.getElementById('panel').style = 'display: none;';
    // document.querySelector('nav').classList.toggle('burger-open');
    if (document.querySelector('nav').classList.contains('burger-open')) {
        document.querySelector('nav').classList.remove('burger-open')
    } else {
        document.querySelector('nav').classList.add('burger-open')
    }

    if (document.querySelector('nav').classList.contains('burger-open')) {
        document.querySelector('nav').style = `top: 78px;`;
        document.querySelector('.head').style = 'top: 0';
        document.querySelector('#header__cookie'). style = 'display: none';
        if (document.querySelector('.footer__calc')) {
            document.querySelector('.footer__calc').style = `display: none`;
        }

        document.querySelector('.nav').append(panelEndWrapper);
        panelEndWrapper.append(document.querySelector('.nav__list-right'));
        panelEndWrapper.append(document.querySelector('.nav__list__lastChild'));

        // document.querySelector('body').classList.toggle('body-overflow-hidden');
        if (document.querySelector('body').classList.contains('body-overflow-hidden')) {
            document.querySelector('body').classList.remove('body-overflow-hidden')
        } else {
            document.querySelector('body').classList.add('body-overflow-hidden')
        }
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
const navItemFond = document.querySelector('.nav__item-fond');
const navListLink = document.querySelectorAll('.nav__list-link');

navListLink.forEach(element => {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        let target = e.target;
        openList(target);
    })
});

function openList(target) {
    const targetLinksBox = target.parentNode.lastElementChild;

    if (targetLinksBox.classList.contains('links_box-show') && target.className != 'panel__link') {
        targetLinksBox.classList.remove('links_box-show');
        target.parentNode.children[1].style = 'transform: rotate(-45deg);';
    } else {
        targetLinksBox.classList.add('links_box-show');
        target.parentNode.children[1].style = 'transform: rotate(45deg);';
    }

    document.querySelectorAll('.links_box').forEach(box => {
        if (box != targetLinksBox && target.className != 'panel__link') {
            box.classList.remove('links_box-show');
        }
    })
}