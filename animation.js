// 构造函数：定义每个对象，每次移动的属性和方法
function Task(obj, topStep, leftStep) {
    this.obj = obj;
    this.topStep = topStep;
    this.leftStep = leftStep;
    this.moveStep = function () {
        var objCSS = null;
        /* if(this.currentStyle){
             objCSS = this.obj.currentStyle;
         }else {
             objCSS = getComputedStyle(this.obj,null);
         }*/
        objCSS = getStyle(this.obj);
        var top = parseInt(objCSS.top);
        var left = parseInt(objCSS.left);
        this.obj.style.top = top + this.topStep + 'px';
        this.obj.style.left = left + this.leftStep + 'px';
        this.obj.style.zIndex = '3'; // 移动的格子的 zindex
    },
        this.clear = function () {
            this.obj.style.top = '';
            this.obj.style.left = '';
            this.obj.style.zIndex = '1'; // 还原默认的zindex =1
        }
}

var animation = {
    times: 10, // 移动的次数或步数
    interval: 16, // 每一秒 迈一步
    timer: null, // 保存定时器线程号
    tasks: [],
    addTask: function (source, target) {
        var sourceCell = document.querySelector('#fc' + source);
        var targetCell = document.querySelector('#fc' + target);
        var sourceCSS = getStyle(sourceCell); // 获取原位置css样式
        var targetCSS = getStyle(targetCell); // 获取目标位置css样式
        var topStep = (parseInt(targetCSS.top) - parseInt(sourceCSS.top)) / this.times;
        var leftStep = (parseInt(targetCSS.left) - parseInt(sourceCSS.left)) / this.times;
        var task = new Task(sourceCell, topStep, leftStep);
        this.tasks.push(task);
    },
    start: function () { // 启动动画
        clearInterval(this.timer);
        this.timer = setInterval(function () {
            for (var i = 0; i < animation.tasks.length; i++) {
                var task = animation.tasks[i];
                task.moveStep();
            }
            animation.times--;
            if (animation.times === 0) {
                for (var i = 0; i < animation.tasks.length; i++) {
                    var task = animation.tasks[i];
                    task.clear();
                }
                clearInterval(animation.timer);
                animation.timer = null;
                animation.tasks = [];
                animation.times = 10;
                //   动画完成
            }
        }, this.interval);
    }
}

/*获取样式方法 兼容浏览器*/
function getStyle(obj) {
    if (this.currentStyle) {
        return obj.currentStyle;
    } else {
        return getComputedStyle(obj, null);
    }
}