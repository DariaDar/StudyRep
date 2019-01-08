var sound, drawTimer, clearTimer;
var canvasT = document.getElementById('canvasText');
var ctx = canvasT.getContext("2d");

$(document).ready(function () {
    window.scrollTo(0, 0);
    $('.item__icon').hover(
        function () {
            $(this).addClass('animated pulse'); // Добавляем класс bounce
        },
        function () {
            $(this).removeClass('animated pulse'); // Убираем класс
        }
    );
    createSound();
    setBackground();
    drawTimer = window.setInterval(RandomText, 300);
    //clearTimer = window.setInterval(clear, 800);
});

$(window).on('load', function () {
    var $preloader = $('#preloader'),
        $svg_anm = $preloader.find('.preloader-content');
    $svg_anm.fadeOut();
    $preloader.delay(500).fadeOut('slow');
});

function RandomText() {
    canvasT.width = 700;
    canvasT.height = 320;

    var background = new Image();
    background.src = "../images/leafSmall.png";
    ctx.drawImage(background,230,0);

    var fontSize = Math.random() * 50;
    var x = Math.random() * 700;
    var y = Math.random() * 320;

    var r = Math.floor(Math.random() * 255) + 50;
    var g = Math.floor(Math.random() * 255) + 50;
    var b = Math.floor(Math.random() * 255) + 50;

    var color = 'rgba(' + r + ',' + g + ',' + b +',1.0)';
    ctx.fillStyle = color;
    ctx.font = fontSize + 'pt Courier New';
    ctx.fillText('Фенечки', x, y);
}

function clear() {
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(0, 0, 700, 320);
}

function setBackground() {

}


function createSound() {
    sound = document.createElement('audio');
    var src = "../sounds/shaman.mp3";
    sound.setAttribute('src', src);
    sound.setAttribute('preload', 'auto');
    sound.setAttribute('controls', 'none');
    sound.setAttribute('type', 'audio/mp3');
    this.sound.setAttribute('muted', 'muted');
    sound.style.display = 'none';
    document.body.appendChild(sound);
}

document.getElementById('mute').addEventListener('click', function (evt) {
    if(sound.muted) {
        sound.muted = false;
        evt.target.innerHTML = 'Включен';
        sound.play();
    } else {
        sound.muted = true;
        evt.target.innerHTML = 'Выключен';
    }
});


(function () {

    var bear,
        bearImage,
        owl,
        owlImage,
        canvas;

    function gameLoop () {

        window.requestAnimationFrame(gameLoop);

        bear.update();
        bear.render();

        owl.update();
        owl.render();
    }

    function owlLoop () {

        window.requestAnimationFrame(owlLoop);

        owl.update();
        owl.render();
    }

    function sprite (options) {

        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.dx = options.dx;
        that.dy = options.dy;

        that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

                tickCount = 0;

                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };

        that.render = function () {

            // Clear the canvas
            that.context.clearRect(that.dx, that.dy, that.width, that.height);

            // Draw the animation
            that.context.drawImage(
                that.image,
                frameIndex * that.width / numberOfFrames,
                0,
                that.width / numberOfFrames,
                that.height,
                that.dx,
                that.dy,
                that.width / numberOfFrames,
                that.height);
        };

        return that;
    }

    // Get canvas
    canvas = document.getElementById('canvasAnimation');
    canvas.width = 700;
    canvas.height = 320;

    // Create sprite sheet
    bearImage = new Image();
    owlImage = new Image();

    // Create sprite
    bear = sprite({
        context: canvas.getContext("2d"),
        width: 905,
        height: 320,
        image: bearImage,
        numberOfFrames: 4,
        ticksPerFrame: 15,
        dx: 0,
        dy: 0
    });

    owl = sprite({
        context: canvas.getContext("2d"),
        width: 712,
        height: 300,
        image: owlImage,
        numberOfFrames: 4,
        ticksPerFrame: 15,
        dx: 500,
        dy: 0
    });

    // Load sprite sheet
    bearImage.addEventListener("load", gameLoop);
    owlImage.addEventListener("load", gameLoop);
    bearImage.src = "../images/bear.png";
    owlImage.src = "../images/owl.png"

} ());

