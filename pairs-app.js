import { AmazingCard } from "./module.js";


// get elements from DOM
let levels = document.querySelector('#rows-cols');
let list = document.querySelector('#list');

const startGame = document.querySelector('#btn-start');
const endGame = document.querySelector('#btn-end');
const showResults = document.querySelector('#btn-results');
const playerName = document.querySelector('#player');
const again = document.querySelector('#btn-again');

const currentResultElem = document.querySelector('#current');
const bestResultsElem = document.querySelectorAll('.results');

const congrats = document.querySelector('.congrats');
const blockAgain = document.querySelector('.block-again');
const message = document.querySelector('.congrats__message');

const timerEl = document.querySelector('.timer');
let timerValue = 1;
const moves = document.querySelector('.move');
let movesValue = 0;

// create array of card objects
let arrCard = [];

// Set timer
let startTimer;

// ------------------------------------------------------------------------------

let checkArr = [];
let matchArr = [];
let results = {};

// -----------------------------------------------------------------------

// Event 'click' on start button -> create objects,
// push them in array, create elements of list in DOM

function attr() {
  startGame.setAttribute("disabled", "disabled");
  endGame.removeAttribute("disabled");
  levels.setAttribute("disabled", "disabled");
  showResults.setAttribute("disabled", "disabled");
  playerName.setAttribute("disabled", "disabled");
}

function countMoves() {
  const cardElements = document.querySelectorAll('.item');
  console.log(cardElements);
  cardElements.forEach((e) => {
    e.addEventListener('click', () => {
      if (e.classList.contains('turn')) {
        movesValue++;
        moves.innerHTML = movesValue;
      }
      console.log(movesValue);
    })
  })
}

// Timer function
function timer() {
  timerEl.innerHTML = timerValue++;
}

startGame.addEventListener('click', () => {
  // Create field
  async function createField() {

    let rv = levels.options[levels.selectedIndex].getAttribute('data-rows');
    let cv = levels.options[levels.selectedIndex].getAttribute('data-cols');

    // Functions

    function createObj() {
      for (let i = 1; i <= (rv * cv); i++) {

        let createCardObj = (arr) => {

          function getCardNumber() {
            if (i <= (rv * cv / 2)) {
              return i;
            } else {
              return (rv * cv - i + 1);
            }
          }

          let card = new AmazingCard(list, getCardNumber(), function () {

            if (!this.open) {
              this.open = true;
            } else {
              this.open = false;
            }

            checkArr.push(this);

            if (checkArr.length === 2 && checkArr[0] === checkArr[1]) {
              checkArr = [];
            }
            else if (checkArr.length === 2 && checkArr[0].cardNumber === checkArr[1].cardNumber) {
              checkArr[0].success = true;
              checkArr[1].success = true;
              checkArr = [];
              matchArr.push('good');
            }
            else if (checkArr.length > 2 && checkArr[0].cardNumber != checkArr[1].cardNumber) {

              function threeCards() {

                checkArr[0].open = false;
                checkArr[1].open = false;

                checkArr.splice(0, 2);
              }

              setTimeout(threeCards, 300);
            }

            if (matchArr.length >= 2 && arrCard.length === matchArr.length * 2) {
              congrats.classList.add('congrats-act');
              blockAgain.classList.add('block-again-act');
              clearInterval(startTimer);
              again.innerHTML = "Играть еще раз";
              setResults(levels.value);
              showCurrentResult();
              showBestResults(levels.value);
              endGame.setAttribute("disabled", "disabled");
            }

          });

          arr.push(card);
        }

        createCardObj(arrCard);
      }
    }

    // Start create field

    startTimer = setInterval(timer, 1000);

    // positioning card on field with GRID
    list.style.gridTemplateRows = "repeat(" + rv + ", 1fr)";
    list.style.gridTemplateColumns = "repeat(" + cv + ", 1fr)";
    // ---------------------

    attr();

    createObj();

    // shuffling of card array
    function shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    }
    shuffle(arrCard);

    // create DOM list

    function createDOM() {
      for (const card of arrCard) {
        card.createElement();
        card.getCardImg();
      }
    }
    return createDOM();
  }

  createField()
    .then(countMoves());
})

// RESULTS

function timeTransformer(time) {
  if (time < 60) {
    return `${time} сек`
  } else {
    return `${Math.floor(time / 60)} мин ${time % 60} сек`
  }
}

function getResults() {
  if (localStorage.getItem('bestResults')) {
    return results = JSON.parse(localStorage.getItem('bestResults'));
  }
}

function setResults(level) {
  getResults();

  if (!results[`${level}`]) {
    results[`${level}`] = [];
  }

  results[`${level}`].push({ res: +timerEl.textContent, name: (playerName.value ? playerName.value : 'No name'), moves: +moves.textContent + 1 });

  results[`${level}`].sort((a, b) => a.res !== b.res ? a.res - b.res : a.moves - b.moves);

  results[`${level}`].length = results[`${level}`].length < 8 ? results[`${level}`].length : 8;

  localStorage.setItem('bestResults', JSON.stringify(results));
}

function showBestResults(level) {
  bestResultsElem.forEach((e) => {
    e.innerHTML = '';
  })

  if (results[`${level}`]) {
    for (let i = 0; i < results[`${level}`].length; i++) {

      bestResultsElem.forEach((e) => {
        let bestItem = document.createElement('li');
        bestItem.classList.add('results__item');
        e.append(bestItem);

        let resultTime = document.createElement('span');
        resultTime.innerHTML = `${timeTransformer(results[`${level}`][i].res)}`

        let player = document.createElement('span');
        player.innerHTML = `${i + 1}. ` + results[`${level}`][i].name;

        let resultMoves = document.createElement('span');
        resultMoves.innerHTML = results[`${level}`][i].moves + ' ' + 'ход.';

        bestItem.append(player);
        bestItem.append(resultMoves);
        bestItem.append(resultTime);
      })
    }
  }
  else {
    bestResultsElem.forEach((e) => {
      e.innerHTML = 'Результатов пока нет';
    })
  }
}

function showCurrentResult() {
  currentResultElem.innerHTML = timeTransformer(timerEl.textContent);
  console.log(results);
}

// Event 'click' on the end game button -> clear list, clear array

showResults.addEventListener('click', () => {
  again.innerHTML = "Закрыть";
  message.classList.add('congrats__message-none');
  getResults();
  congrats.classList.add('congrats-act');
  blockAgain.classList.add('block-again-act');
  showBestResults(levels.value);
  attr();
  endGame.setAttribute("disabled", "disabled");
})

function afterGame() {
  list.style.gridTemplateRows = "none";
  list.style.gridTemplateColumns = "none";

  startGame.removeAttribute("disabled");
  levels.removeAttribute("disabled");
  showResults.removeAttribute("disabled");
  playerName.removeAttribute("disabled");

  timerEl.innerHTML = 0;
  timerValue = 1;
  movesValue = 0;
  moves.innerHTML = movesValue;

  arrCard = [];
  checkArr = [];
  matchArr = [];

  list.innerHTML = '';
}

endGame.addEventListener('click', () => {
  afterGame();
  clearInterval(startTimer);
  endGame.setAttribute("disabled", "disabled");
})

again.addEventListener('click', () => {
  afterGame();
  message.classList.remove('congrats__message-none');
  congrats.classList.remove('congrats-act');
  blockAgain.classList.remove('block-again-act');
})



