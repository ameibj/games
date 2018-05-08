//  面向对象
var game = {
    data: [
        // [2, 4, 2, 4],
        //  [4, 2, 4, 2],
        //  [2, 4, 2, 4],
        //  [4, 2, 4, 2]
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    PLAYING: 1, // 游戏进行状态
    GAME_OVER: 0, // 游戏结束状态
    state: 1,
    score: 0, // 保存游戏分数
    localScore: 0, //  localStorange 存贮
    getStorage: function (key, data) {
        if (window.localStorage) { // 支持 localStorage
            if (key != '') {
                var storage = window.localStorage;
                try {
                    var getScore = storage.getItem(key);
                    getScore = JSON.parse(getScore);
                    data = getScore;
                } catch (e) {

                } finally {
                    return data;
                }
            }
        }
        else {
            alert("浏览暂不支持localStorage");
        }
    },
    setStorage: function (key, data) {
        if (window.localStorage) { // 支持 localStorage
            if (key != '') {
                if (data) {
                    var storage = window.localStorage;
                    var maxScore = JSON.stringify(data);
                    storage.setItem(key, maxScore);
                }
            }
        }
        else {
            alert("浏览暂不支持localStorage");
        }
    },
    /*判断数组是否满*/
    isFull: function () {
        /*判断当前数组是否不为0*/
        /*只要有任意一个===0 返回false*/
        for (var row = 0; row < this.data.length; row++) {
            for (var col = 0; col < this.data[row].length; col++) {
                if (this.data[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    },
    randomNum: function () {
        if (!this.isFull()) {
            while (true) {
                // 向data中随机数生成 2-4
                var row = parseInt(Math.random() * 4);
                var col = parseInt(Math.random() * 4);
                // 随机生成2或4
                var n = Math.random() < 0.5 ? 2 : 4;
                // 判断当前单元格是否有数字
                if (this.data[row][col] === 0) {
                    this.data[row][col] = n;
                    break;
                }
            }
        }
    },
    start: function () {
        this.randomNum();
        this.randomNum();
        // 获取localStorage score
        this.localScore = this.getStorage('_score_', this.localScore);
        // 将数组完整显示到div
        this.showView();
    },
    // 将数组完整显示到div
    showView: function () {
        for (var row = 0; row < this.data.length; row++) {
            for (var col = 0; col < this.data[row].length; col++) {
                var odiv = document.querySelector('#fc' + row + col);
                var n = this.data[row][col];
                odiv.innerHTML = n === 0 ? '' : n;
                odiv.className = n === 0 ? 'fcell' : 'fcell n' + n;
            }
        }
        var oMaxScore = document.querySelector('.max-scroe');
        var oScore = document.querySelector('.current-score');
        oScore.innerText = this.score;
        oMaxScore.innerText = this.localScore;
        if (this.localScore > this.score) { // 存贮分数 大于 当前分数
            return;
        }
        else { // 存贮分数 小于 当前分数 存数据
            this.setStorage('_score_', this.score);
            oMaxScore.innerText = this.score;
        }
    },
    /*封装动画和创建随机数，数据刷新*/
    anmaiteStart: function () {
        // 执行动画
        animation.start();
        setTimeout(function () {  // console.log(this === game)  // true bind(this)定时器的this用法
            //  生成一个随机数，并添加到数组展示
            this.randomNum();
            this.showView();
        }.bind(this), animation.interval * animation.times);
    },
    /*向左*/
    moveLeft: function () {
        if (this.canLeft()) {
            for (var row = 0; row < this.data.length; row++) {
                this.moveLeftInRow(row);
            }
            this.anmaiteStart(); // 执行动画和刷新页面数据
        }
    },
    /* 任意一行内移动或合并*/
    moveLeftInRow: function (row) {
        var cells = this.data[row];
        for (var i = 0; i < cells.length - 1; i++) {
            //  从当前行位置向后找
            var nexti = this.getLeftNext(row, i);
            if (nexti != -1) {
                if (cells[i] === 0) {
                    cells[i] = cells[nexti];
                    animation.addTask('' + row + nexti, '' + row + i);// 动画
                    cells[nexti] = 0;
                    i--;
                } else if (cells[i] === cells[nexti]) {
                    cells[i] += cells[nexti];
                    animation.addTask('' + row + nexti, '' + row + i);// 动画
                    animation.addAnimateTask('' + row + i)
                    cells[nexti] = 0;
                    this.score += cells[i]; // 得分
                }
            }
        }
    },
    // 从当前位置向右找不为0 的数
    getLeftNext: function (row, start) {
        var cells = this.data[row];
        for (var i = start + 1; i < 4; i++) {
            if (cells[i] !== 0) {
                return i;
            }
        }
        return -1;
    },

    /*向右*/
    moveRight: function () {
        if (this.canRight()) {
            for (var row = 0; row < this.data.length; row++) {
                this.moveRightInRow(row);
            }
            // 生成一个随机数，并添加到数组展示
            this.anmaiteStart(); // 执行动画和刷新页面数据
        }
    },
    moveRightInRow: function (row) {
        // 从右向左遍历 到>0 结束
        for (var i = this.data[row].length - 1; i > 0; i--) {
            // 找当前行的开始位置的下标
            var previ = this.getRightPrev(row, i);
            if (previ !== -1) {
                if (this.data[row][i] === 0) {
                    this.data[row][i] = this.data[row][previ];
                    animation.addTask('' + row + previ, '' + row + i);// 动画
                    this.data[row][previ] = 0;
                    i++;
                } else if (this.data[row][previ] === this.data[row][i]) {
                    this.data[row][i] += this.data[row][previ];
                    animation.addTask('' + row + previ, '' + row + i);// 动画
                    animation.addAnimateTask('' + row + i)
                    this.data[row][previ] = 0;
                    this.score += this.data[row][i];
                }
            } else {
                break;
            }
        }
    },
    // 向左找第一个不为0的数
    getRightPrev: function (row, start) {
        var cells = this.data[row];
        for (var i = start - 1; i >= 0; i--) {
            if (cells[i] !== 0) {
                return i;
            }
        }
        return -1;
    },

    /*向下*/
    moveDown: function () {
        if (this.canDown()) {
            for (var col = 0; col < 4; col++) {
                this.moveDownInCol(col);
            }
            this.anmaiteStart(); // 执行动画和刷新页面数据
        }
    },
    moveDownInCol: function (col) { // 计算合并逻辑
        for (var row = this.data.length - 1; row > 0; row--) {
            var prevRow = this.getDownNext(row, col);
            if (prevRow !== -1) {
                if (this.data[row][col] === 0) {
                    this.data[row][col] = this.data[prevRow][col];
                    animation.addTask('' + prevRow + col, '' + row + col);// 动画
                    this.data[prevRow][col] = 0;
                    row++;
                } else if (this.data[prevRow][col] === this.data[row][col]) {
                    this.data[row][col] += this.data[prevRow][col];
                    animation.addTask('' + prevRow + col, '' + row + col);// 动画
                    animation.addAnimateTask('' + row + col);
                    this.data[prevRow][col] = 0;

                    this.score += this.data[row][col];
                }
            } else {
                break;
            }
        }
    },
    getDownNext: function (startRow, col) {
        for (var i = startRow - 1; i >= 0; i--) {
            if (this.data[i][col] !== 0) {
                return i;
            }
        }
        return -1;
    },
    /*向上*/
    moveUp: function () {
        if (this.canUp()) {
            for (var col = 0; col < 4; col++) {
                this.moveUpInCol(col);
            }
            this.anmaiteStart(); // 执行动画和刷新页面数据
        }
    },
    moveUpInCol: function (col) {
        for (var row = 0; row < 4; row++) {
            var nextRowIndex = this.getUpNext(row, col);
            if (nextRowIndex !== -1) {
                if (this.data[row][col] === 0) {
                    this.data[row][col] = this.data[nextRowIndex][col];
                    animation.addTask('' + nextRowIndex + col, '' + row + col);// 动画
                    this.data[nextRowIndex][col] = 0;
                    row--;
                } else if (this.data[row][col] === this.data[nextRowIndex][col]) {
                    this.data[row][col] += this.data[nextRowIndex][col];
                    animation.addTask('' + nextRowIndex + col, '' + row + col);// 动画
                    animation.addAnimateTask('' + row + col);
                    this.data[nextRowIndex][col] = 0;
                    this.score += this.data[row][col]
                }
            } else {
                break;
            }
        }
    },
    getUpNext: function (startRow, col) {
        for (var i = startRow + 1; i < 4; i++) {
            if (this.data[i][col] !== 0) {
                return i;
            }
        }
        return -1;
    },

    /*判断是否可以向某个方向继续移动*/
    canLeft: function () {
        for (var row = 0; row < this.data.length; row++) {
            for (var col = 1; col < this.data[row].length; col++) {
                if (this.data[row][col] !== 0) {
                    if (this.data[row][col - 1] === 0 || this.data[row][col] === this.data[row][col - 1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canRight: function () {
        for (var row = 0; row < this.data.length; row++) {
            for (var col = 0; col < this.data[row].length - 1; col++) {
                if (this.data[row][col] !== 0) {
                    if (this.data[row][col + 1] === 0 || this.data[row][col] === this.data[row][col + 1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canUp: function () {
        for (var row = 1; row < this.data.length; row++) {
            for (var col = 0; col < this.data[row].length; col++) {
                if (this.data[row][col] !== 0) {
                    if (this.data[row - 1][col] === 0 || this.data[row][col] === this.data[row - 1][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canDown: function () {
        for (var row = this.data.length - 1 - 1; row >= 0; row--) {
            for (var col = 0; col < this.data[row].length; col++) {
                if (this.data[row][col] !== 0) {
                    if (this.data[row + 1][col] === 0 || this.data[row + 1][col] === this.data[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /*游戏结束*/
    gameOver: function () {
        // 如果 满了并且 上下左右不能移动 游戏结束
        if (this.isFull() && this.canLeft() === false && this.canRight() === false && this.canUp() === false && this.canDown() === false) {
            return true;
        }
    },

    restart: function () {
        this.data = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.state = 1;
        this.score = 0;
        this.start();
        document.querySelector('.gameover').style.display = 'none';
    }
}