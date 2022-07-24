window.addEventListener('DOMContentLoaded', function () {
  // get elements from DOM
  let rows = document.querySelector('#rows');
  let columns = document.querySelector('#columns');
  let list = document.querySelector('#list');

  const startGame = document.querySelector('#btn-start');
  const endGame = document.querySelector('#btn-end');
  const again = document.querySelector('#btn-again');

  let timerEl = document.querySelector('.timer');
  let timerValue = Number(timerEl.textContent);

  // create array of card objects
  let arrCard = [];

  // Set timer
  let startTimer;

  // Event 'click' on start button -> create objects,
  // push them in array, create elements of list in DOM

  startGame.addEventListener('click', () => {
    // Timer function
    function timer() {
      if (timerValue >= 0) {
        timerEl.innerHTML = timerValue--;
      } else {
        clearInterval(startTimer);
        cards.forEach(el => {
          el.classList.add('turn', 'dis');
        })
        document.querySelector('.game-over').classList.add('message-act');
        document.querySelector('.block-again').classList.add('block-again-act');
        endGame.setAttribute("disabled", "disabled");
      }

      if (timerValue < 10) {
        timerEl.classList.add('timer-red');
      }
    }

    // Create field
    function createField() {
      let rv = rows.value;
      let cv = columns.value;

      if (!rv || !cv) {
        alert("Задайте размеры игрового поля");
        return;
      };

      // Functions

      function attr() {
        startGame.setAttribute("disabled", "disabled");
        endGame.removeAttribute("disabled");
        rows.setAttribute("disabled", "disabled");
        columns.setAttribute("disabled", "disabled");
      }

      function createObj() {
        for (let i = 1; i <= (rv * cv); i++) {

          let createCardObj = (arr) => {
            let cardObj = {};

            cardObj.name = function () {
              if (i <= (rv * cv / 2)) {
                return i;
              } else {
                return (rv * cv - i + 1);
              }
            }();
            cardObj.id = i;

            arr.push(cardObj);
          }

          createCardObj(arrCard);
        }
      }

      // Main if

      if (rv % 2 === 0 && cv % 2 === 0 && rv >= 2 && cv >= 2 && rv <= 10 && cv <= 10) {

        startTimer = setInterval(timer, 1000);

        // positioning card on field with GRID
        list.style.gridTemplateRows = "repeat(" + rv + ", 1fr)";
        list.style.gridTemplateColumns = "repeat(" + cv + ", 1fr)";
        // ---------------------

        attr();

        createObj();

        rows.value = '';
        columns.value = '';

      } else {
        alert("Ввод только четных чисел в диапазоне от 2 до 10");

        // default values
        rows.value = '4';
        columns.value = '4';
      }
    }
    createField();

    // shuffling of card array
    function shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    }
    shuffle(arrCard);

    // create DOM list

    function createDOM() {
      for (let i = 0; i < arrCard.length; i++) {
        let item = document.createElement('li');
        item.classList.add('item');
        list.append(item);

        let number = document.createElement('p')
        number.classList.add('number');
        item.append(number);

        item.id = arrCard[i].id;
        number.innerHTML = arrCard[i].name;

        let heigth = document.querySelector('.item').offsetHeight;

        number.style.fontSize = (heigth * 0.7) + 'px';
      }
    }
    createDOM();

    // flip effect

    const cards = document.querySelectorAll('.item');

    let checkArr = [];
    let matchArr = [];

    function flip() {
      this.classList.toggle('turn');

      for (let i = 0; i < arrCard.length; i++) {
        if (this.id === arrCard[i].id.toString()) {
          checkArr.push(arrCard[i]);
        }
      }

      if (checkArr.length === 2 && checkArr[0] === checkArr[1]) {
        checkArr = [];
      } else if (checkArr.length === 2 && checkArr[0].name === checkArr[1].name) {
        document.querySelectorAll('.turn').forEach((el) => {
          el.classList.add('dis');
        })
        checkArr = [];
        matchArr.push('good');

      } else if (checkArr.length > 2 && checkArr[0].name != checkArr[1].name) {

        function threeCards() {
          document.getElementById(checkArr[0].id).classList.remove('turn');
          document.getElementById(checkArr[1].id).classList.remove('turn');

          checkArr.splice(0, 2);
        }

        setTimeout(threeCards, 300);
      }

      console.log(checkArr);

      if (matchArr.length >= 2 && arrCard.length === matchArr.length * 2) {
        document.querySelector('.congrats').classList.add('message-act');
        document.querySelector('.block-again').classList.add('block-again-act');
        clearInterval(startTimer);
        endGame.setAttribute("disabled", "disabled");
      }

      console.log(matchArr, matchArr.length * 2, arrCard.length);
    }

    cards.forEach(card => card.addEventListener('click', flip));

  })

  // Event 'click' on the end game button -> clear list, clear array

  function afterGame() {
    list.style.gridTemplateRows = "none";
    list.style.gridTemplateColumns = "none";

    startGame.removeAttribute("disabled");
    rows.removeAttribute("disabled");
    columns.removeAttribute("disabled");

    timerEl.innerHTML = 60;
    timerValue = 60;
    timerEl.classList.remove('timer-red');

    arrCard = [];

    list.innerHTML = '';
  }

  endGame.addEventListener('click', () => {
    afterGame()
    clearInterval(startTimer);
    endGame.setAttribute("disabled", "disabled");
  })

  again.addEventListener('click', () => {
    afterGame()

    document.querySelector('.game-over').classList.remove('message-act');
    document.querySelector('.congrats').classList.remove('message-act');
    document.querySelector('.block-again').classList.remove('block-again-act');
  })

})


