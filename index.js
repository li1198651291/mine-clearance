var table = document.querySelector('table');
var primaryBtn = document.querySelector('.primaryBtn');
var intermediateBtn = document.querySelector('.intermediateBtn');
var advancedBtn = document.querySelector('.advancedBtn');
var restartBtn = document.querySelector('.restartBtn');
var mineNums = document.querySelector('.mineNums');
var levelNew;
var flagArr = [];
var newMineNums;
// var grid;
// var mines;
// var mines1;


var data = {
  primary: {
    level: 'primary',
    rows: 9,
    columns: 9,
    mineNums: 10
  },
  intermediate: {
    level: 'intermediate',
    rows: 16,
    columns: 16,
    mineNums: 40
  },
  advanced: {
    level: 'advanced',
    rows: 28,
    columns: 28,
    mineNums: 99
  }
}
function Mine(data) {
  this.level = data.level;
  this.rows = data.rows;
  this.columns = data.columns;
  this.mineNums = data.mineNums;
  this.grid = [];
  this.mineNumArr = [];
  this.minesArr = [];
}
Mine.prototype.create = function () {
  table.className = this.level;
  var fragment = document.createDocumentFragment()
  for (var i = 0; i < this.rows; i++) {
    var tr = document.createElement('tr');
    this.grid[i] = [];
    for (var j = 0; j < this.columns; j++) {
      var td = document.createElement('td');
      td.classList = `${i}-${j}`;
      this.grid[i][j] = td;
      tr.appendChild(td)
    }
    fragment.appendChild(tr)
  }
  table.appendChild(fragment)
  mineNums.innerHTML = this.mineNums;
  this.createMine();
}
Mine.prototype.createMine = function () {
  td = document.querySelectorAll('td');
  this.minesArr = [];
  this.mineNumArr = [];
  for (var i = 0; i < this.mineNums; i++) {
    var mine = Math.floor(Math.random() * this.rows * this.columns)
    if (this.mineNumArr.includes(mine)) {
      i--;
      continue;
    }
    this.mineNumArr.push(mine)
    this.minesArr.push(td[mine])
  }
  this.mineNumArr.forEach((item) => {
    td[item].classList.add('isMine');
  })
}

render(data.primary);
function render(data) {
  table.innerHTML = ''
  levelNew = new Mine(data);
  levelNew.create();
  newMineNums = levelNew.mineNums;
}
primaryBtn.addEventListener('click', () => render(data.primary))
intermediateBtn.addEventListener('click', () => render(data.intermediate))
advancedBtn.addEventListener('click', () => render(data.advanced))
restartBtn.addEventListener('click', () => { table.innerHTML = '', levelNew.create(), newMineNums = levelNew.mineNums; })
table.oncontextmenu = function (e) { return false }

table.addEventListener('mousedown', function (e) {
  var target = e.target;
  if (target && target.nodeName.toUpperCase() === 'TD') {
    if (e.button === 0) {
      if (flagArr.includes(target)) {
        flag(target, true)
        return
      } else if (levelNew.minesArr.includes(target)) {
        levelNew.mineNumArr.forEach((item) => {
          td[item].style.backgroundImage = "url('./img/地雷.jpg')";
        })
        console.log('踩雷')
      } else {
        open(target)
      }
    } else if (e.button === 2) {
      flag(target, false)
    }
  }
})
function flag(target, isAdd) {
  if (target.style.backgroundColor === 'white') {
    return
  }
  if (isAdd) {
    newMineNums++;
    mineNums.innerHTML = newMineNums;
    target.style.backgroundImage = '';
    flagArr.splice(flagArr.indexOf(target), 1)
  } else {
    if (newMineNums <= 0) {
      return
    }
    if (flagArr.includes(target)) {
      return
    }
    newMineNums--;
    mineNums.innerHTML = newMineNums;
    target.style.backgroundImage = 'url("./img/红旗_高亮.png")';
    flagArr.push(target)
    if (newMineNums === 0) {
      falgClassArr = flagArr.map((item) => {
        return item.className
      })
      minesClassArr = levelNew.minesArr.map((item) => {
        return item.className
      })
      console.log(minesClassArr)
      if (falgClassArr.sort().toString() === minesClassArr.sort().toString()) {
        console.log('win')
      }
    }
  }
}
function findAround(target) {
  var targetPos = target.className.split('-');
  var a = parseInt(targetPos[0])
  var b = parseInt(targetPos[1])
  var targetArr = [];
  for (let i = a - 1; i < a + 2; i++) {
    for (let j = b - 1; j < b + 2; j++) {
      if (i < 0 || j < 0 || i > levelNew.rows - 1 || j > levelNew.columns - 1) {
        continue
      }
      targetArr.push(`${i}-${j}`)
    }
  }
  return targetArr
}
function findnums(target) {
  target.style.backgroundColor = 'white';
  var targetArr = findAround(target);
  var targetNums = 0;
  targetArr.forEach((item) => {
    var around = document.getElementsByClassName(item)[0];
    if (around.classList.contains('isMine')) {
      targetNums++
    }
  })
  return targetNums;
}

