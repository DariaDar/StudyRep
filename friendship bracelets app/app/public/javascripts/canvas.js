var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// Представление всех ячеек
var cells = [];
var cellsOld = [];

var cellWidth = 20;
var cellHeight = 20;
var cellsInRow = parseInt(document.getElementById('schema-width').value);
var cellsInColumn = parseInt(document.getElementById('schema-height').value);
var canvasWidth = cellWidth * cellsInRow;
var canvasHeight = cellHeight * cellsInColumn;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
var curColor = document.getElementById("color-picker").value;
var sound;

//-------------COLOR----------
$('#color-picker').blur(function () {
    curColor = document.getElementById("color-picker").value;
});

//----------------------------


//--------SOUND----------------
function getRadioValue(theRadioGroup) {
    var elements = document.getElementsByName(theRadioGroup);
    for (var i = 0, l = elements.length; i < l; i++) {
        if (elements[i].checked) {
            return elements[i].value;
        }
    }
}

function setSound() {
    $('.options__radio').on('change', function () {
        //document.body.removeChild(sound);
        sound = document.createElement('audio');
        var soundType = getRadioValue('radioSound');
        var src = "../sounds/" + soundType + ".mp3";
        sound.setAttribute('src', src);
        sound.setAttribute('preload', 'auto');
        sound.setAttribute('controls', 'none');
        sound.setAttribute('type', 'audio/mp3');
        //this.sound.setAttribute('muted', 'muted');
        sound.style.display = 'none';
        document.body.appendChild(sound);
    })
}

//------------------------------------------


//---------------SIZE-----------------------

function increaseValue(className) {
    var value;
    if (className === "pointer-right") {
        value = parseInt(document.getElementById('schema-width').value);
        value = isNaN(value) ? 0 : value;
        if(value < 38)
            value++;
        document.getElementById('schema-width').value = value;
        changeSize(parseInt(document.getElementById('schema-height').value), value);
    } else if (className === "pointer-down") {
        value = parseInt(document.getElementById('schema-height').value);
        value = isNaN(value) ? 0 : value;
        if(value < 100)
            value++;
        document.getElementById('schema-height').value = value;
        changeSize(value, parseInt(document.getElementById('schema-width').value));
    }
    else {
        return;
    }
}

function decreaseValue(className) {
    var value;
    if (className === "pointer-left") {
        value = parseInt(document.getElementById('schema-width').value);
        value = isNaN(value) ? 0 : value;
        if(value > 5)
            value--;
        document.getElementById('schema-width').value = value;
        changeSize(parseInt(document.getElementById('schema-height').value), value);
    } else if (className === "pointer-up") {
        value = parseInt(document.getElementById('schema-height').value);
        value = isNaN(value) ? 0 : value;
        if(value > 5)
            value--;
        document.getElementById('schema-height').value = value;
        changeSize(value, parseInt(document.getElementById('schema-width').value));
    }
    else {
        return;
    }
}

function changeSize(height, width) {
    cellsInRow = width;
    cellsInColumn = height;
    canvasWidth = cellWidth * cellsInRow;
    canvasHeight = cellHeight * cellsInColumn;
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    cells = [];
    drawBoard();
}

//----------------------------------------------

//-------------DRAWING--------------------------

function drawBoard() {
    console.log("ROW AND COLUMN: " + cellsInRow + " " + cellsInColumn);
    console.log("CANVAS WIDTH AND HEIGHT: " + canvasWidth + " " + canvasHeight);

    for (var top = 0; top < canvasWidth; top += cellWidth) {
        for (var left = 0; left < canvasHeight; left += cellHeight) {
            var cell = {
                top: top,
                left: left,
                solid: false,
                fill: function (solid) {
                    // запоминаем состояние закрашенности клетки
                    this.solid = solid;
                    //fillingColor = solid ? '#FFF' : curColor;
                    context.fillStyle = solid ? '#FFF' : curColor;
                    context.fillRect(this.top, this.left, cellWidth, cellHeight);
                    if (sound)
                        sound.play();
                },
                //color: fillingColor,
                drawBorder: function () {
                    context.beginPath();
                    context.strokeStyle = 'gray';
                    context.moveTo(this.top - 0.5, this.left - 0.5)
                    context.lineTo(this.top - 0.5, this.left + cellWidth - 0.5)
                    context.lineTo(this.top + cellHeight - 0.5, this.left + cellWidth - 0.5)
                    context.lineTo(this.top + cellHeight - 0.5, this.left - 0.5)
                    context.lineTo(this.top - 0.5, this.left - 0.5)
                    context.stroke()
                },
                getTop: function () {
                    return this.top
                },
                getLeft: function () {
                    return this.left
                }
            }
            cells.push(cell);
            cell.fill(true);
            cell.drawBorder();
        }
    }
}

function getCellByPosition(top, left) {
    var topIndex;
    var leftIndex;
    topIndex = Math.floor(top / cellHeight);
    leftIndex = Math.floor(left / cellWidth);
    console.log(top, left);
    console.log(topIndex, leftIndex);
    var cell = cells.find(x => x.top === (topIndex * cellHeight) && x.left === (leftIndex * cellHeight));
    console.log("FOUND " + cell.top + " " + cell.left);
    return cells.find(x => x.top === (topIndex * cellHeight) && x.left === (leftIndex * cellHeight));
}

// Взаимодействие
var filling = false;

function fillCellAtPositionIfNeeded(x, y, fillingMode) {
    var cellUnderCursor = getCellByPosition(x, y);
    if (cellUnderCursor.solid !== fillingMode) {
        cellUnderCursor.fill(fillingMode)
    }
    cellUnderCursor.drawBorder()
}

function handleMouseDown(event) {
    filling = !getCellByPosition(event.layerX, event.layerY).solid;
    fillCellAtPositionIfNeeded(event.layerX, event.layerY, filling);

    canvas.addEventListener('mousemove', handleMouseMove, false)
}

function handleMouseUp() {
    canvas.removeEventListener('mousemove', handleMouseMove)
}

function handleMouseMove(event) {
    fillCellAtPositionIfNeeded(event.layerX, event.layerY, filling)
}

canvas.addEventListener('mousedown', handleMouseDown, false);
canvas.addEventListener('mouseup', handleMouseUp, false);

//-------------------------------------------------------

setSound();
drawBoard();