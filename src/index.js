export { Reducer, Inject };

const UPDATER = Symbol();
const DISPOSER = Symbol();

const STATE = Symbol();
const LISTENERS = Symbol();
const REDUCERS = Symbol();
const DEFAULT_STATE = Symbol();
const MIDDLEWARES = Symbol();


const NOTIFY = Symbol();

export default class Store {
    constructor(defaultState) {
        this[DEFAULT_STATE] = defaultState;
        this[STATE] = defaultState;
        this[LISTENERS] = [];
        this[MIDDLEWARES] = this[MIDDLEWARES] || [];
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
        const self = this;
        async function dispatch(_state) {
            const reducer = self[self[REDUCERS][action]];
            if (reducer) {
                if (_state) {
                    self[STATE] = _state;
                }
                const state = reducer.call(self, ...params);
                if (state instanceof Promise) {
                    return await state;
                } else {
                    return state;
                }
            }
        };
        const middlewares = this[MIDDLEWARES];
        async function run(next) {
            let i = middlewares.length;
            while (i--) {
                next = ((middleware, next) => async (_state) => {
                        const state = _state || self.getState();
                        return await middleware(
                            next,
                            state,
                            action,
                            ...params
                        );
                    })(middlewares[i], next);
            }
            return await next();
        }
        run(dispatch)
            .then(state => {
                self[STATE] = state;
                self[NOTIFY](action, params);
            })
            .catch(e => {
                console.log(e.stack || e);
            })
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
                            if (item.actions.length === 0) {
                                this[item.method](state, action);
                            } else {
                                if (item.actions.indexOf(action) !== -1) {
                                    this[item.method](state, action);
                                }
                            }
                        }
                    })  ;
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

    connect(schema, source) {
        const self = this;
        return (obj) =>  {
            const METHOD = Symbol();
            obj.prototype[METHOD] = function(state) {
                let s = {};
                if (typeof(schema) === 'string' &&
                          typeof(source) === 'string') {
                    s[schema] = state[source];
                } else if (typeof(schema) === 'string') {
                    s[schema] = state;
                } else if (schema) {
                    for (const key in schema) {
                        const match = schema[key];
                        if (typeof(match) === 'function') {
                            s[key] = schema[key](state);
                        } else {
                            s[key] = state[schema[key]];
                        }
                    }
                } else {
                    s = state;
                }
                this.setState(s);
            }
            self.onUpdate()(obj.prototype, METHOD);
        }
    }

    inject(...middlwares) {
        this[MIDDLEWARES].push(...middlwares);
    }
}

function Reducer(action) {
    return (prototype, key) => {
        prototype[REDUCERS] = prototype[REDUCERS] || {};
        prototype[REDUCERS][action] = key;
    }
}
function Inject(...middlewares) {
    return (obj) => {
        obj.prototype[MIDDLEWARES] = obj.prototype[MIDDLEWARES] || [];
        obj.prototype[MIDDLEWARES].push(...middlewares);
    }
}
