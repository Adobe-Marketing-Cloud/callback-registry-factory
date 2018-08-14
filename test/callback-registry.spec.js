var chai = require("chai");
require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var callbackRegistryFactory = require('../');

var noop = function () {};
var TEST_KEY = 'TEST_KEY';
var callbackRegistry = callbackRegistryFactory();

['add', 'execute', 'executeAll'].forEach(function (api) {
    sinon.spy(callbackRegistry, api);
});

describe('callbackRegistryFactory', function () {
    it('should generate an object', function() {
        callbackRegistry.should.be.an('object');
    });

    describe('add', function () {
        it('should add callback to the list', function () {
            var testCallback = noop;
            var result = callbackRegistry.add(TEST_KEY, testCallback);
            result.should.be.a('function');
            callbackRegistry.callbacks.TEST_KEY.should.exist;
            callbackRegistry.callbacks.TEST_KEY.should.include(testCallback);
        });
    });

    describe('execute', function () {
        it('should execute the callback if it exists', function () {
            callbackRegistry.execute(TEST_KEY);
            callbackRegistry.execute.should.have.been.calledWith(TEST_KEY);
        });

        it('should delete the callback from the list', function () {
            expect(callbackRegistry.callbacks).to.deep.equal({});
        });

        it('should execute the array of callbacks', function () {
            // When passing an array as callback, first element is the context.
            var testCallbackArray = [null, noop];

            callbackRegistry.add(TEST_KEY, testCallbackArray);
            callbackRegistry.add.should.have.been.calledWith(TEST_KEY, testCallbackArray);
            callbackRegistry.callbacks.TEST_KEY.should.include(testCallbackArray);

            callbackRegistry.execute(TEST_KEY);
            callbackRegistry.execute.should.have.been.calledWith(TEST_KEY);
        });

        it('should remove the callbacks from the list', function () {
            expect(callbackRegistry.callbacks).to.deep.equal({});
        });

        it('should not throw if a callback does not exist', function () {
            var invalidKey = "invalidkey";
            callbackRegistry.execute(invalidKey);

            callbackRegistry.execute.should.have.been.calledWith(invalidKey);
            expect(callbackRegistry.callbacks).to.deep.equal({});

            expect(function () {
                callbackRegistry.execute(invalidKey);
            }).to.not.throw();
        });
    });

    describe('executeAll', function () {
        var callback = sinon.spy();

        before(function () {
            callbackRegistry.add(TEST_KEY, callback);
        });

        it('should exit if no paramsMap and no forceExecute', function () {
            callbackRegistry.executeAll(undefined, false);
            callback.should.not.been.called;
        });

        it('should exit if no forceExecute and paramsmap is empty', function () {
            callbackRegistry.executeAll({}, false);
            callback.should.not.been.called;
        });

        it('should execute the callbacks if paramsMap is empty but with forceExecute', function () {
            callbackRegistry.executeAll({}, true);
            callback.should.have.been.calledOnce;
        });

        it('should call the callback with the correct param', function () {
            callbackRegistry.add(TEST_KEY, callback);
            callbackRegistry.executeAll({
                TEST_KEY: "test param"
            }, true);
            callback.should.have.been.calledWith("test param");
        });
    });

    describe('hasCallbacks', function () {
        it('should return correct answer', function () {
            expect(callbackRegistry.callbacks).to.deep.equal({});
            callbackRegistry.hasCallbacks().should.equal(false);

            callbackRegistry.add(TEST_KEY, noop);
            callbackRegistry.hasCallbacks().should.equal(true);
        });
    });
});
