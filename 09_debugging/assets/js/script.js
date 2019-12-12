/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// Variables
const app = document.querySelector('#app');
const scoreWins = document.querySelector('#scoreWins');
const monstersFound = document.querySelector('#monstersFound');
const gamesPlayed = document.querySelector('#gamesPlayed');

// The monsters and socks
var monsters = [
  'monster1',
  'monster2',
  'monster3',
  'monster4',
  'monster5',
  'monster6',
  'monster7',
  'monster8',
  'monster9',
  'monster10',
  'monster11',
  'sock'
];

// 🐛@bug variable defined but not used - should be "found"
// var count;
var found;
let score = { wins: 0, games: 0 };
var socks;

/**
 * Render the grid of monsters onto the game board
 */
var renderMonsters = function () {
  // Reset the number of monsters who have been found
  found = 0;
  monstersFound.innerHTML = found;
  // Shuffle the monsters array
  shuffle(monsters);
  // Create the HTML and inject it into the DOM
  // A button element is focusable and conveys to screen readers that it can be clicked
  // The data-monster-id stores the index of the monster in our array
  app.innerHTML =
    '<div class="row">' +
      monsters.map(function (monster, index) {
        var html =
          '<div class="grid" aria-live="polite">' +
            '<button data-monster-id="' + index + '">' +
              '<img alt="Click the door to see what\'s behind it" src="assets/img/door.svg">' +
            '</button>' +
          '</div>';
        return html;
      }).join('') +
    '</div>';
};
/**
 * Render a new UI when the player loses
 */
var renderLost = function () {
  score.games++;
  gamesPlayed.innerHTML = score.games;
  app.innerHTML +=
    '<div class="overlay">' +
      '<div class="message">' +
        '<div class="content">' +
          '<h3 class="result">You\'ve been socked!</h3>' +
          '<p><button id="play" data-monster-play-again>Play Again</button></p>' +
        '</div>' +
      '</div>' +
    '</div>';
    document.getElementById("play").focus();
};
/**
 * Render a new UI when the player wins
 */
var renderWon = function () {
  score.games++;
  gamesPlayed.innerHTML = score.games;
  score.wins++;
  scoreWins.innerHTML = score.wins;
    app.innerHTML +=
    '<div class="overlay">' +
      '<div class="message">' +
        '<div class="content">' +
          '<h3 class="result">Great job!</h3>' +
          '<p><button id="play" data-monster-play-again>Play Again</button></p>' +
        '</div>' +
      '</div>' +
    '</div>';
    document.getElementById("play").focus();
};


/**
 * Handle click events
 * @param  {Event} event The event object
 */
var clickHandler = function (event) {
  // If a "play again" button was clicked, reset the UI and end the callback function
  // 🐛@bug incorrect property value -don;t use square brackets
  // if (event.target.hasAttribute('[data-monster-play-again]')) {
  if (event.target.hasAttribute('data-monster-play-again')) {
    renderMonsters();
    return;
  }
  // Check if clicked element or it's parent has a [data-monster-id] attribute
  // If not, it's not a monster
  // return and stop running our callback function

  // 🐛@bug incorrect selector for attribute - needs square brackets
  // var monster = event.target.closest('data-monster-id');
  var monster = event.target.closest('[data-monster-id]');
  if (!monster) return;
  // Get the monster's index in the array
  var id = monster.getAttribute('data-monster-id');
  // If the door reveals a sock, render the lost UI
  // Then, end the callback function

  // 🐛@bug setting variable instead of comparing
  // 🐛@bug typo on sock
  // if (monsters[id] = 'socks') {
  if (monsters[id] === 'sock') {
    monster.parentNode.innerHTML = '<img alt="' + monsters[id] + '" src="assets/img/' + monsters[id] + '.svg">';
    renderLost();
    return;
  }
  // Update the HTML for the button's parent element
  // This will replace the button so that the content can't be clicked again
  // We'll use the id to get the monster from our shuffled array
  monster.parentNode.innerHTML = '<img alt="' + monsters[id] + '" src="assets/img/' + monsters[id] + '.svg">';
  // Increase the number of monsters who have been found by 1
  found++;
  monstersFound.innerHTML = found;
  // If the number of monsters found is equal to the total number (-1 for the sock)
  // then all monsters have been found and we can render the win UI
  if (found === (monsters.length - 1)) {
    renderWon();
  }
};
//
// Inits & Event Listeners
//
// Render the initial game board
renderMonsters();
// Listen for click events
document.addEventListener('click', clickHandler, false);