function open(target) {
  if (flagArr.includes(target)) {
    return
  }
  var num = findnums(target)
  if (num !== 0) {
    target.innerText = num;
  } else {
    var targetArr = findAround(target);
    targetArr.forEach((item) => {
      var around = document.getElementsByClassName(item)[0];
      if (around.style.backgroundColor !== 'white') {
        open(around)
      }
    })
  }
}


// function init(data) {
//   ul.className = 'primary';
//   create(data.primary);
//   levelNew = 'primary';
//   newMineNums = data[levelNew].mineNums;
// }
// function create(level) {
//   grid = new Array(level.rows);
//   for (var i = 0; i < level.columns; i++) {
//     grid[i] = new Array(level.columns)
//   }
//   var fragment = document.createDocumentFragment()
//   for (var i = 0; i < level.rows; i++) {
//     for (var j = 0; j < level.columns; j++) {
//       var item = document.createElement('li');
//       item.classList = `${i}-${j}`;
//       grid[i][j] = item;
//       fragment.appendChild(item)
//     }
//   }
//   ul.appendChild(fragment)
//   mineNums.innerHTML = level.mineNums;
//   createMine(level.mineNums, level.rows * level.columns);
// }
// init(data);
// function createMine(mineNums, nums) {
//   li = document.querySelectorAll('li');
//   minesArr = [];
//   mines = [];
//   for (var i = 0; i < mineNums; i++) {
//     var mine = Math.floor(Math.random() * nums)
//     if (mines.includes(mine)) {
//       i--;
//       continue;
//     }
//     mines.push(mine)
//     mines1.push(li[mine])
//   }
//   mines.forEach((item) => {
//     li[item].classList.add('isMine')
//   })
// }
// function render(level) {
//   ul.innerHTML = ''
//   ul.className = level;
//   create(data[level]);
//   levelNew = level;
//   newMineNums = data[levelNew].mineNums;
// }
// primaryBtn.addEventListener('click', () => render('primary'))
// intermediateBtn.addEventListener('click', () => render('intermediate'))
// advancedBtn.addEventListener('click', () => render('advanced'))
// restartBtn.addEventListener('click', () => render(levelNew))
// ul.oncontextmenu = function (e) { return false }

