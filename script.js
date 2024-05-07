'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navi = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section'); //returns a nodelist

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(ev => ev.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////// EVENT DELEGATION /////////////////////////
// old method for 3 items it's ok to use an event handler for each one, but if there are 10k, it would be slooow
// document.querySelectorAll('.nav__link').forEach(function (elem) {
//   elem.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log('LINK');
//     const id = this.getAttribute('href');

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

/* event delegation will basically apply a handler to a whole section, and for each button a handler will be 
generated */

// 1. Add event listener to common parent element
// 2. Determine what element originated that event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  /*here is where event.target is really useful to know where a certain event actually originated (and not
    currentTarget to show the current element) */

  // matching strategy, or knowing where the event originated and not nav__links which is the parent element
  if (e.target.classList.contains('nav__link')) {
    // console.log('LINK');
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/* event delegation is also very useful in the cases in which we are using dynamic buttons, so for elements
  which are not yet on the page */
// tabbed componentes

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //Guard Clause
  if (!clicked) return;

  tabs.forEach(elem => elem.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // active content area
  tabsContent.forEach(elem =>
    elem.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// menu fade animation

//refactoring
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(elem => {
      if (elem !== link) elem.style.opacity = this; // instead of using opacity, use this
    });
    logo.style.opacity = this;
  }
};

navi.addEventListener('mouseover', handleHover.bind(0.5));
// one way is calling the function within the function
// handleHover(e, 0.5);
// the second way is to use bind, which creates a copy of a function, or returns a new function

// mouse enter doesn't bubble while mouse over does

navi.addEventListener('mouseout', handleHover.bind(1));

// sticky nav
// first not efficient way

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) navi.classList.add('sticky');
//   else navi.classList.remove('sticky');
// });

// New way ->>>>>>>>>>>>>>> INTERSECTION OBSERVER API <<<<<<<<<------------------
// const obsCallback = function (entries, observer) {
//   entries.forEach(elem => console.log(elem));
// };

// const obsOptions = {
//   root: null, // whole viewport
//   threshold: [0, 0.2], // in %
// };

// const theObserver = new IntersectionObserver(obsCallback, obsOptions);
// // theObserver.observe(section1);

const header = document.querySelector('.header');

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navi.classList.add('sticky');
  else {
    navi.classList.remove('sticky');
  }
};

const headObserver = new IntersectionObserver(stickyNav, {
  threshold: 0,
  rootMargin: '-50px',
});
headObserver.observe(header);

/////// reveal elements

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // entry.target.class
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve;
};

const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.15,
});

allSections.forEach(function (elem) {
  sectionObserver.observe(elem);
  elem.classList.add('section--hidden');
});

//////////////////////// LAZY LOADING IMAGES SO THAT THEY DON'T OCCUPY TOO MUCH ///////////////////
const lazyImg = document.querySelectorAll('img[data-src]');
const revealImg = function (ent, obs) {
  const [img] = ent;
  // console.log(img);

  if (!img.isIntersecting) return;

  img.target.setAttribute('src', img.target.getAttribute('data-src'));

  img.target.addEventListener('load', function () {
    img.target.classList.remove('lazy-img');
  });

  obs.unobserve(img.target);
};

const imgObserver = new IntersectionObserver(revealImg, { threshold: 1 });

lazyImg.forEach(function (elem) {
  imgObserver.observe(elem);
  // console.log(elem);
});

//////////////////slider/////////////////////
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

// slider.style.overflow = 'visible';
// slider.style.transform = 'scale(0.5)';

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const isActive = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"`)
    .classList.add('dots__dot--active');
};
isActive(0);

let currentPercent = 0;
console.log(slides.length);
const goToSlide = function (slide) {
  slides.forEach(
    (elem, index) =>
      (elem.style.transform = `translateX(${100 * (index - slide)}%)`)
  );
};

goToSlide(0);

const nextSlide = function () {
  if (currentPercent === maxSlide - 1) {
    currentPercent = 0;
  } else {
    currentPercent++;
  }

  goToSlide(currentPercent);
  isActive(currentPercent);
};

btnRight.addEventListener('click', nextSlide);

const prevSlide = function () {
  if (currentPercent === 0) {
    currentPercent = maxSlide - 1;
  } else {
    currentPercent--;
  }

  goToSlide(currentPercent);
  isActive(currentPercent);
};

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset; //destructuring helps again
    goToSlide(slide);
    currentPercent = Number(slide);
    isActive(currentPercent);
  }
});

///////////////////////////////////////////////
///////////////////////////////////////////////
// console.log(document.documentElement);
// console.log(document.body);

const allButtons = document.getElementsByTagName('btn'); // keep in mind that this will update according to
// the html rather than the js file. The return is a HTML collection. getElementsByClassName is another instance.

//---------------------------- to create elements ---------------
// .insertAdjancentHtml is one way to do it, but there are more programmatic ways to do it

// const message = document.createElement('div'); // returns a dom element, requires a string of the tag element
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality';
// message.innerHTML =
//   'We use cookies for improved functionality. <button class="btn btn--close-cookie">Got it</button>';
// header.prepend(message);

/* if we were to append the message again, it would simply go down because it can not be in two places at once
what we must do then is to create a clone of the node */

