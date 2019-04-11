var onTouch = {
    c: 0,
    cc: 5,
    t: null,
    move: false,
    x: '',
    y: '',
    X: '',
    Y: '',
    stop: function () {
        if (onTouch.t != null) {
            clearTimeout(onTouch.t);
        }
    },
    init: function (callback) {
        onTouch.c = 0;
        onTouch.stop();
        onTouch.timedCount(callback);
    },
    timedCount: function (callback) {
        onTouch.c++;
        //  console.log(onTouch.c);
        if (onTouch.c > onTouch.cc) {
            onTouch.stop();
            callback();
            return null;
        }
        onTouch.t = setTimeout(function () {
            onTouch.timedCount(callback);
        }, 100);
    },
    timedCountEnd: function (callback) {
        if (onTouch.c < onTouch.cc) {
            callback()
        }
    },
    touchstart: function (obj, callback) {
        obj.addEventListener('touchstart', function (event) {
            onTouch.x = parseInt(event.touches[0].pageX);
            onTouch.y = parseInt(event.touches[0].pageY);
           // console.log('触摸开始');
            onTouch.init(function () {
                callback();
            });
        }, false);
    },
    touchmove: function (obj, callback) {
        obj.addEventListener('touchmove', function (event) {
            event.preventDefault();
            onTouch.stop();
            // onTouch.x = parseInt(event.touches[0].pageX);
            // onTouch.y = parseInt(event.touches[0].pageY);
            onTouch.move = true;
           // console.log('触摸滑动');
            callback();
        }, false);
    },
    touchend: function (obj, callback1, callback2) {

        obj.addEventListener('touchend', function (event) {
            onTouch.stop();
            onTouch.X = parseInt(event.changedTouches[0].pageX);
            onTouch.Y = parseInt(event.changedTouches[0].pageY);
            if (onTouch.move == true) {
                callback1();
                onTouch.X = '';
                onTouch.Y = '';
                onTouch.x = '';
                onTouch.y = '';
               // console.log('触摸滑动结束');
                onTouch.move = false;
            } else {
                onTouch.timedCountEnd(function () {
                    console.log('触摸点击结束');
                  //  console.log(event.target);
                    callback2(event); // 传参 target element 元素
                });
            }
        }, false);
    },
    touchcancel: function (obj, callback) {
        obj.addEventListener('touchcancel', function (event) {
            //  event.preventDefault; // pc上回弹出右键框
            onTouch.stop();
            console.log('触摸取消');
            callback();
        }, false);
    },
    log: function (s) {
        console.log(s + ":" + onTouch.x + "," + onTouch.y);
    }
};
/* @ example
*  function loads(){
        onTouch.touchstart(document, function () {
            document.querySelector('#div1').innerHTML = "1";
           alert('长按触发');
        });
        onTouch.touchmove(document, function () {
            document.querySelector('#div1').innerHTML = "2";
        });
        onTouch.touchend(document, function () {
            document.querySelector('#div1').innerHTML = "3";
            alert('滑动结束触发');
        }, function () {
            alert('点击结束触发');
            document.querySelector('#div1').innerHTML = "4";
        });
        onTouch.touchcancel(document, function () {
            alert('取消触发');
            document.querySelector('#div1').innerHTML = "5";
        });
    }

    window.addEventListener('load',loads, false);
* */

