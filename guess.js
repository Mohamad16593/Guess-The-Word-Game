// ----------------------Setting Game Name ----------------------------
let gameName = "Guess The Word" ;
document.title = gameName ;
document.querySelector("h1").innerHTML = gameName ;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Mohamad Wakkaf` ;
// ----------------------Setting Game Options ----------------------------
let numberOfTries = 6;
let numberOfLetters = 6 ;
let currentTry = 1 ;
let numberOfHints = 2 ;

//Manage Words
let wordToGuess = "";
const words = ['Create' , 'Update' , 'Delete' , 'Master' , 'Branch' , 'Mainly' ,'Maalla','school'];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

//Manage Hints
document.querySelector('.hint span').innerHTML = numberOfHints;
const getHintButton = document.querySelector('.hint');
getHintButton.addEventListener('click' , getHint);

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    // --------create main try div -----------------
    for (let i=1 ; i <= numberOfTries ; i++ ){
        const tryDiv = document.createElement("div") ;
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i != 1) tryDiv.classList.add('disabled-inputs');

        // --------create inputs -----------------
        for(let j=1 ; j <= numberOfLetters ; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            // input.setAttribute("max-length" , "1");
            input.maxLength = '1' ;
            tryDiv.appendChild(input);
        };

        inputsContainer.appendChild(tryDiv) ;
    };
    //Focus on first input of first try element 
    inputsContainer.children[0].children[1].focus() ;
    //Disable all inputs except the first one
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => input.disabled = true) ;

    //Make the letter in input be in the upper case
    const inputs = document.querySelectorAll('input') ;
    inputs.forEach((input , index ) => {
        input.addEventListener('input' , function() {
            this.value = this.value.toUpperCase(); 
            // console.log(index);
            //to fucus in next input 
            const nextInput  = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });
        // use arrows to move across inputs
        input.addEventListener('keydown' ,function(event){
            // console.log(event) 'target ex quess1-letter1' ;
            const currentIndex = Array.from(inputs).indexOf(event.target) ; // or (this)
            // console.log(currentIndex);
            if (event.key === "ArrowRight"){
                const nextInput = currentIndex + 1 ;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft"){
                const previousInput = currentIndex - 1 ;
                if (previousInput >= 0) inputs[previousInput].focus();
            }
        });
    });
};

const guessButon = document.querySelector('.check');
guessButon.addEventListener('click' , handleGuess);

console.log(wordToGuess);
function handleGuess () {
    let successGuess = true ;
    for(let i=1 ; i <= numberOfLetters ; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        //Game Logic
        if(letter === actualLetter){
            inputField.classList.add("yes-in-place");
        }else if (wordToGuess.includes(letter) && letter !== ""){
            inputField.classList.add("not-in-place");
            successGuess = false ;
        }else {
            inputField.classList.add("no");
            successGuess = false ;
        };
    };
    //check if user win or lose
    if(successGuess){
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        if(numberOfHints ===2){
            messageArea.innerHTML = `<p>Congrats you did not use any Hints !</p>`;
        };


        //Add Disabled to all divs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add('disabled-inputs'));
        //Disable guess button
        guessButon.disabled = true ;
        getHintButton.disabled = true ;
    }else{
        //disabled the current try and its inputs
        document.querySelector(`.try-${currentTry}`).classList.add('disabled-inputs');
        const currentTryInputs =  document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => input.disabled = true) ;
        
        //go to the next try
        currentTry++ ;

        //remove the disable statue from next tryand its inputs and put the cursor in the first one
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => input.disabled = false) ;

        //check if the next try exists
        let el = document.querySelector(`.try-${currentTry}`);
        if(el){
            el.classList.remove('disabled-inputs');
            el.children[1].focus();
        }else{
            //when reaching to max num of
            guessButon.disabled = true ;
            getHintButton.disabled = true ;
            messageArea.innerHTML = `You Lose .. The Word Is <span>${wordToGuess}</span>` ;
        };
    };
};

function getHint (){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector('.hint span').innerHTML = numberOfHints ;
    };
    if(numberOfHints === 0){
        getHintButton.disabled = true ;
    }
    const enabledInputs = document.querySelectorAll('input:not([disabled])');
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "") ;
    
    if (emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length) ;
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if (indexToFill !== -1){
            randomInput.value = wordToGuess[indexToFill].toLocaleUpperCase();
        };
    };
};

function handleBackSpace(event){
    if(event.key === "Backspace"){
        const inputs = document.querySelectorAll('input:not([disabled])');
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0){
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "" ;
            prevInput.value = '' ;
            prevInput.focus();
        };
    };
};

document.addEventListener('keydown' , handleBackSpace);

window.onload = function(){
    generateInput();
};