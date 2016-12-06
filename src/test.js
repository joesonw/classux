import Store, {
    Reducer,
    Inject,
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

    it ('should respond to sync reducer', (done) => {
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
        setTimeout(() => {
            const state = a.getState();
            assert.equal(state.a, '2');
            assert.equal(state.b, '1');
            done();
        }, 100);
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
        Sleep(100).then(res => {
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
        dispose();
        a.dispatch('test');
        setTimeout(() => {
            const state = a.getState();
            assert.equal(state.a, '2');
            assert.equal(state.b, '1');
        }, 1800);
        setTimeout(done, 1900);
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

    it ('should call @onUpdate methods on multiple actions', (done) => {
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
            async test2 () {
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
            onUpdate2(state) {
                assert.equal(state.a, '3');
                assert.equal(state.b, '2');
                done();
            }
            @a.onUpdate('test')
            onUpdate(state) {
                assert.equal(state.a, '2');
                assert.equal(state.b, '1');
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

    it ('should call @onUpdate methods with right params', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: '1',
                    b: '2',
                });
            }

            @Reducer('test')
            async test(a, b) {
                await Sleep(1);
                return {
                    a: a,
                    b: b,
                }
            }
        }
        const a = new A();

        class B {
            @a.onUpdate()
            onUpdate(state, action, a, b) {
                assert.equal(state.a, '3');
                assert.equal(state.b, '4');
                assert.equal(action, 'test');
                assert.equal(a, '3');
                assert.equal(b, '4');
                done();
            }
        }
        const b = new B();
        b.componentDidMount();
        a.dispatch('test', '3', '4');
        const state = a.getState();
        assert.equal(state.a, '1');
        assert.equal(state.b, '2');
    });

    it ('should take params', (done) => {
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
        setTimeout(() => {
            const state = a.getState();
            assert.equal(state.a, '2');
            assert.equal(state.b, '1');
            done();
        }, 100);
    });

    it('should handle middlwares properly', (done) => {
        async function levelIn(next, state, action, counter) {
            assert.equal(state.counter, 4);
            assert.equal(action, 'test')
            assert.equal(counter, 1);
            const afterState = await next({counter: 5});
            assert.equal(afterState.counter, 1);
            return {
                counter: 2,
            }
        }
        async function levelOut(next, state, action, counter) {
            assert.equal(state.counter, 0);
            assert.equal(action, 'test')
            assert.equal(counter, 1);
            const afterState = await next({counter: 4});
            assert.equal(afterState.counter, 2);
            return {
                counter: 3,
            }
        }
        @Inject(levelOut, levelIn)
        class A extends Store {
            constructor() {
                super({
                    counter: 0,
                });
            }
            @Reducer('test')
            test(counter) {
                assert.equal(this.getState().counter, 5);
                return {
                    counter,
                };
            }
        }
        const a = new A();
        a.dispatch('test', 1);
        setTimeout(() => {
            const state = a.getState();
            assert.equal(state.counter, 3);
            done();
        }, 100);
    });

    it ('should connect react class', (done) => {
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

        @a.connect(state => ({
          A: state.a,
          B: state.b
        }))
        class B {
            setState(state) {
                assert.equal(state.A, '2');
                assert.equal(state.B, '1');
                done();
            }
        }
        const b = new B();
        b.componentDidMount();
        a.dispatch('test');
    });

    it ('should connect react class 2', (done) => {
        class A extends Store {
            constructor() {
                super({
                    TEST: {
                        a: '1',
                        b: '2',
                      },
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    TEST: {
                        a: '2',
                        b: '1',
                    },
                };
            }
        }
        const a = new A();

        @a.connect('test', store => store.TEST)
        class B {
            setState(state) {
                assert.equal(state.test.a, '2');
                assert.equal(state.test.b, '1');
                done();
            }
        }
        const b = new B();
        assert.equal(b.state.test.a, '1');
        assert.equal(b.state.test.b, '2');
        b.componentDidMount();
        a.dispatch('test');
    });

    it ('should connect react class 3', (done) => {
        class A extends Store {
            constructor() {
                super({
                    TEST: {
                        a: '1',
                        b: '2',
                    },
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    TEST: {
                        a: '2',
                        b: '1',
                    },
                }
            }
        }
        const a = new A();

        @a.connect(state => ({
          A: state.a,
          B: state.b
        }), store => store.TEST)
        class B {
            setState(state) {
                assert.equal(this.state.A, '1');
                assert.equal(this.state.B, '2');
                assert.equal(state.A, '2');
                assert.equal(state.B, '1');
                done();
            }
        }
        const b = new B();
        assert.equal(b.state.A, '1');
        assert.equal(b.state.B, '2');
        b.componentDidMount();
        a.dispatch('test');
    });


    it ('should connect react state ', (done) => {
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

        @a.connect('test')
        class B {
            state = {
                test: {
                    a: 0,
                    b: 1,
                },
            }
            setState(state) {
                assert.equal(state.test.a, '2');
                assert.equal(state.test.b, '1');
                done();
            }
        }
        const b = new B();
        assert.equal(b.state.test.a, '1');
        assert.equal(b.state.test.b, '2');
        b.componentDidMount();
        a.dispatch('test');
    });

    it ('should connect to multiple react state ', (done) => {
        class A extends Store {
            constructor() {
                super({
                    a: 1,
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(1);
                return {
                    a: 2,
                }
            }
        }
        const a = new A();

        class B extends Store {
            constructor() {
                super({
                    b: 1,
                });
            }

            @Reducer('test')
            async test() {
                await Sleep(500);
                return {
                    b: 2,
                }
            }
        }
        const b = new B();

        @a.connect('testA')
        @b.connect('testB')
        class C {
            constructor() {
              this.state = {
                testA: {
                  a: 1,
                },
                testB: {
                  b: 1,
                },
              }
            }
            setState(state) {
                if (this.state.testA.a === 1) {
                    assert.equal(state.testA.a, 2);
                    assert.equal(state.testA.b, undefined);
                    this.state.testA = state.testA;
                } else {
                    assert.equal(state.testB.b, 2);
                    assert.equal(state.testB.a, undefined);
                    this.state.testB = state.testB;
                }
            }
        }
        const c = new C();
        c.componentDidMount();
        a.dispatch('test');
        b.dispatch('test');
        setTimeout(() => {
            assert.equal(c.state.testA.a, 2);
            assert.equal(c.state.testB.b, 2);
            done();
        }, 1000)
    });

    it ('should connect to default state ', (done) => {
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
                };
            }
        }
        const a = new A();

        @a.connect()
        class B {
            setState(state) {
                assert.equal(state.a, '2');
                assert.equal(state.b, '1');
                done();
            }
        }
        const b = new B();
        b.componentDidMount();
        a.dispatch('test');
    });

    it ('should connect specified react state', (done) => {
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

        @a.connect('test', 'a')
        class B {
            setState(state) {
                assert.equal(state.test, '2');
                done();
            }
        }
        const b = new B();
        b.componentDidMount();
        a.dispatch('test');
    });
});
