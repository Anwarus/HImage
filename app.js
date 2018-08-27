import $ from 'jquery';

$("#image").click(() => {
    $('input:file')[0].click();
});

function showImage(src,image,canvas) {
    let fileReader = new FileReader();

    //When image is loaded, set the src of the image where you want to display it
    fileReader.onload = (e) => {
        image.src = e.target.result;

        canvas.width = 1920;
        canvas.height = 1080;
        canvas.getContext('2d').drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        getAverageColor(canvas);
        getMostUsedColors(canvas, 4);
    }
    
    src.addEventListener("change",function() {
      //Fill fr with image data    
      fileReader.readAsDataURL(src.files[0]);
    });
  }
  
var src = document.getElementById("src");
var image = document.getElementById("target");
var canvas = document.getElementById("canvas");

showImage(src,image,canvas);

function getAverageColor(canvas) {
    let pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let pixelColors = pixels.data;
    let pixelCount = pixels.width * pixels.height;
    
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;

    for(let i=0; i<pixelColors.length; i+=4) {
        rSum += pixelColors[i];
        gSum += pixelColors[i+1];
        bSum += pixelColors[i+2];
    }

    let result = {
        r: Math.floor(rSum/pixelCount),
        g: Math.floor(gSum/pixelCount),
        b: Math.floor(bSum/pixelCount)
    };

    $('#main-color').css({ fill: "rgba(" + result.r + ", " + result.g + ", " + result.b + ", 255)" });
    $('#first-left-color').css({ fill: "rgba(" + 168 - result.r + ", " + 168 - result.g + ", " + 168 - result.b + ", 255)" });
    $('#second-left-color').css({ fill: "rgba(" + 1 + result.r + ", " + 1 + result.g + ", " + 1 + result.b + ", 255)" });
    $('#first-right-color').css({ fill: "rgba(" + 255 - result.r + ", " + 255 - result.g + ", " + 255 - result.b + ", 255)" });
    $('#second-right-color').css({ fill: "rgba(" + 255 + result.r + ", " + 255 + result.g + ", " + 255 + result.b + ", 255)" });
}

function getMostUsedColors(canvas, numberOfColors) {
    let pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let pixelColors = pixels.data;
    let pixelCount = pixels.width * pixels.height;

    //We want to convert colors from 0-255 to 0-31 scale
    let normalizedMaxValue = 31;

    let colors = Array.from({ length: Math.pow(normalizedMaxValue + 1, 3) }, () => 0);
    let mostUsedColors = Array.from({ length: numberOfColors }, () => 0);
    let mostUsedRGBColors = Array.from({ length: numberOfColors }, () => 0);

    for(let i=0; i<pixelColors.length; i+=4) {
        let r = pixelColors[i] * normalizedMaxValue / 255.0;
        let g = pixelColors[i+1] * normalizedMaxValue / 255.0;
        let b = pixelColors[i+2] * normalizedMaxValue / 255.0;

        r = r.toString();

        if(g.toString().length == 1)
            g = '0' + g;

        if(b.toString().length == 1)
            b = '0' + b;

        let address = parseInt(r + g + b);

        colors[address]++;
    }

    for(let i=0; i<colors.length; i++) {
        for(let j=0; j<mostUsedColors.length; j++)
        {
            if(colors[i] > mostUsedColors[j]) {
                mostUsedColors[j] = i;
                break;
            }
        }
    }

    for(let i=0; i<mostUsedColors.length; i++) {
        let mostUsedColor = mostUsedColors[i].toString();

        if(mostUsedColor.length == 4)
            mostUsedColor = '00' + mostUsedColor;

        if(mostUsedColor.length == 5)
            mostUsedColor = '0' + mostUsedColor;

        mostUsedRGBColors[i] = {
            r: denormalize(parseInt(mostUsedColor.substring(0, 2)), normalizedMaxValue),
            g: denormalize(parseInt(mostUsedColor.substring(2, 4)), normalizedMaxValue),
            b: denormalize(parseInt(mostUsedColor.substring(4, 6)), normalizedMaxValue)
        };
    }

    console.log(mostUsedColors);
    console.log(mostUsedRGBColors);

    $('#first-left-color').css({ fill: "rgba(" + mostUsedRGBColors[0].r + ", " + mostUsedRGBColors[0].g + ", " + mostUsedRGBColors[0].b + ", 255)" });
    $('#second-left-color').css({ fill: "rgba(" + mostUsedRGBColors[1].r + ", " + mostUsedRGBColors[1].g + ", " + mostUsedRGBColors[1].b + ", 255)" });
    $('#first-right-color').css({ fill: "rgba(" + mostUsedRGBColors[2].r + ", " + mostUsedRGBColors[2].g + ", " + mostUsedRGBColors[2].b + ", 255)" });
    $('#second-right-color').css({ fill: "rgba(" + mostUsedRGBColors[3].r + ", " + mostUsedRGBColors[3].g + ", " + mostUsedRGBColors[3].b + ", 255)" });
}

function denormalize(value, factor) {
    return Math.floor((value * 255) / factor);
}