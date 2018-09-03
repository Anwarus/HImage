//We want to convert colors from 0-255 to 0-31 scale for better performance
const NORMALIZED_MAX_VALUE = 31.0;
const DEFAULT_MAX_VALUE = 255.0

export let Utils = (() => {
    let api = {};

    api.denormalize = (value) => {
        return Math.floor((value * DEFAULT_MAX_VALUE) / NORMALIZED_MAX_VALUE);
    };

    api.normalize = (value) => {
        return Math.floor((value * NORMALIZED_MAX_VALUE) / DEFAULT_MAX_VALUE);
    };

    api.addLeadingZero = (colorPart) => {
        if(colorPart.length === 1)
        colorPart = '0' + colorPart;
    
        return colorPart;
    };

    api.getAverageColor = (pixels) => {
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

        return {
            r: Math.floor(rSum/pixelCount),
            g: Math.floor(gSum/pixelCount),
            b: Math.floor(bSum/pixelCount)
        };
    };

    api.getMostUsedColors = (pixels, numberOfColors) => {
        let pixelColors = pixels.data;
        let pixelCount = pixels.width * pixels.height;

        //Associative array where we will used colors and count of use times
        let colors = {};

        for(let i=0; i<pixelColors.length; i+=128) {
            //Normalize colors to suit our scale
            let r = Math.floor(pixelColors[i] * NORMALIZED_MAX_VALUE / DEFAULT_MAX_VALUE).toString();
            let g = Math.floor(pixelColors[i+1] * NORMALIZED_MAX_VALUE / DEFAULT_MAX_VALUE).toString();
            let b = Math.floor(pixelColors[i+2] * NORMALIZED_MAX_VALUE / DEFAULT_MAX_VALUE).toString();
            
            r = addLeadingZero(r);
            g = addLeadingZero(g);
            b = addLeadingZero(b);

            //Make from color parts key
            let key = r + g + b;

            if(colors[key] === undefined)
                colors[key] = 0;
            else
                colors[key] ++;
        }

        colors = Object.keys(colors).sort((a, b) => {
            return colors[a] - colors[b];
        });

        colors = colors.slice(0, numberOfColors);
        
        let mostUsedRGBColors = [];
        for(let i=0; i<numberOfColors; i++) {
            mostUsedRGBColors[i] = {
                r: denormalize(parseInt(colors[i].substring(0, 2))),
                g: denormalize(parseInt(colors[i].substring(2, 4))),
                b: denormalize(parseInt(colors[i].substring(4, 6)))
            };
        }

        return mostUsedRGBColors;
    };

    return api;
})();