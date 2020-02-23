const odds = require('./odds');
const count = 20;
const checkWinnings = (numbers, bet, shuffleArray) => {

    var win = 0;
    var array = shuffleArray;
    let compare = (arr1, arr2) => arr1.reduce((a, c) => a + arr2.includes(c), 0);
    console.log(numbers, array);
    var com = compare(array, numbers);
    console.log(com);
    win = odds[10 - com][10 - numbers.length];
    console.log(win);
    return win * bet;
}

const shuffle = () => {
    var array = [];
    while (array.length != count) {
        var number = Math.floor(Math.random() * 64) + 1;
        if (array.includes(number))
            continue;
        array.push(number);
    }
    return array;
}

module.exports.shuffle = shuffle;
module.exports.checkWinnings = checkWinnings;