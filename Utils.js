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
        //Get pixels colors as array in format [r1, g1, b1, a1, r2, g2, b2 ...]
        let pixelColors = pixels.data;
        let pixelCount = pixels.width * pixels.height;
        
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;

        //Plus 4 to omit alpha values
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
        //Get pixels colors as array in format [r1, g1, b1, a1, r2, g2, b2 ...]
        let pixelColors = pixels.data;
        let pixelCount = pixels.width * pixels.height;

        //Associative array where we will used colors and count of use times
        let colors = {};

        for(let i=0; i<pixelColors.length; i+=4) {
            //Normalize colors to suit our scale
            let r = api.normalize(pixelColors[i]).toString();
            let g = api.normalize(pixelColors[i+1]).toString();
            let b = api.normalize(pixelColors[i+2]).toString();
            
            r = api.addLeadingZero(r);
            g = api.addLeadingZero(g);
            b = api.addLeadingZero(b);

            //Make from color parts key for example '012312'
            let key = r + g + b;

            //Create on this index new counter or increase existing one
            if(colors[key] === undefined)
                colors[key] = 0;
            else
                colors[key] ++;
        }

        //Return array of object keys sorted by counter value
        colors = Object.keys(colors).sort((a, b) => {
            return colors[a] - colors[b];
        });

        //Get only first x colors we interested in
        colors = colors.slice(0, numberOfColors);
        
        //Denormalize and pack into object
        let mostUsedRGBColors = [];
        for(let i=0; i<numberOfColors; i++) {
            mostUsedRGBColors[i] = {
                r: api.denormalize(parseInt(colors[i].substring(0, 2))),
                g: api.denormalize(parseInt(colors[i].substring(2, 4))),
                b: api.denormalize(parseInt(colors[i].substring(4, 6)))
            };
        }

        return mostUsedRGBColors;
    };

    return api;
})();