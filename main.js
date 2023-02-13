import './style.css'

// IMAGE SLIDER
const slideBtns = document.querySelectorAll('[data-sliderBtn]');
const slideContainer = document.querySelector('[data-slideContainer]');
const slides = [...document.querySelectorAll('[data-slide]')];

let currentIndex = 0;
let isMoving = false;

document.querySelectorAll('[data-slide] img').forEach(img => img.ondragstart = () => false)

// Slider Event Listeners
slideBtns.forEach(btn => btn.addEventListener('click', handleSlideBtnClick));
slideContainer.addEventListener('sliderMoves', () => {
    // 1. Translate container to the right/left
    slideContainer.style.transform = `translate(-${currentIndex * slides[0].clientWidth}px)`
    // 2. Remove diasbled attributes
    removeDisabledAtrribute(slideBtns);
    // 3. Reanable disbled attribute if needed
    currentIndex === 0 && addDisabledAtrribute([slideBtns[0]]);
})

slideContainer.addEventListener('transitionend', () => isMoving = false)

// Slider functions
function handleSlideBtnClick(e) {
    if (isMoving) return;
    isMoving = true;
    e.currentTarget.id === 'prev' ? currentIndex-- : currentIndex++;
    slideContainer.dispatchEvent(new Event('sliderMoves'));

}

const removeDisabledAtrribute = (els) => els.forEach(el => el.removeAttribute('disabled'));
const addDisabledAtrribute = (els) => els.forEach(el => el.setAttribute('disabled', 'true'));

// Intersection Observer for slides
const slideObserver = new IntersectionObserver((slide) => {
    if (slide[0].isIntersecting) addDisabledAtrribute([slideBtns[1]])
}, {threshold: .75});

slideObserver.observe(slides[slides.length - 1]);

// FORM SUBMISSION
const contactForm = document.querySelector('#contact-form');
const contactBtn = document.querySelector('#contact-btn');
const contactInput = document.querySelector('#email');

// Options for submit button
const contactBtnOptions = {
    pending: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="animate-spin" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
    <span class="uppercase tracking-wide animate-pulse">Sending...</span>
    `,
    success: `
    <span class="uppercase tracking-wide">Thank you!</span>
    <span class="uppercase tracking-wide">✌</span>
    `,
}

// Form event listeners
contactForm.addEventListener('submit', handleFormSubmit);

// Form functions
async function handleFormSubmit(e) {
    e.preventDefault();
    addDisabledAtrribute([contactForm, contactBtn]);
    contactBtn.innerHTML = contactBtnOptions.pending;
    const userEmail = contactInput.value;
    contactInput.style.display = 'none';
    await postEmailToDatabase(userEmail);
    contactBtn.innerHTML = contactBtnOptions.success;
}

function postEmailToDatabase (email) {
    console.info(`Your email is ${email}`);
    return new Promise(resolve => setTimeout(resolve, 2000));
}

//  FADE UP
const fadeUpOptions = {
    threshold: .6,
};

const fadeUpObserver = new IntersectionObserver(handleElements, fadeUpOptions);

document.querySelectorAll('.fade-up').forEach(item => fadeUpObserver.observe(item));

function handleElements(els) {
    els.forEach(el => {
        if(el.isIntersecting) {
            el.target.classList.add('faded');
            fadeUpObserver.unobserve(el.target);
            el.target.addEventListener('transitionend', () => {
                el.target.classList.remove('fade-up', 'faded')
            }, {once: true})
        }
    })
}