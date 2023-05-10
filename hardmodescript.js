
//classes
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

class Deck {
    cardsArray = [];

    constructor() {
        this.populateDeck();
    }

    removeTopCard() {
        return this.cardsArray.shift();
    }

    populateDeck() { //add all 52 cards to deck starting from 2 to ace
        for (let i = 2; i <= 14; i++) {
            if (i < 11) {
                this.addAllCardsFromEachSuit(this.addAllSuit(i));
            } else {
                let tempRank = '';
                switch (i) {
                    case 11:
                        tempRank = 'jack';
                        break;
                    case 12:
                        tempRank = 'queen';
                        break;
                    case 13:
                        tempRank = 'king';
                        break;
                    case 14:
                        tempRank = 'ace';
                        break;
                }
                this.addAllCardsFromEachSuit(this.addAllSuit(tempRank));
            }

        }
    }
    addAllSuit(rank) { //returns an array of Card objects
        rank = String(rank);
        let tempSuit = '';
        let cardArray = []; //holds an array of Card objects
        for (let i = 1; i <= 4; i++) {
            switch (i) {
                case 1:
                    tempSuit = 'spades';
                    break;
                case 2:
                    tempSuit = 'cloves';
                    break;
                case 3:
                    tempSuit = 'diamonds';
                    break;
                case 4:
                    tempSuit = 'hearts';
                    break;
            }
            let tempCard = new Card(rank, tempSuit);
            cardArray.push(tempCard);

        }
        return cardArray;
    }
    addAllCardsFromEachSuit(suitArray) {
        for (let i = 0; i < suitArray.length; i++) {
            this.cardsArray.push(suitArray[i]);
        }
    }
    shuffle() { //shuffle cards in deck randomly
        const posOrNeg = function () {
            if (Math.trunc(Math.random() * 2) + 1 === 1) {
                return -1;
            } else {
                return 1;
            }
        }
        this.cardsArray.sort(posOrNeg);
    }




}

//game objects
const deck = new Deck();
let clickedShuffle = false;
let clickedCutDeck = false;
let canFlipTopCard = false;
let canClickStart = true;
let canClickNextRound = false;
let highLowResult = '';
let colorResult = '';
let score = 0;
let topCard = null;
let gameOver = false;

//select HTML elements

//button elements
const shuffleDeckButton = document.querySelector('.shuffleDeck');
const cutDeckButton = document.querySelector('.cutDeck');
const flipTopCardButton = document.querySelector('.flipTopCard');
const firstChoiceButton = document.querySelector('.firstChoice');
const secondChoiceButton = document.querySelector('.secondChoice');
const nextRoundButton = document.querySelector('.nextRound');
const startButton = document.querySelector('.startGame');

//paragraph elements
const statusParagraphElement = document.querySelector('.status');
const askHighOrLowRedBlackParagraphElement = document.querySelector('.AskHighOrLowRedBlack');
const scoreParagraphElement = document.querySelector('.Score');
const cardsLeftParagraphElement = document.querySelector('.CardsLeft');

//image elements (cards)
const topCardFaceDownImageElement = document.querySelector('#TopCardFaceDown');
const nextCardFaceDownImageElement = document.querySelector('#NextCardFaceDown');


//functions
const compareRankAndColorFirstChoice = function (deck) {
    if (firstChoiceButton.textContent === 'High') {
        const topCardRank = convertRankStringToNumber(topCard.rank);
        const nextCardRank = convertRankStringToNumber(deck.cardsArray[0].rank);
        console.log(`topCardRank = ${topCardRank}`); //test code
        console.log(`nextCardRank = ${nextCardRank}`); //test code
        if (nextCardRank > topCardRank) {
            highLowResult = 'right';
        } else if (nextCardRank < topCardRank) {
            highLowResult = 'wrong';
        } else {
            highLowResult = 'same rank';

        }

        if (highLowResult === 'same rank') {
            highLowResult = '';
            revealCard(deck, nextCardFaceDownImageElement, nextCardFaceDownImageElement);
            canClickNextRound = true;
            alert('The two cards have the same rank. Click on Next Round to start the next round.');
        } else {
            askHighOrLowRedBlackParagraphElement.textContent = "Red or Black?";
            firstChoiceButton.textContent = "Red";
            secondChoiceButton.textContent = "Black";
        }

    } else { //if asking for red or black
        if (determineColor(deck.cardsArray[0]) === 'red') {
            colorResult = 'right';
        } else {
            colorResult = 'wrong';
        }
        askHighOrLowRedBlackParagraphElement.textContent = 'You can flip the next card now.'


    }


}

