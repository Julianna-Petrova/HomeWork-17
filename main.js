'use strict';

function each(collection, cb) {
  for (let index = 0; index < collection.length; index++) {
    const element = collection[index];
    cb(element, index);
  }
}

class Slider {
  constructor({
    container: slider,
    arrows = true,
    pagination,
    autoPlay = false,
    autoPlayTime = 4000,
    animationTime = 700,
  }) {
    this.slider = slider;
    this.autoPlay = autoPlay;
    this.autoPlayTime = autoPlayTime;
    this.sliderTrack = document.createElement('div');
    this.sliderTrack.style.transition = `transform ${animationTime}ms`;
    this.currentSlide = 0;
    this.sliderTrack.className = 'slider-track';
    this.sliderTrack.innerHTML = slider.innerHTML;
    slider.innerHTML = '';
    slider.append(this.sliderTrack);
    this.sliderItems = slider.querySelectorAll('.slider-item');
    this.slidesCount = this.sliderItems.length;
    this.slideWidth = slider.clientWidth;
    this.trackWidth = this.slideWidth * this.slidesCount;
    this.paginationContainer = null;
    this.autoplayTimerId = null;
    this.setElementsSizes();

    if (arrows) {
      this.createArrows();
    }

    if (pagination) {
      this.paginationContainer = this.createPagination({ slidesCount: this.slidesCount });
    }

    this.handleAutoPlay();

    slider.addEventListener('click', (event) => this.handleSliderClick(event));

    window.addEventListener('resize', () => this.handleWindowResize());
  }

  setElementsSizes() {
    each(this.sliderItems, (slide) => {
      slide.style.width = `${this.slideWidth}px`;
    });

    this.sliderTrack.style.width = `${this.trackWidth}px`;
    const translate = this.currentSlide * this.slideWidth;
    this.sliderTrack.style.transform = `translate3d(-${translate}px, 0px, 0px)`;
  }

  handleWindowResize() {
    // this.slideWidth = this.slideWidth;
    this.trackWidth = this.slideWidth * this.slidesCount;
    this.setElementsSizes();
  }

  handleSliderClick(event) {
    const slideArrow = event.target.closest('.slider-arrow');
    const slideDot = event.target.closest('.slider-pagination-dot');

    if (slideArrow) {
      const slideToNum = Number(slideArrow.getAttribute('data-slide-to'));
      this.slideTo(this.currentSlide + slideToNum);
    }

    if (slideDot) {
      const slideToNum = Number(slideDot.getAttribute('data-slide-index'));
      this.slideTo(slideToNum);
    }
  }

  handleAutoPlay() {
    if (!this.autoPlay) return;

    if (this.autoplayTimerId) {
      clearInterval(this.autoplayTimerId);
    }

    this.autoplayTimerId = setInterval(() => {
      this.slideTo(this.currentSlide + 1);
    }, this.autoPlayTime);
  }

  slideTo(index) {
    if (index < 0) {
      index = this.slidesCount - 1;
    } else if (index >= this.slidesCount) {
      index = 0;
    }

    this.currentSlide = index;
    const translate = index * this.slideWidth;
    this.sliderTrack.style.transform = `translate3d(-${translate}px, 0px, 0px)`;
    this.updatePaginationActiveElement(this.currentSlide);
    this.handleAutoPlay();
  }

  createArrows() {
    const leftArrow = document.createElement('button');
    leftArrow.setAttribute('data-slide-to', '-1');
    leftArrow.className = 'slider-arrow slider-left-arrow';
    leftArrow.textContent = '<';

    const rightArrow = document.createElement('button');
    rightArrow.setAttribute('data-slide-to', '1');
    rightArrow.className = 'slider-arrow slider-right-arrow';
    rightArrow.textContent = '>';

    this.slider.append(leftArrow);
    this.slider.append(rightArrow);
  }

  createPagination({ slidesCount }) {
    const container = document.createElement('ul');
    container.className = 'slider-pagination-container';

    for (let index = 0; index < slidesCount; index++) {
      const dot = document.createElement('li');
      dot.className = 'slider-pagination-dot';
      if (index === 0) {
        dot.classList.add('active');
      }
      dot.setAttribute('data-slide-index', index);
      container.append(dot);
    }

    this.slider.append(container);
    return container;
  }

  updatePaginationActiveElement(activeIndex) {
    each(this.paginationContainer.children, (child, index) => {
      if (index === activeIndex) {
        child.classList.add('active');
      } else {
        child.classList.remove('active');
      }
    });
  }
}

const sliders = document.querySelectorAll('.slider');

each(sliders, (slider) => new Slider({
  container: slider,
  arrows: true,
  pagination: true,
  autoPlay: true,
  autoPlayTime: 3000,
  animationTime: 1000,
}));
