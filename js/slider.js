export class Slider{
  constructor(selector, options = {
    dots: true,
    buttons: true,
  }){
    this.options = options
    this.$slWrapper = document.querySelector(selector)
    this.$slider = this.$slWrapper.children[0]
    this.currentSlide = 1
    this.#setup()
  }

  #setup(){
    const childrenCount = this.$slider.children.length
    const cloneFirstEl = this.$slider.children[0].cloneNode(true)
    const cloneLastEl = this.$slider.children[childrenCount - 1].cloneNode(true)
    cloneFirstEl.id = 'first-clone'
    cloneLastEl.id = 'last-clone'
    this.$slider.insertAdjacentElement('beforeend', cloneFirstEl)
    this.$slider.insertAdjacentElement('afterbegin', cloneLastEl)
    this.options.buttons && this.#getButtons()
    this.options.dots && this.#getDots()
    this.options.autoplay && this.#implementAutoplay(this.options.autoplay)
    this.#render()
  }

  #render(){
    const dots = [...this.$slWrapper.querySelectorAll('.slider__dots li')]
    dots.forEach(dt => {
      dt.classList.remove('active')
    })
    if(this.currentSlide >= this.$slider.children.length-1){
      dots[0].classList.add('active')
    } else if(this.currentSlide <= 0 ){
      dots[this.$slider.children.length-3].classList.add('active')
    } else {
      dots[this.currentSlide-1].classList.add('active')
    }
    this.$slider.style.transform = `translateX(${-this.currentSlide * this.$slider.offsetWidth}px)`
    this.$slider.addEventListener('transitionend', e => {
      if(this.$slider.children[this.currentSlide].id === 'first-clone'){
        this.$slider.style.transition = 'none'
        this.currentSlide = 1
        this.$slider.style.transform = `translateX(${-this.currentSlide * this.$slider.offsetWidth}px)`
      }
      if(this.$slider.children[this.currentSlide].id === 'last-clone'){
        this.$slider.style.transition = 'none'
        this.currentSlide = this.$slider.children.length - 2
        this.$slider.style.transform = `translateX(${-this.currentSlide * this.$slider.offsetWidth}px)`
      }
    })
  }

  nextSL(){
    if(this.currentSlide >= this.$slider.children.length - 1) return
    this.$slider.style.transition = 'all ease-in-out .3s'
    this.currentSlide++
    this.#render()
  }

  prevSL(){
    if(this.currentSlide <= 0) return
    this.$slider.style.transition = 'all ease-in-out .3s'
    this.currentSlide--
    this.#render()
  }

  #getButtons(){
    const buttons = `
      <div class="slider__buttons">
        <button class="slider__prev">&#10094;</button>
        <button class="slider__next">&#10095;</button>
      </div>
    `
    this.$slWrapper.insertAdjacentHTML('beforeend', buttons)
    this.prevSL = this.prevSL.bind(this)
    this.nextSL = this.nextSL.bind(this)
    const prevBtn = this.$slWrapper.querySelector('.slider__prev')
    const nextBtn = this.$slWrapper.querySelector('.slider__next')
    prevBtn.addEventListener('click', this.prevSL)
    nextBtn.addEventListener('click', this.nextSL)
  }

  #getDots(){
    const dotsBlock = document.createElement('div')
    dotsBlock.classList.add('slider__dots')
    const count = this.$slider.children.length - 2
    for(let i = 0; i < count; i++){
      if(i === 0){
        dotsBlock.insertAdjacentHTML('afterbegin', '<li class="active"></li')
      } else {
        dotsBlock.insertAdjacentHTML('beforeend', '<li></li>')
      }
    }
    this.$slWrapper.insertAdjacentElement('beforeend', dotsBlock)
    const dots = [...dotsBlock.children]
    dots.forEach((dt, idx) => {
      dt.addEventListener('click', e => {
        this.currentSlide = idx+1
        this.#render()
      })
    })
  }

  #implementAutoplay(time){
    setInterval(() => {
      this.nextSL()
    }, time)
  }
}
