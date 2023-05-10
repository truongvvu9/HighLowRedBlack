

//select button elements
let easyButton = document.querySelector('#Easy');
let hardButton = document.querySelector('#Hard');

//add event listener for button elements
easyButton.addEventListener('click', function () {

    window.location.href = 'easymode.html';

})

hardButton.addEventListener('click', function () {

    window.location.href = 'hardmode.html';


})



