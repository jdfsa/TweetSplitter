'use strict';

const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');

const endpoints = require('../config/endpoints');
const mockResponse = require('../test/mock-response.json');

const expect = chai.expect;
const assert = chai.assert;

describe('/processor/tweet.processor.js', () => {
    let service = null;
    let mockRandom = null;

    before(() => {
        const servicePath = path.join(process.cwd(), 'processor', 'tweet.processor');
        service = proxyquire(servicePath, {
            '../service/tweet.service': {
                getTweets: (successCallback, errorCallback) => {
                    successCallback(mockResponse)
                }
            }
        });
    });

    afterEach(() => {
        if (mockRandom) {
            Math.random.restore();
        }
    });

    it('should get any tweet message', (end) => {

        // mock randomize - corresponds to the 4th element in the mock response
        sinon.stub(Math, 'random').returns(0.2);

        service.getSplittedTweet(
            (data) => {
                assert.deepEqual(data, [
                    "Tweet #1: 🚧 Das 23h30 às 4h30, Túnel Max Feffer estará",
                    "Tweet #2: interditado, em ambos os sentidos, para",
                    "Tweet #3: realização de serviços de limp…",
                    "Tweet #4: https://t.co/RCOr8Wqrlg"
                ]);
                end();
            },
            (error) => {
                assert.fail('an error response was not expeted');
            }
        );
    });
});