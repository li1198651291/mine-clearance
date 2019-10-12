function Mine(rows, columns, mineNum) {
  this.rows = rows;
  this.columns = columns;
  this.mineNum = mineNum;

  this.squares = [];
  this.tds = [];
  this.surplusMine = mineNum;
  this.allRight = false;

  this.parent = document.querySelector('.gameBox');
  this.mineNumDom = document.querySelector('.mineNums');
  this.mineNumDom.innerHTML = this.surplusMine;
}
Mine.prototype.randomNum = function () {
  var square = new Array(this.rows * this.columns);
  for (let i = 0; i < square.length; i++) {
    square[i] = i
  }
  square.sort(() => 0.5 - Math.random());
  return square.slice(0, this.mineNum)
}
Mine.prototype.init = function () {
  var n = 0;
  var minePos = this.randomNum();
  for (let i = 0; i < this.rows; i++) {
    this.squares[i] = [];
    for (let j = 0; j < this.columns; j++) {
      if (minePos.includes(n++)) {
        this.squares[i][j] = { type: 'mine', x: j, y: i }
      } else {
        this.squares[i][j] = { type: 'number', x: j, y: i, value: 0 }
      }
    }
  }
  // console.log(this.squares)
  this.parent.oncontextmenu = function () { return false }
  this.updateNum()
  this.createDom();
}
Mine.prototype.createDom = function () {
  var table = document.createElement('table');
  for (var i = 0; i < this.rows; i++) {
    var tr = document.createElement('tr');
    this.tds[i] = [];
    for (var j = 0; j < this.columns; j++) {
      var td = document.createElement('td');
      td.pos = [i, j];
      // td.addEventListener('mousedown', (e) => this.play(e));
      td.onmousedown = (e) => this.play(e)
      this.tds[i][j] = td;
      // if (this.squares[i][j].type === 'mine') {
      //   td.className = 'mine'
      // }
      // if (this.squares[i][j].type === 'number') {
      //   td.innerHTML = this.squares[i][j].value
      // }
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  this.parent.innerHTML = '';
  this.parent.appendChild(table)
  var mineNums = document.querySelector('.mineNums');
  mineNums.innerHTML = this.surplusMine;
}
Mine.prototype.findAround = function (square) {
  var x = square.x
  var y = square.y
  var aroundArr = [];
  for (let i = x - 1; i < x + 2; i++) {
    for (let j = y - 1; j < y + 2; j++) {
      if (i < 0 ||
        j < 0 ||
        i > this.rows - 1 ||
        j > this.columns - 1 ||
        (i === x && j === y) ||
        this.squares[j][i].type === 'mine'
      ) {
        continue
      }
      aroundArr.push([j, i])
    }
  }
  return aroundArr
}
Mine.prototype.updateNum = function () {
  for (let i = 0; i < this.rows; i++) {
    for (let j = 0; j < this.columns; j++) {
      if (this.squares[i][j].type === 'number') {
        continue;
      }
      var num = this.findAround(this.squares[i][j]);
      num.forEach((item) => {
        this.squares[item[0]][item[1]].value++
      })
    }
  }
  console.log(this.squares)
}
Mine.prototype.play = function (e) {
  var self = this;
  var target = e.target;
  var curSquare = this.squares[target.pos[0]][target.pos[1]];
  if (e.which === 1 && target.className !== 'flag') {
    console.log(curSquare)
    if (curSquare.type === 'number') {
      target.innerHTML = curSquare.value
      target.className = 'number'
      if (curSquare.value === 0) {
        target.innerHTML = ''
        function getAllZere(square) {
          var around = self.findAround(square);
          around.forEach((item) => {
            var x = item[0];
            var y = item[1];
            if(self.tds[x][y].className !== 'flag') {
              self.tds[x][y].innerHTML = self.squares[x][y].value;
              self.tds[x][y].className = 'number';
              if (self.squares[x][y].value === 0) {
                self.tds[x][y].innerHTML = '';
                if (!self.tds[x][y].check) {
                  self.tds[x][y].check = true;
                  getAllZere(self.squares[x][y]);
                }
              }
            }
          })
        }
        getAllZere(curSquare)
      }
    } else {
      this.gameOver(target)
    }
  }
  if(e.which === 3) {
    console.log(1)
    if(target.className === 'number') {
      return
    }
    target.className = target.className === 'flag' ? '' : 'flag';
    if(curSquare.type === 'mine') {
      this.allRight = true;
    } else {
      this.allRight = false;
    }
    if(target.className === 'flag') {
      this.mineNumDom.innerHTML = --this.surplusMine;
    } else {
      this.mineNumDom.innerHTML = ++this.surplusMine;
    }
    if(this.surplusMine === 0) {
      if(this.allRight === true) {
        alert('成功')
      } else {
        this.gameOver()
        alert('失败')
      }
    }
  }
}
Mine.prototype.gameOver = function(clickTd) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.columns; j++) {
      if(this.squares[i][j].type === 'mine') {
        this.tds[i][j].className = 'mine'
      }
      this.tds[i][j].onmousedown = null;
    }
  }  
  if(clickTd) {
    clickTd.style.backgroundColor = 'red';
  }
}
var btns = document.querySelectorAll('.button-item');
var mine = null;
var ln = 0;
var arr = [[9,9,10],[16,16,40],[28,28,99]];
for (let i = 0; i < btns.length - 1; i++) {
  btns[i].onclick = function() {
    btns[ln].className = '';
    this.classList.add('active');
    mine = new Mine(...arr[i]);
    mine.init();
    ln = i;
  }
}
btns[0].onclick();
btns[3].onclick = function() {
  mine = new Mine(...arr[ln]);
  mine.init();
}
