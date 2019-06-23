// This code is sponsored by http://algoexpert.io/techlead
// by http://youtube.com/techlead
var Block = function (x, y) {
  this.head = false
  this.visited = false
  this.doublevisited = false
  this.top = false
  this.right = false
  this.bottom = false
  this.left = false
  this.x = x
  this.y = y
  this.lastBlock
}

var Maze = function (canvas) {
  this.startBlock
  this.currentBlock
  this.bw = 50
  this.MAZE_SIZE = 20
  this.countStep = 0
  this.totalStep
  this.start = false
  canvas.width = this.bw * this.MAZE_SIZE
  canvas.height = canvas.width
  this.ctx = canvas.getContext('2d')
  this.Map = new Array(this.MAZE_SIZE);
  this.init()
}

Maze.prototype.init = function () {
  this.initMap()
  this.start = true
  this.totalStep = this.MAZE_SIZE * this.MAZE_SIZE
  this.testBlock()
  // this.render()
  // setTimeout(() => {
  //   this.render()
  // }, 1000);
}

Maze.prototype.initMap = function () {
  for(var i=0;i<this.MAZE_SIZE;i++){
    this.Map[i] = new Array(this.MAZE_SIZE);
    for(var j=0;j<this.MAZE_SIZE;j++){
      this.Map[i][j] = new Block(i,j)
    }
  }
}

Maze.prototype.getRandom = function (max, min) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

Maze.prototype.randomStart = function () {
  var x = this.getRandom(this.MAZE_SIZE - 1, 0)
  var y = this.getRandom(this.MAZE_SIZE - 1, 0)
  return this.Map[x][y]
}

Maze.prototype.randomDirection = function (b) {
  // 判斷方向是否可行走
  var res = []
  if ((b.x - 1) >= 0) {
    if (!this.Map[b.x - 1][b.y].visited ) {
      res.push('left')
    }
  }
  if ((b.x + 1) < this.MAZE_SIZE) {
    if (!this.Map[b.x + 1][b.y].visited) {
      res.push('right')
    }
  }

  if ((b.y - 1) >= 0) {
    if (!this.Map[b.x][b.y - 1].visited) {
      res.push('top')
    }
  }
  if ((b.y + 1) < this.MAZE_SIZE) {
    if (!this.Map[b.x][b.y + 1].visited) {
      res.push('bottom')
    }
  }
  // 以上可以判斷出哪幾個方向可走
  // console.log(`可以走的方向 ${res}`)
  if (res.length === 0) { return false }
  return res[this.getRandom(res.length - 1, 0)]
}

Maze.prototype.blockMove = function (b, dir) {
  switch (dir) {
    case 'top':
      return this.Map[b.x][b.y - 1]
      break;
    case 'right':
      return this.Map[b.x + 1][b.y]
      break;
    case 'bottom':
      return this.Map[b.x][b.y + 1]
      break;
    case 'left':
      return this.Map[b.x - 1][b.y]
      break;
  }
}

Maze.prototype.testBlock = function () {
  if (!this.startBlock) {
    this.startBlock = this.randomStart()
    this.startBlock.head = true
    this.currentBlock = this.startBlock
  }
  console.log(`currentBlock x:${this.currentBlock.x} y:${this.currentBlock.y}`)
  var nextdir = this.randomDirection(this.currentBlock)
  if (!nextdir) {
    this.currentBlock.doublevisited = true
    this.currentBlock = this.currentBlock.lastBlock
    this.currentBlock.doublevisited = true
    this.countStep++
    console.log( this.currentBlock)
    if (this.currentBlock === this.startBlock && this.totalStep === this.countStep) {
      alert('END')
      this.start = false
    }
  } else {
    var tmpBlock = this.currentBlock
    this.currentBlock = this.blockMove(this.currentBlock, nextdir)
    this.currentBlock.lastBlock = tmpBlock
    this.currentBlock.visited = true
    this.breakwall(this.currentBlock, tmpBlock)
  }
  console.log(this.countStep)
  this.render()
  if (this.start) {
    setTimeout(()=> {
      this.testBlock()
    }, 30)
  }
}

Maze.prototype.breakwall = function (b1, b2) {
  if ((Math.abs(b1.x - b2.x) + Math.abs(b1.y - b2.y)) > 1) { return 'error' }
  
  if (b1.x < b2.x) {
    b1.right = true
    b2.left = true
  }

  if (b1.x > b2.x) {
    b1.left = true
    b2.right = true
  }

  if (b1.y < b2.y) {
    b1.bottom = true
    b2.top = true
  }

  if (b1.y > b2.y) {
    b1.top = true
    b2.bottom = true
  }
}

Maze.prototype.getPos = function (x, y) {
  return new Block(
    x*this.bw,
    y*this.bw
  )
}

Maze.prototype.drawBorder = function (p1, p2, color, width) {
  this.ctx.beginPath();
  this.ctx.moveTo(p1.x, p1.y)
  this.ctx.lineTo(p2.x, p2.y)
  this.ctx.lineWidth = width
  this.ctx.strokeStyle = '#FE4A0D'
  this.ctx.stroke()
}

Maze.prototype.drawBlock = function (b) {
  let pos = this.getPos(b.x,b.y)
  this.ctx.fillStyle = "#0f171b";
  this.ctx.fillRect(pos.x,pos.y,this.bw,this.bw)
  let left_top = {
    x: pos.x + 1,
    y: pos.y + 1
  }
  let right_top = {
    x: pos.x + this.bw - 1,
    y: pos.y + 1
  }
  let left_bottom = {
    x: pos.x + 1,
    y: pos.y + this.bw - 1
  }
  let right_bottom = {
    x: pos.x + this.bw - 1,
    y: pos.y +  this.bw - 1
  }

  if(b.visited){
    // console.log(b.visited)
    this.ctx.fillStyle = '#4E6C76'
    this.ctx.fillRect(pos.x,pos.y,this.bw,this.bw)
  }

  if(b.head){
    // console.log(b.visited)
    this.ctx.fillStyle = '#D34210'
    this.ctx.fillRect(pos.x,pos.y,this.bw,this.bw)
  }

  if(b.doublevisited){
    // console.log(b.visited)
    this.ctx.fillStyle = '#0f171b'
    this.ctx.fillRect(pos.x,pos.y,this.bw,this.bw)
  }

  if (!b.top) {
    this.drawBorder(left_top, right_top, 'red', 2)
  }
  if (!b.right) {
    this.drawBorder(right_top, right_bottom, 'blue', 2)
  }
  if (!b.bottom) {
    this.drawBorder(right_bottom, left_bottom, 'green', 2)
  }
  if (!b.left) {
    this.drawBorder(left_top, left_bottom, 'yellow', 2)
  }
}

Maze.prototype.render = function () {
  this.Map.forEach(e => {
    e.forEach(ee => {
      this.drawBlock(ee)
    });
  })
}