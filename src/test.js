import Store, {
    Reducer
} from './';
import {
    assert,
} from 'chai';

const Sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('test', () => {
    it ('should echo back default state', () => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }
        }
        const a = new A();
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');
    });

    it ('should respond to sync reducer', () => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }
            @Reducer('test')
            test() {
                return {
                    a: '2',
                    b: '1',
                }
            }
        }
        const a = new A();
        a.dispatch('test')
        const state = a.getState();
        assert.equal(state.a, '2');
        assert.equal(state.b, '1');
    });

    it ('should respond to async reducer', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    a: '2',
                    b: '1',
                }
            }
        }
        const a = new A();
        Sleep(10).then(res => {
            const state = a.getState();
            assert.equal(state.a, '2');
            assert.equal(state.b, '1');
            done();
        })
        a.dispatch('test');
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');

    });

    it ('should call subscribers', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    a: '2',
                    b: '1',
                }
            }
        }
        const a = new A();
        a.subscribe(state => {
            assert.equal(state.a, '2');
            assert.equal(state.b, '1');
            done();
        });
        a.dispatch('test');
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');
    });

    it ('should unsubscribe', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    a: '2',
                    b: '1',
                }
            }
        }
        const a = new A();
        const dispose = a.subscribe(state => {
            assert.isNull('this should not be triggered');
        });
        a.dispatch('test');
        dispose();
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');
        setTimeout(done, 1000);
    });

    it ('should call @onUpdate methods', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    a: '2',
                    b: '1',
                }
            }
        }
        const a = new A();

        class B {
            @a.onUpdate()
            onUpdate(state) {
                assert.equal(state.a, '2');
                assert.equal(state.b, '1');
                done();
            }
        }
        const b = new B();
        b.componentDidMount();
        a.dispatch('test');
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');
    });

    it ('should call @onUpdate methods on desired actions', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    a: '2',
                    b: '1',
                }
            }

            @Reducer('test2')
            async test() {
                await Sleep(1);
                return {
                    a: '3',
                    b: '2',
                }
            }
        }
        const a = new A();

        class B {
            @a.onUpdate('test2')
            onUpdate(state) {
                assert.equal(state.a, '3');
                assert.equal(state.b, '2');
                done();
            }
        }
        const b = new B();
        b.componentDidMount();
        a.dispatch('test');
        a.dispatch('test2');
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');
    });

    it ('should unmount @onUpdate methods', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    a: '2',
                    b: '1',
                }
            }
        }
        const a = new A();

        class B {
            @a.onUpdate()
            onUpdate(state) {
                assert.isNull('this should not be triggered');
            }
        }
        const b = new B();
        b.componentDidMount();
        b.componentWillUnmount();
        a.dispatch('test');
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');
        setTimeout(done, 100);
    });

    it ('should take params', () => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }
            @Reducer('test')
            test(a, b) {
                return {
                    a,
                    b,
                }
            }
        }
        const a = new A();
        a.dispatch('test', '2', '1');
        const state = a.getState();
        assert.equal(state.a, '2');
        assert.equal(state.b, '1');
    });


});
