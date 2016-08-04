[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]


#Intro
This is a ES6-Class Flux Store.


#Example
> [transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy), [transform-async-to-generator](https://github.com/babel/babel/tree/master/packages/babel-helper-remap-async-to-generator) and [babel-polyfill](https://github.com/babel/babel/tree/master/packages/babel-polyfill) are required to run following example.


```
import Store, {
    Reducer
} from 'classux';
class TestStore extends Store {
    constructor() {
        //init with default state.
        super({
            message: '',
        });
    }

    @Reducer('say')
    async sayMessage(params) { // both async and sync methods are supported.
        await new Promise(resolve => setTimeout(resolve, 1000));
        let state = this.getState();
        state.message = params;
        return state;
    }
}

const store = new TestStore();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: store.getState().message,
            input: '',
            action: '',
        };
    }

    @store.onUpdate()
    testStoreUpdated(state, action) {
        this.setState({
            message: state.message,
            action: action,
        })
    }

    render() {
        return <div>
            <h1>{this.state.message}</h1>
            <input
                value={this.state.value}
                onChange={e => this.setState({
                    input: e.target.value,
                })}/>
            <button
                onClick={e => store.dispatch('say', this.state.input)}>
                Say
            </button>
        </div>;
    }
}
```


#API
##Store

###constructor(defaultState)

###subscribe(listener: Function(state, action)): Function
> this returns a disposer function

###dispatch(action, params)
> this dispatches an Action.

###getState()
> get current state

###onUpdate(...actions)
> if no actions are specified, then all actions are listened.

> this is a decorator, it decorates a method and class, so it automatically subscribe and dispose regarding React's component lifecycle.

```
class A {
	@storeInstance.onUpdate()
	method() {
	}
}

//or

class A {
	method() {
	}
}
storeInstance.onUpdate()(A, 'method');
```

##Reducer
> This binds action reducer.

#TODO


#Contributions are welcome
Issues and pull-requests are welcomed.

#License

The MIT License (MIT) Copyright (c) <2016>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[npm-image]: https://img.shields.io/npm/v/classux.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/classux
[travis-image]: https://img.shields.io/travis/joesonw/classux/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/joesonw/classux
[coveralls-image]: https://img.shields.io/coveralls/joesonw/classux/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/joesonw/classux?branch=master
