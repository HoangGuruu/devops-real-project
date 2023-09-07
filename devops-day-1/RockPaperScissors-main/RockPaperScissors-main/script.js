var elems = [];
var state = false;

function loadGame() {
    elems = [];

    for (let i = 1; i < 7; i++) {
        const element = document.getElementById("op-" + String(i));
        elems.push(element);
        element.style.display = "none";
    }
}

function play() {
    var left = Math.floor(Math.random() * 3);
    var right = Math.floor(Math.random() * 3) + 3;

    for (let i = 1; i < 7; i++) {
        const element = document.getElementById("op-" + String(i));
        element.style.display = "none";
        element.style.backgroundColor = "";
    }

    elems[left].style.display = "inline";
    elems[right].style.display = "inline";
    
    startRepeat()
    state = true;
}

function startRepeat(left, right) {
    if (!state) {
        var rep = setInterval(() => {
            play(left, right);
        }, 100);

        endGame(rep);
    }
}

function endGame(rep) {
    setTimeout(() => {
        state = false;
        clearInterval(rep);
        showResult();
    }, 4000);
}

function showResult() {
    var result = [];
    var indexes = [];
    for (let i = 0; i < elems.length; i++) {
        const element = elems[i];
        
        if (element.style.display == "inline") {
            result.push(element);
            indexes.push(i % 3);
        }

        console.log(result);
    }

    console.log(indexes);
    
    if(indexes[0] == indexes[1]){
        result[0].style.backgroundColor = "#ffff00";
        result[1].style.backgroundColor = "#ffff00";
    }
    else if (indexes[0] == 0 && indexes[1] == 1) {
        result[1].style.backgroundColor = "#00ff00";
    }
    else if (indexes[0] == 0 && indexes[1] == 2) {
        result[0].style.backgroundColor = "#00ff00";
    }
    else if (indexes[0] == 1 && indexes[1] == 0) {
        result[0].style.backgroundColor = "#00ff00";
    }
    else if (indexes[0] == 1 && indexes[1] == 2) {
        result[1].style.backgroundColor = "#00ff00";
    }
    else if (indexes[0] == 2 && indexes[1] == 0) {
        result[1].style.backgroundColor = "#00ff00";
    }
    else if (indexes[0] == 2 && indexes[1] == 1) {
        result[0].style.backgroundColor = "#00ff00";
    }
}