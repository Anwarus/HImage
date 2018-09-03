let path = require('path');
let expect = require('chai').expect;

import { Utils } from './../Utils';

describe('Color pallete for image', () => {
    describe('normalize function', () => {
        it('should return in range from 0 to 31', () => {
            expect(Utils.normalize(0)).to.equal(0);
            expect(Utils.normalize(128)).to.equal(15);
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
});