export { Reducer };

const UPDATER = Symbol();
const DISPOSER = Symbol();

const STATE = Symbol();
const LISTENERS = Symbol();
const REDUCERS = Symbol();
const DEFAULT_STATE = Symbol();

const NOTIFY = Symbol();

export default class Store {
    constructor(defaultState) {
        this[DEFAULT_STATE] = defaultState;
        this[STATE] = defaultState;
        this[LISTENERS] = [];
        this[REDUCERS] = this[REDUCERS] || {};
        this[NOTIFY] = (action, ...params) => {
            for (const listener of this[LISTENERS]) {
                listener(this[STATE], action, ...params);
            }
        }
    }

    subscribe(listener) {
        const index = this[LISTENERS].push(listener) - 1;
        return () => {
            this[LISTENERS].splice(index, 1);
        };
    }


    dispatch(action, ...params) {
        const reducer = this[this[REDUCERS][action]];
        if (reducer) {
            const state = reducer.call(this, ...params);
            if (state instanceof Promise) {
                state
                    .then(state => {
                        this[STATE] = state;
                        this[NOTIFY](action, ...params);
                    })
                    .catch(e => {
                        if (e) {
                            console.error(e.stack || e);
                        }
                    });
            } else {
                this[STATE] = state;
                this[NOTIFY](action, ...params);
            }
        }
    }

    getState() {
        return this[STATE];
    }

    onUpdate(...actions) {
        const self = this;
        return (prototype, key) => {
            if (!Array.isArray(prototype[UPDATER])) {
                prototype[UPDATER] = [];
                const componentDidMount = prototype.componentDidMount;
                const componentWillUnmount = prototype.componentWillUnmount;

                prototype.componentDidMount = function() {
                    this[DISPOSER] = self.subscribe((state, action) => {
                        for (const item of this[UPDATER]) {
                            if (actions.length === 0) {
                                this[key](state, action);
                            } else {
                                if (actions.indexOf(action) !== -1) {
                                    this[key](state, action);
                                }
                            }
                        }
                    });
                    if (componentDidMount) {
                        componentDidMount.call(this);
                    }
                }

                prototype.componentWillUnmount = function() {
                    this[DISPOSER]();
                    if (componentWillUnmount) {
                        componentWillUnmount.call(this);
                    }
                }
            }

            prototype[UPDATER].push({
                method: key,
                actions,
            });
        }
    }
}

function Reducer(action) {
    return (prototype, key) => {
        prototype[REDUCERS] = prototype[REDUCERS] || {};
        prototype[REDUCERS][action] = key;
    }
}
