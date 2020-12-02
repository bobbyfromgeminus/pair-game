'use strict';

const cardContainer = document.querySelector('.card-container');            // kártyatartó
const cards = document.querySelectorAll('.card');                           // kártyák
const clickDisplay = document.querySelector('.click-display');              // kattintás kijelző
let openCards = 0;                                                          // felfordított kártyák száma - max 2 lehet
let openOne = 0;                                                            // első felfordított kártya értéke
let openTwo = 0;                                                            // második felfordított kártya értéke
let tempId = -1;                                                            // ideiglenes tároló az elsőként felfordított kártya indexével
let tempId2 = -1;                                                           // ideiglenes tároló a másodikkéntként felfordított kártya indexével
let tempCard;                                                               // ideiglenes tároló az elsőként felfordított kártyához
let counter = 0;                                                            // kattintás számláló
let isPaired = 0;                                                           // megtalált párosok száma

const test = document.querySelector('.test');

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
    flagCards(shuffleArray(arr1));
    cards.forEach((element, index) => element.classList.remove('card-open'));
    cards.forEach((element, index) => element.classList.add('card-bg_close'));
    cards.forEach((element, index) => element.classList.remove('card-bg_1'));
    cards.forEach((element, index) => element.classList.remove('card-bg_2'));
    cards.forEach((element, index) => element.classList.remove('card-bg_3'));
    cards.forEach((element, index) => element.classList.remove('card-bg_4'));
    cards.forEach((element, index) => element.classList.remove('card-bg_5'));
    counter = 0;
    isPaired = 0;
    cardEventListeners();
}

function openCard(card, i) {
    cards.forEach((element, index) => element.classList.remove('card-open'));
    card.classList.add('card-open');
    card.classList.add('card-bg_'+i);
    card.classList.remove('card-bg_close');
}

function closeCard() {
    cards.forEach((element, index) => element.classList.remove('card-open'));
    //cards[tempId].classList.add('card-open');
    //cards[tempId2].classList.add('card-open');
    cards[tempId].classList.remove('card-bg_'+openOne);
    cards[tempId].classList.add('card-bg_close');
    cards[tempId2].classList.remove('card-bg_'+openTwo);
    cards[tempId2].classList.add('card-bg_close');
    console.log(tempId);
    console.log(tempId2);
}

function checkCard() {
    counter += 1;
    const i = parseInt(this.id);
    console.log(this.dataset.card);
    openCard(this, this.dataset.card);
    if (i === tempId) {
        openCards = 0;
        cardContainer.classList.add('box-shaker');
    } else {
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