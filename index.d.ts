declare module 'classux' {
    abstract class Store<State> {
        private state;
        private listeners;
        private reducers;
        private defaultState;
        constructor(defaultState: State);
        subscribe(listener: (state: State, action: string) => void): () => void;
        private notify(action, params?);
        dispatch(action: string, params?: any): void;
        getState(): State;
        onUpdate(): (prototype: any, key: string) => void;
    }
    export default Store;
    export function Reducer<S>(action: string): (prototype: Store<S>, key: string) => void;
}