const compareRankAndColorSecondChoice = function (deck) {
    if (secondChoiceButton.textContent === 'Low') {
        const topCardRank = convertRankStringToNumber(topCard.rank);
        const nextCardRank = convertRankStringToNumber(deck.cardsArray[0].rank);
        console.log(`topCardRank = ${topCardRank}`); //test code
        console.log(`nextCardRank = ${nextCardRank}`); //test code
        if (nextCardRank < topCardRank) {
            highLowResult = 'right';
        } else if (nextCardRank > topCardRank) {
            highLowResult = 'wrong';
        } else {
            highLowResult = 'same rank';

        }

        if (highLowResult === 'same rank') {
            highLowResult = '';
            revealCard(deck, nextCardFaceDownImageElement, nextCardFaceDownImageElement);
            canClickNextRound = true;
            alert("The two cards have the same rank. Flip another card. Click Next Round.");
        } else {
            askHighOrLowRedBlackParagraphElement.textContent = "Red or Black?";
            firstChoiceButton.textContent = "Red";
            secondChoiceButton.textContent = "Black";

        }

    } else { //if asking for red or black
        if (determineColor(deck.cardsArray[0]) === 'black') {
            colorResult = 'right';
        } else {
            colorResult = 'wrong';
        }
        askHighOrLowRedBlackParagraphElement.textContent = 'You can flip the next card now.'


    }

}



const processResult = function () {
    if (highLowResult === 'right' && colorResult === 'right') {
        score++;
    }
    highLowResult = '';
    colorResult = '';
    scoreParagraphElement.textContent = score;
    askHighOrLowRedBlackParagraphElement.textContent = 'You can click Next Round now.'
    canClickNextRound = true;
    if (deck.cardsArray.length === 0) {
        alert('Game over');
        gameOver = true;
        askHighOrLowRedBlackParagraphElement.textContent = 'Game over';
    }


}

const determineColor = function (card) {
    let color = '';
    switch (card.suit) {
        case 'spades':
        case 'cloves':
            color = 'black';
            break;
        case 'diamonds':
        case 'hearts':
            color = 'red';


    }

    return color;


}

const convertRankStringToNumber = function (rankString) { //converts rank string to rank number
    let rankNumber = 0;
    if (!isNaN(Number(rankString))) {
        rankNumber = Number(rankString);
    } else {
        switch (rankString) {
            case 'jack':
                rankNumber = 11;
                break;
            case 'queen':
                rankNumber = 12;
                break;
            case 'king':
                rankNumber = 13;
                break;
            case 'ace':
                rankNumber = 14;
                break;
        }

    }
    return rankNumber;

}


