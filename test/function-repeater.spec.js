const should = require('should');
const sinon = require('sinon');
require('should-sinon');
const FunctionRepeater = require('../lib/function-repeater');

describe('FunctionRepeater', () => {

    it('should exist', () => {
        should(FunctionRepeater).be.ok();
    });

    describe('instance', () => {
        var targetSpy, target, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            target = function () {
                targetSpy.apply(this, arguments);
            };
            instance = new FunctionRepeater(target);
        });
        it('should exist', () => {
            should(instance).be.ok();
        });
        it('should not yet call spy', () => {
            should(targetSpy).not.be.called();
        });
        describe('when proxy is called', () => {
            beforeEach(() => {
                instance.proxy();
            });
            it('should call spy', () => {
                should(targetSpy).be.called();
            });
        });
        describe('when proxy is called with arguments', () => {
            var args;
            beforeEach(() => {
                args = [48, 98];
                instance.proxy(args[0], args[1]);
            });
            it('should call spy with arguments', () => {
                should(targetSpy).be.calledWith(args[0], args[1]);
            });
        });

        describe('beginning to transmit', () => {
            var receiverSpy, receiver, transmission;
            beforeEach(() => {
                receiverSpy = sinon.spy();
                receiver = function () {
                    receiverSpy();
                };
                transmission = instance.transmitter.transmit(receiver);
            });
            it('should not yet call spy', () => {
                should(receiverSpy).not.be.called();
            });
            describe('when proxy is called', () => {
                beforeEach(() => {
                    instance.proxy();
                });
                it('should call spy', () => {
                    should(receiverSpy).be.called();
                });
            });
            describe('when transmission is closed', () => {
                beforeEach(() => {
                    transmission.close();
                });
                describe('when proxy is called', () => {
                    beforeEach(() => {
                        receiverSpy.reset();
                        instance.proxy();
                    });
                    it('should not call spy', () => {
                        should(receiverSpy).not.be.called();
                    });
                });
            });
        });
    });

    describe('instance with target and context', () => {
        var targetSpy, context, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            context = {
                id: 101,
                craft: function () {
                    targetSpy.apply(this, arguments);
                }
            };
            instance = new FunctionRepeater(context.craft, context);
        });
        describe('when calling proxy', () => {
            beforeEach(() => {
                instance.proxy();
            });
            it('should call spy with context', () => {
                should(targetSpy).be.calledOn(context);
            });
        });
    });

    describe('instance with contextual target but no explicit context', () => {
        var targetSpy, context, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            context = {
                id: 101,
                craft: function () {
                    targetSpy.apply(this, arguments);
                }
            };
            instance = new FunctionRepeater(context.craft);
        });
        describe('when calling proxy', () => {
            beforeEach(() => {
                instance.proxy();
            });
            it('should call spy with context', () => {
                should(targetSpy).be.calledOn(instance);
            });
        });
    });

    describe('instance with target that returns value', () => {
        var rv, target, instance;
        beforeEach(() => {
            rv = 150;
            target = function () {
                return rv;
            };
            instance = new FunctionRepeater(target);
        });
        describe('proxy', () => {
            it('should return same value as target', () => {
                let proxy = instance.proxy;
                should(proxy()).eql(target());
            });
        });
    });

    // TODO test that target is called before receivers

    // TODO test when target throws error

    // TODO test when receiver throws error

});
