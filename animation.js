// 构造函数：定义每个对象，每次移动的属性和方法
function Task(obj, topStep, leftStep) {
    this.obj = obj;
    this.topStep = topStep;
    this.leftStep = leftStep;
    this.moveStep = function () {
        var objCSS = getStyle(this.obj);
        var top = parseInt(objCSS.top);
        var left = parseInt(objCSS.left);
        this.obj.style.top = top + this.topStep + 'px';
        this.obj.style.left = left + this.leftStep + 'px';
        this.obj.style.zIndex = '3'; // 移动的格子的 zindex
    },

        this.clearTask = function () {
            this.obj.style.top = '';
            this.obj.style.left = '';
            this.obj.style.zIndex = ''; // 还原默认的zindex =''
        },

        this.fadeIn = function () {
            this.obj.classList.add('pulse');
        },

        this.clearFadeIn = function () {
            this.obj.addEventListener('animationend', function () {
                this.classList.remove('pulse');
            })
        }
}

var animation = {
    times: 10, // 移动的次数或步数
    interval: 16, // 每一秒 迈一步
    timer: null, // 保存定时器线程号
    tasks: [],
    addAnimate: [],
    addTask: function (source, target) {
        var sourceCell = document.querySelector('#fc' + source);
        var targetCell = document.querySelector('#fc' + target);
        var sourceCSS = getStyle(sourceCell); // 获取原位置css样式
        var targetCSS = getStyle(targetCell); // 获取目标位置css样式
        var topStep = (parseInt(targetCSS.top) - parseInt(sourceCSS.top)) / this.times;
        var leftStep = (parseInt(targetCSS.left) - parseInt(sourceCSS.left)) / this.times;
        var task = new Task(sourceCell, topStep, leftStep); // 源 移动动画
        this.tasks.push(task);
    },
    addAnimateTask: function (target) { // 目标结束的显示动画
        var targetCell = document.querySelector('#fc' + target);
        var taskAnimate = new Task(targetCell);
        this.addAnimate.push(taskAnimate);
    },
    start: function () { // 启动动画
        clearInterval(this.timer);
        this.timer = setInterval(function () {
            for (var i = 0; i < animation.tasks.length; i++) {
                var task = animation.tasks[i];
                task.moveStep();
            }
            for (var i = 0; i < animation.addAnimate.length; i++) {
                var addAnimate = animation.addAnimate[i];
                addAnimate.fadeIn();
            }

            animation.times--;
            if (animation.times === 0) {
                for (var i = 0; i < animation.tasks.length; i++) {
                    var task = animation.tasks[i];
                    task.clearTask();
                }
                for (var i = 0; i < animation.addAnimate.length; i++) {
                    var addAnimate = animation.addAnimate[i];
                    addAnimate.clearFadeIn();
                }
                clearInterval(animation.timer);
                //  动画完成初始化
                animation.timer = null;
                animation.tasks = []; // 移动数组
                animation.addAnimate = []; // 清空显示的数组
                animation.times = 10;
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