// header.append(message.cloneNode(true));
/* other two methods are header.before and header.after, which would make the element be before or after the element
and not a child of the element */

// const closeButton = document.querySelector('.btn--close-cookie');
// closeButton.addEventListener('click', function (e) {
//   e.preventDefault;
//   header.removeChild(message);
// }); // ---> old method

//---- new method to delete
// closeButton.addEventListener('click', function () {
//   message.remove();
// });

// -------- styles --------
// message.style.backgroundColor = '#37383d';
// message.style.width = '110%';
/* these styles are considered as inline, so directly into the dom's html rather than the css file
getting the style out af an element like log(message.style.height) would return nothing since it's not really
in the dom, the way to get it however is using : getComputedStyle. We get the values of the page even
if we don't specify them*/
// console.log(getComputedStyle(message).color); //rgb(187, 187, 187)

// remember to access the root or the document itself, document alone is not enough, it's document.documentElement

// document.documentElement.style.setProperty('--color-primary', 'orangered');

//----------------- Attributes (src, alt etc)

const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(
//   logo.src
// );
/* these methods only work for standard properties such as alt and src
if I were to create a property like designer = 'Jack', log(logo.designer) would return undefined as it is not
standard*/
//
//className and not simply class

// attributes can also be set

logo.alt = 'Beautiful logo';

// as to creating non-standard attributes

logo.setAttribute('company', 'Bankboi');

/* to get an image there are two ways, the first one is by getting the absolute image, which comes from the ip
so http://127.0.0.1:8080/img/logo.png, but in order to get the relative source so img/logo.png relative to
the folder, we need getAttribute*/

/* the same concept works for links, to get the absolute, we use link.hred, to get the relative 
ip/#, link.getAttribute('href') -> # as it is written in the DOM */

/* an important type of attributes are data attributes, which in the html are written as data-what-ever = "3"
and to access them -> logo.dataset.whatEver -> remember the camelCase instead of dashes */

//classes

// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();
//--------------------------------------------------------------------------------------------

// to scroll to another section

buttonScrollTo.addEventListener('click', function (ev) {
  // const s1coords = section1.getBoundingClientRect();

  // console.log(s1coords);

  //scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset, // it's basically the current position (s1coords) + the current scroll
  //   s1coords.top + pageYOffset
  // );
  //to make it smooth we create an object
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + pageYOffset,
  //   behavior: 'smooth',
  // }); /////////////////////////////////// FOR REFERENCE CHECK SLIDE IN WEB DEV FOLDER //////////////////

  // New method of doing it easier
  section1.scrollIntoView({ behavior: 'smooth' });
});

/* why pageXOffset and yoffset? because these are the elements between the visibile window on top (y) and
bottom (x), so by adding them to the coordinates, no matter the point of the page, we will always go to that
precise point, otherwise if we click the button, it will go relative to where the user is rather than
where the button is */

/////////////////////////////////////////// EVENTS AND EVENT HANDLERS /////////////////

const h1 = document.querySelector('h1');

// instead of
let counter = 1;
const func = function (e) {
  /// when mouse enters an area
  // alert('Event Listener -> Great, you are reading the h1!');
  counter += 1;
  // console.log(counter);

  // we can then remove the event listener ( read below)
  h1.removeEventListener('mouseenter', func);
};

h1.addEventListener('mouseenter', func);

// we can use (OLD WAY)

// h1.onmouseenter = function (e) {
//   /// when mouse enters an area
//   // alert('Event Listener -> Great, you are reading the h1!');
//   counter += 1;
//   console.log(counter);
// };

/* the first advantage of eventlistener is that we can add multiple event listeners to the same event
while doing so with the second one would overwrite the first one while the second advantage is that
we can remove an event handler if we don't need it anymore*/

///////////////// BUBBLING AND CAPTURING ///////////////////////
/* Theory -> When an event is attached to a say child element ( which could be an <a> inside a <p> inside a <section>
  inside the <body> which is inside the <html> which is inside !document ) that event is actually not created
  at the <a> but at the top of the DOM so at the !document, through a process called Capturing phase
  it will jump down every single child of the DOM so Document -> HTML -> body -> section -> p -> a
  After reaching the target the second phase is called bubbling, it will travel through each parent element
  until it gets to the top, so a -> p -> section etc etc... This is important because:
  it's as if the event also happened in each of the parent elements
  This behavior or also called event propagation is not of all the events.*/
// Practice ->

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randCol = () =>
  `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`;

// so to apply the concept, we can apply random colors not only to the child element, but also all the parents

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randCol();
//   console.log(e.target, e.currentTarget);

//   // to make sure the propagation is stopped so an event handler does not have an impact on other elements
//   // we call
//   // e.stopPropagation(); // it generally is not a good idea to use
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randCol();
//   console.log(e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randCol();
//   console.log(e.target, e.currentTarget);
// });
/* so if we logged e.target ( where the event happened first ), in all 3 of the events handlers, the place
where the event first happened is nav__link, because that's where the click happened first and it's
that element that handles all of them.
While target shows where it happened first, e.currentTarget will reveal to which event the handler is attached */

// DOM TRAVERSING ////////////////////////- ----- --

// going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