// ul.addEventListener('mousedown', function (e) {
//   var target = e.target;
//   if (target && target.nodeName.toUpperCase() === 'LI') {
//     if (e.button === 0) {
//       if (flagArr.includes(target)) {
//         flag(target, true)
//       } else if (mines1.includes(target)) {
//         mines.forEach((item) => {
//           li[item].style.backgroundImage = "url('./img/地雷.jpg')";
//         })
//         console.log('踩雷')
//       } else {
//         open(target)
//       }
//     } else if (e.button === 2) {
//       flag(target, false)
//     }
//   }
// })
// function flag(target, isAdd) {
//   if (isAdd) {
//     newMineNums++;
//     mineNums.innerHTML = newMineNums;
//     target.style.backgroundImage = '';
//     flagArr.pop(target)
//   } else {
//     if (newMineNums <= 0) {
//       return
//     }
//     newMineNums--;
//     mineNums.innerHTML = newMineNums;
//     target.style.backgroundImage = "url('./img/红旗_高亮.png')";
//     flagArr.push(target)
//     if(newMineNums === 0) {
//       if(flagArr.sort().toString() === mines1.sort().toString()) {
//         console.log('win')
//       }
//     }
//   }
// }
// function findAround(target) {
//   var targetPos = target.className.split('-');
//   var a = parseInt(targetPos[0])
//   var b = parseInt(targetPos[1])
//   var targetArr = [];
//   for (let i = a - 1; i < a + 2; i++) {
//     for (let j = b - 1; j < b + 2; j++) {
//       if (i < 0 || j < 0 || i > data[levelNew].rows - 1 || j > data[levelNew].columns - 1) {
//         continue
//       }
//       targetArr.push(`${i}-${j}`)
//     }
//   }
//   return targetArr
// }
// function findnums(target) {
//   var targetArr = findAround(target)
//   var targetNums = 0;
//   target.style.backgroundColor = 'white';
//   targetArr.forEach((item) => {
//     var around = document.getElementsByClassName(item)[0];
//     if (around.classList.contains('isMine')) {
//       targetNums++
//     }
//   })
//   return targetNums;
// }

// function open(target) {
//   var num = findnums(target)
//   if (num !== 0) {
//     target.innerText = num;
//   } else {
//     var targetArr = findAround(target);
//     targetArr.forEach((item) => {
//       var around = document.getElementsByClassName(item)[0];
//       if (around.style.backgroundColor !== 'white') {
//         open(around)
//       }
//     })
//   }
// }



// function findnums(target) {
//   target.style.backgroundColor = 'white';
//   var targetNums = 0;
//   var columns = data[levelNew].columns;
//   var rows = data[levelNew].rows;
//   var targetList = parseInt(target.className);
//   console.log(targetList)
//   if (targetList === 0) {
//     //左上
//     console.log(1)
//     var downNum = targetList + columns;
//     targetNums = addNums(targetList, 2) + addNums(downNum, 2);
//   } else if (targetList === columns - 1) {
//     //右上
//     console.log(2)
//     var downNum = targetList + columns - 1;
//     targetNums = addNums(targetList - 1, 2) + addNums(downNum, 2);
//   } else if (targetList === columns * rows - 1) {
//     //右下
//     console.log(3)
//     var upNum = targetList - columns - 1;
//     targetNums = addNums(targetList - 1, 2) + addNums(upNum, 2);
//   } else if (targetList === columns * (rows - 1)) {
//     //左下
//     console.log(4)
//     var upNum = targetList - columns;
//     targetNums = addNums(targetList, 2) + addNums(upNum, 2);
//   } else if (targetList % columns === 0) {
//     //左边
//     console.log(5)
//     var upNum = targetList - columns;
//     var downNum = targetList + columns;
//     targetNums = addNums(targetList, 2) + addNums(upNum, 2) + addNums(downNum, 2)
//   } else if ((targetList + 1) % columns === 0) {
//     //右边
//     console.log(6)
//     var upNum = targetList - columns - 1;
//     var downNum = targetList + columns - 1;
//     targetNums = addNums(targetList - 1, 2) + addNums(upNum, 2) + addNums(downNum, 2)
//   } else if (targetList < columns) {
//     //上
//     console.log(7)
//     var downNum = targetList + columns - 1;
//     targetNums = addNums(targetList - 1, 3) + addNums(downNum, 3)
//   }else if (targetList > columns * (rows - 1)) {
//     //下
//     console.log(8)
//     var upNum = targetList - columns - 1;
//     targetNums = addNums(targetList - 1, 3) + addNums(upNum, 3)
//   } else {
//     console.log(9)
//     var leftUpNum = targetList - 1 - columns
//     var leftDownNum = targetList - 1 + columns
//     targetNums = addNums(targetList - 1, 3) + addNums(leftDownNum, 3) + addNums(leftUpNum, 3)
//   }
//   return targetNums
// }
// function addNums(initNum, add) {
//   var num = 0;
//   for (var i = initNum; i < initNum + add; i++) {
//     console.log(i)
//     if (li[i].classList.contains('isMine')) {
//       num++
//     }
//   }
//   return num
// }

