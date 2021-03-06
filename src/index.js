import _ from 'lodash';
export { Reducer, Inject };

const UPDATER = Symbol();
const DISPOSER = Symbol();

const STATE = Symbol();
const LISTENERS = Symbol();
const REDUCERS = Symbol();
const DEFAULT_STATE = Symbol();
const MIDDLEWARES = Symbol();

const GET_STATE = Symbol();
const GET_SOURCE = Symbol();


const NOTIFY = Symbol();

const getSource = (source, arg) => {
  if (typeof(arg) === 'string') {
    return source[arg];
  } else if (typeof(arg) === 'function') {
    return arg(source);
  }
  return source;
}

const getState = (state, stateArg, sourceArg) => {
  const source = getSource(state, sourceArg);
  let s = {};
  if (typeof(stateArg) === 'string') {
    s[stateArg] = source;
  } else if (typeof(stateArg) === 'function') {
    s = stateArg(source);
  } else {
    s = state;
  }
  return s;
}


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
        this[LISTENERS].push(listener);
        return () => {
            const index = this[LISTENERS].indexOf(listener);
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
		setImmediate(() => {
			run(dispatch)
				.then(state => {
					self[STATE] = state;
					self[NOTIFY](action, ...params);
				})
				.catch(e => {
					console.log(e.stack || e);
				})
		});
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
                    this[DISPOSER] = [];
                    for (const item of this[UPDATER]) {
                        this[DISPOSER].push(item.store.subscribe(((method, actions) =>
                            (state, action, ...params) => {
                                if (actions.length === 0) {
                                    this[method](state, action, ...params);
                                } else {
                                    if (actions.indexOf(action) !== -1) {
                                        this[method](state, action, ...params);
                                    }
                                }
                            }
                        )(item.method, item.actions)));
                    }
                    if (componentDidMount) {
                        componentDidMount.call(this);
                    }
                }

                prototype.componentWillUnmount = function() {
                    for (const disposer of this[DISPOSER]) {
                        disposer();
                    }
                    if (componentWillUnmount) {
                        componentWillUnmount.call(this);
                    }
                }
            }

            prototype[UPDATER].push({
                method: key,
                actions,
                store: self,
            });
        };
    }

    connect(schema, source) {
        const self = this;
        return (obj) =>  {
            const METHOD = Symbol();
            self.onUpdate()(obj.prototype, METHOD);
            return class extends obj {
                constructor(props) {
                    super(props);
                    this.state = this.state || {};
                    this.state = _.extend(this.state, getState(self.getState(), schema, source));
                }
                [METHOD](state) {
                    this.setState(getState(state, schema, source));
                }
            }
        };
    }

    inject(...middlwares) {
        this[MIDDLEWARES].push(...middlwares);
    }
}

function Reducer(action) {
    return (prototype, key) => {
        prototype[REDUCERS] = prototype[REDUCERS] || {};
        prototype[REDUCERS][action] = key;
    };
}
function Inject(...middlewares) {
    return (obj) => {
        obj.prototype[MIDDLEWARES] = obj.prototype[MIDDLEWARES] || [];
        obj.prototype[MIDDLEWARES].push(...middlewares);
    };
}
