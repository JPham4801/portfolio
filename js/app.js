const carouselList = document.querySelector('.carousel__list');
const carouselItems = document.querySelectorAll('.carousel__item');
const elems = Array.from(carouselItems);

carouselList.addEventListener('click', function (event) {
  const newActive = event.target.closest('.carousel__item');

  if (!newActive || newActive.classList.contains('carousel__item_active')) {
    return;
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
}

function getPos(current, active) {
  const diff = current - active;
  if (Math.abs(diff) > 2) {
    return -current;
  }
  return diff;
}
