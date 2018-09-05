let path = require('path');
let expect = require('chai').expect;

import { Utils } from './../Utils';

describe('Color pallete for image', () => {
    describe('normalize function', () => {
        it('should return in range from 0 to 31', () => {
            expect(Utils.normalize(0)).to.equal(0);
            expect(Utils.normalize(128)).to.equal(16);
            expect(Utils.normalize(255)).to.equal(31);
        });
    });
    
    describe('denormalize function', () => {
        it('should return in range from 0 to 255', () => {
            expect(Utils.denormalize(0)).to.equal(0);
            expect(Utils.denormalize(15)).to.equal(123);
            expect(Utils.denormalize(31)).to.equal(255);
        });
    });

    describe('addLeadingZero function', () => {
        it('should return string of lenght 2 and leading 0', () => {
            let singleCharStr = Utils.addLeadingZero('1');
            expect(singleCharStr[0]).to.equal('0');
            expect(singleCharStr.length).to.equal(2);

            let doubleCharStr = Utils.addLeadingZero('01');
            expect(singleCharStr[0]).to.equal('0');
            expect(singleCharStr.length).to.equal(2);
        });
    });

    describe('getAverageColor function', () => {
        it('should return average color of image (pixel data object)', () => {
            let averageColor = Utils.getAverageColor({
                width: 2,
                height: 2,
                data: [
                    255, 153, 0, 1,
                    255, 235, 12, 1,
                    255, 10, 94, 1,
                    255, 0, 190, 1
                ]
            });

            expect(averageColor.r).to.equal(255);
            expect(averageColor.g).to.equal(99);
            expect(averageColor.b).to.equal(74);
        });
    });

    describe('getMostUsedColors function', () => {
        it('should return array of most used colors', () => {
            let mostUsedColors = Utils.getMostUsedColors({
                width: 2,
                height: 2,
                data: [
                    255, 153, 0, 1,
                    255, 153, 0, 1,
                    128, 10, 94, 1,
                    18, 0, 190, 1
                ]
            }, 3);
            
            expect(mostUsedColors[0].r).to.equal(255);
            expect(mostUsedColors[0].g).to.equal(156);
            expect(mostUsedColors[0].b).to.equal(0);

            expect(mostUsedColors[1].r).to.equal(132);
            expect(mostUsedColors[1].g).to.equal(8);
            expect(mostUsedColors[1].b).to.equal(90);

            expect(mostUsedColors[2].r).to.equal(16);
            expect(mostUsedColors[2].g).to.equal(0);
            expect(mostUsedColors[2].b).to.equal(189);
        });
    });
});