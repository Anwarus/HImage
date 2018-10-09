import $ from 'jquery';
import jQuery from 'jquery';
import { Utils } from './Utils';

jQuery.fn.extend({
    replaceClass: function(oldClass, newClass, force = false) {
        if($(this).hasClass(oldClass) || force === true)
            $(this).removeClass(oldClass).addClass(newClass);
    }
});

$(function() {
    //Pass custom button click to image input
    $("#select-image").click(() => {
        $('input:file')[0].click();
    });
    
    var imageInput = document.getElementById("image-input");
    var imageContainer = document.getElementById("image-container");
    var canvas = document.getElementById("canvas");

    //On image change draw image in canvas using FileReader to get pixel data
    $(imageInput).on('change', () => {
        let fileReader = new FileReader();

        $(imageContainer).removeClass('selected');
        $(imageContainer).css('box-shadow', '');

        $('.selected-color').removeClass('choosed-color');
        imageContainer.src = '';

        $('#logo').replaceClass('slide-up', 'slide-down');
        $('#decoration').replaceClass('slide-up', 'slide-down');
        $('#colors').replaceClass('slide-up', 'slide-down');
        $('#select-image').replaceClass('slide-down', 'slide-up');

        //On image load by FileReader
        fileReader.onload = (e) => {
            imageContainer.src = e.target.result;

            //Wait until image will load at the container
            imageContainer.onload = () => {
                $(imageContainer).addClass('selected');

                //Configure canvas and draw image
                canvas.width = imageContainer.naturalWidth;
                canvas.height = imageContainer.naturalHeight;
                canvas.getContext('2d').drawImage(imageContainer, 0, 0, imageContainer.naturalWidth, imageContainer.naturalHeight);
                
                //Extract pixels object data
                let pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

                let averageColor = Utils.getAverageColor(pixels);
                let mostUsedColors = Utils.getMostUsedColors(pixels, 4);

                $('#main-color').css({ fill: "rgba(" + averageColor.r + ", " + averageColor.g + ", " + averageColor.b + ", 255)" });
                $('#first-left-color').css({ fill: "rgba(" + mostUsedColors[0].r + ", " + mostUsedColors[0].g + ", " + mostUsedColors[0].b + ", 255)" });
                $('#second-left-color').css({ fill: "rgba(" + mostUsedColors[1].r + ", " + mostUsedColors[1].g + ", " + mostUsedColors[1].b + ", 255)" });
                $('#first-right-color').css({ fill: "rgba(" + mostUsedColors[2].r + ", " + mostUsedColors[2].g + ", " + mostUsedColors[2].b + ", 255)" });
                $('#second-right-color').css({ fill: "rgba(" + mostUsedColors[3].r + ", " + mostUsedColors[3].g + ", " + mostUsedColors[3].b + ", 255)" });

                //Move logo polygon up to make more space for image
                $('#logo').replaceClass('slide-down', 'slide-up', true);
                //Move decoration polygon up to make more space for image
                $('#decoration').replaceClass('slide-down', 'slide-up', true);
                //Move color polygons up to make more space for image
                $('#colors').replaceClass('slide-down', 'slide-up', true);
                //Move image select polygon down to make more space for image
                $('#select-image').replaceClass('slide-up', 'slide-down', true);
            };
        }

        let file = imageInput.files[0];

        //Check uploaded file type
        if(file.type.indexOf('image') != -1) {
            //Load image to FileReader
            fileReader.readAsDataURL(file);
        }
    });

    $('.color-picker').on('click', function(){
        if($(imageContainer).hasClass('selected')) {
            $('.color-picker').removeClass('selected');
            $(this).addClass('selected');

            let rgb = $(this).css('fill');

            let rbgObj = rgbStringToObject(rgb);
            let hex = Utils.rgbToHex(rbgObj.r, rbgObj.g, rbgObj.b);

            $('#rgb-text').text(rgb);
            $('#hex-text').text(hex);

            $('.selected-color').addClass('choosed-color');

            $(imageContainer).css('box-shadow', '0px 0px 5px 20px ' + hex);

        }
    });

    $(document).on('click', '.choosed-color', function(){
        const el = document.createElement('textarea');
        el.value = $(this)[0].innerHTML;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    });

});

function rgbStringToObject(color) {
    let colorNumbers = color.substring(
        color.lastIndexOf("(") + 1, 
        color.lastIndexOf(")")
    ).split(',');

    return {
        r: parseInt(colorNumbers[0]),
        g: parseInt(colorNumbers[1]),
        b: parseInt(colorNumbers[2])
    };
}

window.validateForm() {
    if($('#feedback-text').val().length === 0)
        return false;
}