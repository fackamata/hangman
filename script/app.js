const btn_start = document.getElementById("btn-new-game")
const h1 = document.getElementById("h1")
const word_container = document.getElementById("word_container")
const main = document.getElementById("main")
const endGame = document.getElementById("end_game")
const endMessage = document.getElementById("end_message")
const resetBtn = document.getElementById("resetBtn")
const solution = document.getElementById("solution")
const hangmanSvg = document.getElementById("svg")
const letterPlayed = document.getElementById("letter_played")
const letterPlayedTwoTimes = document.getElementById("letter_already_played")

let test = false;

let fileUrl = './words.txt' // location of words file
let nbLetterMin = 4; // number minimal of letter in word to find
let letter_wrong =[] // user letter input wrong
let letter_correct = [] // all the correct letter
let letter_find = [] // user letter input correct
let wordToFind = "";
let normalWord = ""; // word before removing accent
let user_letter_input = "";
let word_content = '';
let end = false;


let playedAgainMsg = "You already played : "
let userLetterMsg = "Letter Played :"
let endMsgWin = "Congratulation !"
let endMsgLoose = "You loose !"
english()

function francais(){
    if(wordToFind.length > 0){
        reset()
    }
    h1.textContent = "Le pendu"
    btn_start.textContent = "Nouveau mot"
    playedAgainMsg = "Vous avez déjà jouer la lettre : "
    userLetterMsg = "Lettres jouées : "
    endMsgWin = "Congratulation !"
    endMsgLoose = "You loose !"
    fetchFile('./mots.txt')
    // return fileUrl
}

// var originalText = "éàçèñ"
// var result = originalText.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
// console.log(result)

function english(){
    if(wordToFind.length > 0){
        reset()
    }
    h1.textContent = "Hangman"
    btn_start.textContent = "Play Game"
    playedAgainMsg = "You already played : "
    userLetterMsg = "Letter Played :"
    endMsgWin = "Congratulation !"
    endMsgLoose = "You loose !"
    fetchFile('./words.txt')
}
// game start in English



function getWordFromTxt(param){
    words = param.split('\n')
}

// to get the text from local file.txt
function fetchFile(fileUrl){
    fetch(fileUrl)
    .then(data => data.text())
    .then(text => getWordFromTxt(text))
    .catch(error => new Error(error));
}


function getWordToFind(){
    normalWord = words[Math.floor(Math.random() * words.length)];
    // to remove accent on french word
    wordToFind = normalWord.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    if (wordToFind.length > nbLetterMin){
        for(let nb = 0; nb < wordToFind.length; nb++){
            letter_correct.push(wordToFind[nb])
        }
        letterLetToFind = wordToFind.length
        test === true ? console.log(normalWord) :'';// for test purpose
    }else{
        getWordToFind()
    }

}

function displayEmptyWord(){
    for (let inc = 0; inc < wordToFind.length; inc++){
        let letter = document.createElement("span")
            letter.textContent = '_ ';
            word_container.appendChild(letter)
    }
}

function updateWordToFind(userLetter){
    for (let incre = 0; incre < wordToFind.length; incre++){
        if(userLetter === wordToFind[incre]){
            letter_find.push(user_letter_input)
            word_container.children[incre].innerHTML = normalWord[incre]
        }
    }
}


function endOfGame(winLoose){
    if (winLoose){
        endMessage.textContent= `${endMsgWin}` ;
        solution.textContent= `${normalWord}`;
    }else{
        endMessage.textContent =`${endMsgLoose}`;
        solution.textContent= `${normalWord}`;
    }
    
    endGame.style.display = "block";    
}

function isEndOfGame(){
    (letter_find.length === wordToFind.length) ? endOfGame(true):"";
    (letter_wrong.length === hangmanSvg.childElementCount) ? endOfGame(false):"";
}



function letterAlreadyPlayed(letr){
    letterPlayedTwoTimes.innerText = `${playedAgainMsg} ${letr}`;
    letterPlayedTwoTimes.style.display = "block";
    setTimeout(function(){
        letterPlayedTwoTimes.style.display = "none";   
    },1000);     
}



function reset(){
    btn_start.style.display = "block";
    main.style.display = "none";
    word_container.textContent ="";
    for (let x = 0; x < hangmanSvg.childElementCount; x++){
        hangmanSvg.children[x].style.display ='none';
    }
    endGame.style.display = "none";
    letter_wrong = [];
    letter_correct = [];
    letter_find = []
    end = false;
}


function play_game(){
    letterPlayed.textContent = "";
    getWordToFind();
    displayEmptyWord();

    window.addEventListener('keydown', event => {
        if (!end ) {
            if (event.keyCode >= 65 && event.keyCode <= 90) {
                user_letter_input = event.key.toLowerCase();

                if (wordToFind.includes(user_letter_input)) {
                    if (!letter_find.includes(user_letter_input)) {
                        updateWordToFind(user_letter_input);
                    } else {                        
                        letterAlreadyPlayed(user_letter_input);
                    }
                } else {
                    if (!letter_wrong.includes(user_letter_input)) {
                        hangmanSvg.children[letter_wrong.length].style.display='block';
                        
                        if (letter_wrong.length === 0){
                            letterPlayed.textContent += `${userLetterMsg} `
                        }
                        letter_wrong.push(user_letter_input);
                        letterPlayed.textContent += user_letter_input + ", "
                        
                    } else {
                        letterAlreadyPlayed(user_letter_input);
                    }
                }
            }

            isEndOfGame()
        }
    });
}


btn_start.addEventListener('click' , function(){
    // when button start is clicked, it stop being diplayed
    btn_start.style.display = "none";
    main.style.display = "block";
    play_game();
});

