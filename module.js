export class Card {
  constructor(container, number, flip) {
    this.container = container;
    this.cardNumber = number;
    this.flip = flip;
  }

  createElement() {
    const item = document.createElement('li');
    item.classList.add('item');
    this.container.append(item);

    const numberText = document.createElement('p');
    numberText.classList.add('number');
    numberText.textContent = this.cardNumber;
    const heigth = document.querySelector('.item').offsetHeight;
    numberText.style.fontSize = (heigth * 0.7) + 'px';
    item.append(numberText);

    item.addEventListener('click', () => {
      this.flip();
    })

    this.cardElement = item;
    return item;
  }


  set cardNumber(value) {
    this._cardNumber = value;
  }
  get cardNumber() {
    return this._cardNumber;
  }

  set open(value) {
    this._open = value;
    if (this._open) {
      this.cardElement.classList.add('turn');
    } else {
      this.cardElement.classList.remove('turn');
    }
  }
  get open() {
    return this._open;
  }

  set success(value) {
    this._success = value;
    if (this._success) {
      this.cardElement.classList.add('dis');
    }
  }
  get success() {
    return this._success;
  }
}

export class AmazingCard extends Card {
  getCardImg() {
    const cardImgArr = ['./img/1.png', './img/2.png', './img/3.png', './img/4.png',
      './img/5.png', './img/6.png', './img/7.png', './img/8.png', './img/9.png', './img/10.png',
      './img/11.png', './img/12.png', './img/13.png', './img/14.png', './img/15.png', './img/16.png',
      './img/17.png', './img/18.png', './img/19.png', './img/20.png', './img/21.png', './img/22.png',
      './img/23.png', './img/24.png', './img/25.png', './img/26.png', './img/27.png', './img/28.png',
      './img/29.png', './img/30.png', './img/31.png', './img/32.png', './img/33.png', './img/34.png',
      './img/35.png', './img/36.png', './img/37.png', './img/38.png', './img/39.png', './img/40.png',
      './img/41.png', './img/42.png', './img/43.png', './img/44.png', './img/45.png', './img/46.png',
      './img/47.png', './img/48.png', './img/49.png', './img/50.png'];

    const image = document.createElement('img');
    image.classList.add('card-img');
    image.src = cardImgArr[this._cardNumber - 1];
    image.onerror = function () {
      image.classList.add('back');
      image.src = './img/default.png';
    }

    this.cardElement.append(image);
    return image;
  }
}
