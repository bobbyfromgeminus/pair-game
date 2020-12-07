'use strict';

const cardContainer = document.querySelector('.card-container');            // kártyatartó
const cards = document.querySelectorAll('.card');                           // kártyák
const clickDisplay = document.querySelector('.click-display');              // kattintás kijelző
const timeDisplay = document.querySelector('.time-display');                // játékidő kijelző
let openCards = 0;                                                          // felfordított kártyák száma - max 2 lehet
let openOne = 0;                                                            // első felfordított kártya értéke
let openTwo = 0;                                                            // második felfordított kártya értéke
let tempId = -1;                                                            // ideiglenes tároló az elsőként felfordított kártya indexével
let tempId2 = -1;                                                           // ideiglenes tároló a másodikkéntként felfordított kártya indexével
let tempCard;                                                               // ideiglenes tároló az elsőként felfordított kártyához
let counter = 0;                                                            // kattintás számláló
let isPaired = 0;                                                           // megtalált párosok száma
let isStarted = 0;                                                          // elindult-e a játék
let time = 0;                                                               // játékidő

// Rendezett kártya tömb
const arr1 = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];

// Kártyák összekeverése
const shuffleArray = (array) => {
    for (let i = 0; i < array.length; i += 1) {
        let randomIndex = Math.floor(Math.random() * (i + 1));  // 
        let itemAtIndex = array[randomIndex];
        array[randomIndex] = array[i];
        array[i] = itemAtIndex;
    }
    return array;
}

// Kártyák felcímkézése a rendezett tömb elemei szerint
const flagCards = (array) => {
    for (let i = 0; i < array.length; i += 1) {
        cards[i].dataset.card = array[i];
        cards.forEach((element, index) => element.classList.remove('success'));
        cards.forEach((element, index) => element.classList.remove('card-open'));
    }
}

const gameOver = () => {
    const resultBox = document.querySelector('.game-over');
    resultBox.innerHTML = `<h1>Gratulálok!</h1>${counter} fordításból, ${time} másodperc alatt megtaláltad a párokat!<br>De már jön is a következő...`;
    resultBox.classList.add('show');
    setTimeout(function () {
        flagCards(shuffleArray(arr1));
        cards.forEach((element, index) => element.classList.remove('card-open'));
        cards.forEach((element, index) => element.classList.add('card-open'));
        cards.forEach((element, index) => element.classList.add('card-bg_close'));
        cards.forEach((element, index) => element.classList.remove('card-bg_1'));
        cards.forEach((element, index) => element.classList.remove('card-bg_2'));
        cards.forEach((element, index) => element.classList.remove('card-bg_3'));
        cards.forEach((element, index) => element.classList.remove('card-bg_4'));
        cards.forEach((element, index) => element.classList.remove('card-bg_5'));
        counter = 0;
        isPaired = 0;
        cardEventListeners();
        isStarted = 0;
        time = 0;
        openOne = 0;
        openTwo = 0;
        tempId = -1;
        tempId2 = -1;
        clickDisplay.textContent = counter;
        timeDisplay.textContent = time;
        resultBox.classList.remove('show');
        setTimeout(function() {
            cards.forEach((element, index) => element.classList.remove('card-open'));
        }, 1000);
    }, 5000);
}

function convertTime(time) {
    let mins = Math.floor(time/60);
    let secs = time % 60;
    if (mins < 10) mins = `0${mins}`;
    if (secs < 10) secs = `0${secs}`;
    return(`${mins}:${secs}`);
}


function startTime() {
    if (isStarted === 0) {
        isStarted = 1;
        const startInterval = setInterval(function() {
            timeDisplay.textContent = convertTime(time);
            time += 1;
            if (isPaired === 5) clearInterval(startInterval);
        }, 1000);
    }
}

function openCard(card, i) {
    startTime();
    cards.forEach((element, index) => element.classList.remove('card-open'));
    card.classList.add('card-open');
    setTimeout(function () {
        card.classList.add('card-bg_'+i);
        card.classList.remove('card-bg_close');
    }, 500);
    setTimeout(function () {
        card.classList.remove('card-open');
    }, 1000);
}

function closeCard() {
    cards.forEach((element, index) => element.classList.remove('card-open'));
    cards[tempId].classList.add('card-open');
    cards[tempId2].classList.add('card-open');
    setTimeout(function () {
        cards[tempId].classList.remove('card-bg_'+openOne);
        cards[tempId].classList.add('card-bg_close');
        cards[tempId2].classList.remove('card-bg_'+openTwo);
        cards[tempId2].classList.add('card-bg_close');
    }, 500);
}

function checkCard() {
    counter += 1;
    const i = parseInt(this.dataset.id);
    if (i === tempId) {
        openCards = 0;
        cardContainer.classList.add('box-shaker');
    } else {
        openCard(this, this.dataset.card);
        if (openCards === 0) {
            openCards += 1;
            openOne = cards[i].dataset.card;
            tempId = i;
            tempCard = this;
        } else {
            tempId2 = i;
            openCards = 0;
            openTwo = cards[i].dataset.card;
            if (openOne === openTwo) {
                cards[i].classList.add('success');
                cards[tempId].classList.add('success');
                this.removeEventListener('click', checkCard);
                tempCard.removeEventListener('click', checkCard);
                isPaired += 1;
                if (isPaired===5) gameOver();
            } else {
                const closeCards = setTimeout(closeCard, 2000);
            }
        }
    }
    clickDisplay.textContent = counter;
}


const removeShake = () => cardContainer.classList.remove('box-shaker');

function cardEventListeners() {
    for (let i = 0; i < cards.length; i += 1) {
        cards[i].addEventListener('click', checkCard);
    }
}

cardContainer.addEventListener("webkitAnimationEnd", removeShake, false);

// tömb összekeverése és kiosztása a kártyákra
flagCards(shuffleArray(arr1));
cardEventListeners();