//functions for button event listeners
const shuffleDeck = async function (deck) {
    if (!clickedShuffle && !gameOver) {
        clickedShuffle = true;
        deck.shuffle();
        if (!statusParagraphElement.classList.contains('ShufflingStatus')) {
            statusParagraphElement.classList.add('ShufflingStatus');
        }
        statusParagraphElement.textContent = 'Shuffling...';
        await new Promise(resolve => setTimeout(resolve, 1200));
        statusParagraphElement.textContent = '';
    } else {
        alert('You cannot shuffle until a new game.')
    }
}
const nextRound = function () {
    if (canClickNextRound && !gameOver) {
        canClickNextRound = false;
        canClickStart = true;
        topCardFaceDownImageElement.src = 'facedown.png';
        nextCardFaceDownImageElement.src = 'facedown.png';
        firstChoiceButton.textContent = '';
        secondChoiceButton.textContent = '';
        askHighOrLowRedBlackParagraphElement.textContent = 'You can click start now.';
    } else {
        alert('Please finish the round first.');
    }



}
const flipNextCard = function (deck, nextCardFaceDownImageElement) {
    if (highLowResult !== '' && colorResult !== '' && !gameOver) {
        revealCard(deck, nextCardFaceDownImageElement);
        processResult();

    } else {
        alert('You cannot flip until you make a guess for high/low and red/black.');
    }

}
const cutDeck = async function (deck) { //modifies the deck object in place
    if (!clickedCutDeck) {
        clickedCutDeck = true;
        const topHalf = deck.cardsArray.slice(0, deck.length / 2);
        const bottomhalf = deck.cardsArray.slice(deck.length / 2, deck.length);
        const newDeck = bottomhalf.concat(topHalf);
        deck.cardsArray = Array.from(newDeck);
        if (!statusParagraphElement.classList.contains('ShufflingStatus')) {
            statusParagraphElement.classList.add('ShufflingStatus');
        }
        statusParagraphElement.textContent = 'Cutting...';
        await new Promise(resolve => setTimeout(resolve, 1200));
        statusParagraphElement.textContent = '';

    } else {
        alert('You cannot cut until a new game.')
    }

}

const startGame = function () {
    if (clickedShuffle && clickedCutDeck && canClickStart) {
        topCard = revealCard(deck, topCardFaceDownImageElement);
        canClickStart = false;
        askHighOrLowRedBlackParagraphElement.textContent = "High or low?";
        firstChoiceButton.textContent = "High";
        secondChoiceButton.textContent = "Low";


    } else {
        alert('You have to shuffle and cut the deck first or wait until a new round.');
    }
}

const convertRankToWord = function (rank) {
    let rankWord = '';
    switch (rank) {
        case '2':
            rankWord = 'two';
            break;
        case '3':
            rankWord = 'three';
            break;
        case '4':
            rankWord = 'four';
            break;
        case '5':
            rankWord = 'five';
            break;
        case '6':
            rankWord = 'six';
            break;
        case '7':
            rankWord = 'seven';
            break;
        case '8':
            rankWord = 'eight';
            break;
        case '9':
            rankWord = 'nine';
            break;
        case '10':
            rankWord = 'ten';
            break;
        default:
            return rank;


    }
    return rankWord;

}

const revealCard = function (deck, cardImageElement) {
    //reveal top card
    let cardToBeRevealed = deck.removeTopCard();
    console.log(`card rank: ${cardToBeRevealed.rank} card suit: ${cardToBeRevealed.suit}`); //test code
    //capitalize the first letter
    let capitalizedSuit = cardToBeRevealed.suit.charAt(0).toUpperCase() + cardToBeRevealed.suit.slice(1);
    //translate number to word
    let rankWord = convertRankToWord(cardToBeRevealed.rank);
    let cardStr = rankWord + "Of" + capitalizedSuit + ".png";
    console.log(cardStr); //test code
    cardImageElement.src = cardStr;
    updateCardsLeft(deck, cardsLeftParagraphElement);
    return cardToBeRevealed;


}

const updateCardsLeft = function (deck, cardsLeftParagraphElement) {
    cardsLeftParagraphElement.textContent = deck.cardsArray.length;

}

updateCardsLeft(deck, cardsLeftParagraphElement);



//event listeners for buttons
shuffleDeckButton.addEventListener('click', shuffleDeck.bind(null, deck));
cutDeckButton.addEventListener('click', cutDeck.bind(null, deck));
flipTopCardButton.addEventListener('click', flipNextCard.bind(null, deck, nextCardFaceDownImageElement));
startButton.addEventListener('click', startGame);
firstChoiceButton.addEventListener('click', compareRankAndColorFirstChoice.bind(null, deck));
secondChoiceButton.addEventListener('click', compareRankAndColorSecondChoice.bind(null, deck));
nextRoundButton.addEventListener('click', nextRound);











