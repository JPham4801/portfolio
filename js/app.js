const carouselList = document.querySelector('.carousel__list');
const carouselItems = document.querySelectorAll('.carousel__item');
const elems = Array.from(carouselItems);
const items = Array.from(carouselList.children);
const prevButton = document.querySelector('.carousel__nav--prev');
const nextButton = document.querySelector('.carousel__nav--next');
const descriptionText = document.getElementById('carousel-description-text');

// typewriter effect

class TxtType {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.isDeleting = false;
    this.tick();
  }

  tick = () => {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;

    let delta = 200 - Math.random() * 100;
    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => {
      this.tick();
    }, delta);
  };
}

// carousel

carouselList.addEventListener('click', function (event) {
  const newActive = event.target.closest('.carousel__item');

  if (!newActive || newActive.classList.contains('carousel__item_active')) {
    return;
  }

  // Retrieve and log the position of the clicked item

  // Convert data-pos to a number
  const position = Number(newActive.dataset.pos);

  // Check if position is 0
  if (position === 0) {
    const url = newActive.dataset.url;
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('URL not found for the clicked item.');
    }
  }

  update(newActive);
});

function update(newActive) {
  const newActivePos = newActive.dataset.pos;

  const current = elems.find((elem) => elem.dataset.pos === '0');
  const prev = elems.find((elem) => elem.dataset.pos === '-1');
  const next = elems.find((elem) => elem.dataset.pos === '1');
  const first = elems.find((elem) => elem.dataset.pos === '-2');
  const last = elems.find((elem) => elem.dataset.pos === '2');

  current.classList.remove('carousel__item_active');

  [current, prev, next, first, last].forEach((item) => {
    const itemPos = item.dataset.pos;
    item.dataset.pos = getPos(itemPos, newActivePos);
  });

  // Update description for the new active item
  descriptionText.textContent = newActive.getAttribute('data-description');
}

function getPos(current, active) {
  const diff = current - active;
  if (Math.abs(diff) > 2) {
    return -current;
  }
  return diff;
}

function updatePositions(direction) {
  items.forEach((item) => {
    let currentPos = parseInt(item.getAttribute('data-pos'));
    let newPos = direction === 'next' ? currentPos - 1 : currentPos + 1;

    // Wrap around the positions
    if (newPos < -2) {
      newPos = 2;
    } else if (newPos > 2) {
      newPos = -2;
    }

    item.setAttribute('data-pos', newPos);

    // Update description for the active item
    if (newPos === 0) {
      descriptionText.textContent = item.getAttribute('data-description');
    }
  });
}

prevButton.addEventListener('click', () => {
  updatePositions('prev');
});

nextButton.addEventListener('click', () => {
  updatePositions('next');
});

window.onload = () => {
  const elements = document.getElementsByClassName('typewrite');
  for (let i = 0; i < elements.length; i++) {
    const toRotate = elements[i].getAttribute('data-type');
    const period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }

  // Set initial description

  const activeItem = items.find((item) => parseInt(item.getAttribute('data-pos')) === 0);
  if (activeItem) {
    descriptionText.textContent = activeItem.getAttribute('data-description');
  }
};
