//ON PC
function getImage(canvas) {
    var imageData = canvas.toDataURL('image/png');
    var image = new Image();
    image.src = imageData;
    return image;
}

function saveImage(image, name) {
    var link = document.createElement("a");

    link.setAttribute("href", image.src);
    link.setAttribute("download", name);
    link.click();
}

$('.download').on('click', function () {
    var name = document.getElementById('title').value;
    if (name.length === 0)
        name = "Моя схема";
    var image = getImage(document.getElementById('canvas'));
    saveImage(image, name);
});

//SERVER
$('.downloadOnServer').click(function () {
    var canvas = document.getElementById('canvas');
    var name = document.getElementById('title').value;
    console.log(name);
    var image = canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
    $.ajax({
        type: "POST",
        url: "/createPattern",
        data: {
            image: image,
            name: name
        },
        success: function (message) {
            $('.results').html(message);
            document.getElementById('saveOnServer').disabled = true;
        },
        error: function () {
            $('.results').html("Ошибка сохранения :(");
        }

    })
});
