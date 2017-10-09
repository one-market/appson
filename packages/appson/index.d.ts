declare module '@onemarket/appson/lib/utils/create-store' {
	import { SagaMiddleware } from 'redux-saga';
	import { Middleware, ReducersMapObject } from 'redux';
	import { AppStore } from '@onemarket/appson/lib/appson';
	export const sagaMiddleware: SagaMiddleware<any>;
	export interface CreateStoreFn {
	    (middlewares: Middleware[], defaultReducers: ReducersMapObject): AppStore;
	} const createStore: CreateStoreFn;
	export default createStore;

}
declare module '@onemarket/appson/lib/utils/create-provider' {
	import { ComponentType } from 'react';
	import { AppStore, InternalStore } from '@onemarket/appson/lib/appson'; const createProvider: (storeMap: {
	    [key: string]: AppStore | InternalStore;
	}) => ComponentType<{}>;
	export default createProvider;

}
declare module '@onemarket/appson/lib/utils/object/deep-equal' {
	 const deepEqual: (x: any, y: any) => boolean;
	export default deepEqual;

}
declare module '@onemarket/appson/lib/utils/invariants' {
	import invariant from 'invariant';
	export const isArrayOfString: (name: string, array: string[]) => void;
	export const isString: (name: string, value: string) => void;
	export const isFn: (name: string, value: Function | undefined) => void;
	export const isPlainObject: (name: string, obj: object) => void;
	export const hasAllValuesAsFunction: (name: string, obj: object) => void;
	export default invariant;

}
declare module '@onemarket/appson/lib/state/create-actions' {
	import { ActionMap, HandlerMap } from '@onemarket/appson/lib/state'; const createActions: (types: string[], handlers: HandlerMap<any>) => ActionMap;
	export default createActions;

}
declare module '@onemarket/appson/lib/state/create-reducer' {
	import { Handler, HandlerMap } from '@onemarket/appson/lib/state'; const createReducer: (initialState: any, types: string[], handlers: HandlerMap<any>) => Handler<any>;
	export default createReducer;

}
declare module '@onemarket/appson/lib/state/create-types' {
	import { HandlerMap } from '@onemarket/appson/lib/state'; const createTypes: (stateName: string, handlers: HandlerMap<any>) => string[];
	export default createTypes;

}
declare module '@onemarket/appson/lib/state/create-selectors' {
	import { ComputedMap } from '@onemarket/appson/lib/state'; const createSelectors: (name: string, initial: any, computed: ComputedMap<any> | null) => any;
	export default createSelectors;

}
declare module '@onemarket/appson/lib/utils/object/diff' {
	export const diff: (x0: any, x1: any) => {};
	export const symmetricDiff: (x0: any, x1: any) => {};

}
declare module '@onemarket/appson/lib/stores/states' {
	import { StateMap, Action } from '@onemarket/appson/lib/state';
	import { Store } from 'redux'; const _default: Store<any> & {
	    name: string;
	};
	export default _default;
	export const toggleState: (payload: StateMap) => Action<StateMap>;

}
declare module '@onemarket/appson/lib/state' {
	import { Action as ReduxAction, Dispatch } from 'redux';
	import { SagaIterator } from 'redux-saga';
	export interface Meta<Data = any> {
	    [key: string]: Data;
	}
	export type ActionTypes = string[];
	export interface Action<Payload = any> extends ReduxAction {
	    payload?: Payload;
	    meta?: Meta;
	}
	export interface ActionFn<Payload = any> {
	    <A extends Action>(payload?: Payload, meta?: any): A;
	}
	export interface ActionMap {
	    [actionName: string]: ActionFn;
	}
	export interface Handler<State = any> {
	    <A extends Action>(state: State, action: A): State;
	}
	export interface Reducer<State = any> extends Handler<State> {
	}
	export interface HandlerMap<State = any> {
	    [reducerName: string]: Handler<State>;
	}
	export interface Computed<State = any, Props = any, PropValue = any> {
	    (state: State, props?: Props): PropValue;
	}
	export interface ComputedMap<State = any> {
	    [selectorName: string]: Computed<State>;
	}
	export interface StateParams {
	    name: string;
	    initial?: any;
	    computed?: ComputedMap;
	    handlers?: HandlerMap;
	}
	export interface StateMap {
	    [stateName: string]: State<any>;
	}
	export type Effect = SagaIterator;
	export interface Effects {
	    [effect: string]: Effect;
	}
	export class State<S> {
	    name: string;
	    children: StateMap | null;
	    private _initial;
	    private _actions;
	    private _rootReducer;
	    private _selectors;
	    private _effects;
	    private _parent;
	    constructor({name: stateName, initial, handlers, computed}: StateParams);
	    static find(path: string): State<any>;
	    readonly effects: Effects;
	    getInitial(): any;
	    getRootReducer(): Reducer;
	    getPath(): string[];
	    setParent(state: State<any>): void;
	    addEffects(effects: Effects): void;
	    addChild(child: State<any>): void;
	    mapDispatch(dispatch: Dispatch<any>): ActionMap;
	    mapProps(globalState: any): any;
	    hasChanges(oldState: any, newState: any): boolean;
	    private _updateChildren(child);
	    private _updateInitial(child);
	    private _updateReducerWithChild(child);
	}
	export default State;

}
declare module '@onemarket/appson/lib/stores/effects' {
	import { Effects, Action } from '@onemarket/appson/lib/state';
	import { Store } from 'redux'; const _default: Store<any> & {
	    name: string;
	};
	export default _default;
	export const toggleEffects: (payload: Effects) => Action<Effects>;
	export const setActiveEffects: (payload: object) => Action<object>;

}
declare module '@onemarket/appson/lib/utils/create-app' {
	import { ComponentType } from 'react';
	import { History } from 'history';
	import { WrapperComponent as WC, WrapperProps, AppStore } from '@onemarket/appson/lib/appson';
	export interface RecursiveWrappersFn {
	    (wrappers: WC[], props: WrapperProps): JSX.Element;
	}
	export interface CreateAppFn {
	    (Module: ComponentType, wrappers: WC[], store: AppStore, history: History): JSX.Element;
	} const createApp: CreateAppFn;
	export default createApp;

}
declare module '@onemarket/appson/lib/sagas/channel' {
	import { Channel } from 'redux-saga';
	import { InternalStore } from '@onemarket/appson/lib/appson';
	export type StoresChannelAction = {
	    storeName: string;
	    state: any;
	};
	export type StoresChannel = Channel<StoresChannelAction>;
	export interface EmitterFn {
	    (data: StoresChannelAction): any;
	}
	export interface EmitFn {
	    (store: InternalStore): () => any;
	}
	export interface AppsonChannel {
	    (): StoresChannel;
	} const channel: AppsonChannel;
	export default channel;

}
declare module '@onemarket/appson/lib/sagas/effects' {
	import { SagaIterator } from 'redux-saga';
	export type EffectsSagaParams = {
	    active: object;
	    effects: object;
	};
	export default function effectsSaga({effects, active}: EffectsSagaParams): SagaIterator;

}
declare module '@onemarket/appson/lib/sagas/states' {
	import { AppStore } from '@onemarket/appson/lib/appson';
	import { StateMap } from '@onemarket/appson/lib/state'; const statesSaga: (store: AppStore, states: StateMap) => void;
	export default statesSaga;

}
declare module '@onemarket/appson/lib/sagas/root' {
	import { SagaIterator } from 'redux-saga';
	import { AppStore } from '@onemarket/appson/lib/appson';
	export default function rootSaga(store: AppStore): SagaIterator;

}
declare module '@onemarket/appson/lib/appson' {
	import { ComponentType } from 'react';
	import { ReducersMapObject, Middleware, Store } from 'redux';
	export interface InternalStore extends Store<any> {
	    name: string;
	}
	export interface AppStore extends Store<any> {
	    defaultReducers: ReducersMapObject;
	}
	export type WrapperProps = {
	    children: any;
	    store?: AppStore;
	};
	export type WrapperComponent = React.ComponentType<WrapperProps>;
	export class App {
	    private wrappers;
	    private RootModule;
	    private history;
	    private middlewares;
	    private defaultReducers;
	    constructor(Module: ComponentType);
	    addMiddleware(middleware: Middleware): App;
	    addReducer(reducer: ReducersMapObject): App;
	    wrapper(Component: WrapperComponent): App;
	    render(el: string): void;
	} const appson: (Module: ComponentType<{}>) => App;
	export default appson;

}
declare module '@onemarket/appson/lib/components/Routes' {
	import t from 'prop-types';
	import { PureComponent } from 'react';
	import { RouterChildContext } from 'react-router';
	export const mountPath: (basePath: string, path: string) => string;
	export interface RoutesProps {
	    children: any;
	} class Routes extends PureComponent<RoutesProps> {
	    context: RouterChildContext<RoutesProps>;
	    static contextTypes: {
	        router: t.Validator<any>;
	    };
	    render(): JSX.Element | null;
	}
	export default Routes;

}
declare module '@onemarket/appson/lib/components/Link' {
	import t from 'prop-types';
	import { PureComponent } from 'react';
	import { match } from 'react-router';
	export type LocationObject = {
	    pathname?: string;
	    search?: string;
	    state?: any;
	    hash?: string;
	    key?: string;
	};
	export interface LinkActiveFn {
	    (match: match<any>, location: LocationObject): boolean;
	}
	export interface LinkProps {
	    replace?: boolean;
	    relative?: boolean;
	    exact?: boolean;
	    strict?: boolean;
	    activeClassName?: string;
	    className?: string;
	    activeStyle?: object;
	    style?: object;
	    to: string;
	    location?: LocationObject;
	    isActive?: LinkActiveFn;
	    ariaCurrent?: 'page' | 'step' | 'location' | 'true';
	}
	export interface LinkContext {
	    basePath: string;
	} class Link extends PureComponent<LinkProps, {}> {
	    context: LinkContext;
	    static contextTypes: {
	        basePath: t.Requireable<any>;
	    };
	    render(): JSX.Element;
	}
	export default Link;

}
declare module '@onemarket/appson/lib/components/Route' {
	import t from 'prop-types';
	import { PureComponent } from 'react';
	import { RouteComponentProps as RRouteComponentProps, RouteProps as RRouteProps } from 'react-router';
	export interface RouteComponentProps<P> extends RRouteComponentProps<P> {
	}
	export interface RouteProps extends RRouteProps {
	    basePath?: string | null;
	}
	export type RouteContext = {
	    basePath: string;
	}; class Route extends PureComponent<RouteProps, {}> {
	    childContext: RouteContext;
	    static childContextTypes: {
	        basePath: t.Requireable<any>;
	    };
	    getChildContext(): RouteContext;
	    render(): JSX.Element;
	}
	export default Route;

}
declare module '@onemarket/appson/lib/utils/get-display-name' {
	 const getDisplayName: (Component: any) => string;
	export default getDisplayName;

}
declare module '@onemarket/appson/lib/hocs/add-effects' {
	import React from 'react';
	import State, { Effects } from '@onemarket/appson/lib/state';
	export interface AddEffectsFn {
	    <E extends Effects>(effects: E): (resource: React.ComponentType | State<any>) => any;
	} const addEffects: AddEffectsFn;
	export default addEffects;

}
declare module '@onemarket/appson/lib/hocs/add-state' {
	import React from 'react';
	import State from '@onemarket/appson/lib/state';
	export interface AddStateFn<S> {
	    (state: State<S>): (resource: React.ComponentType | State<any>) => any;
	} const addState: AddStateFn<any>;
	export default addState;

}
declare module '@onemarket/appson/lib/hocs/connect-props' {
	import React from 'react';
	import { AppStore } from '@onemarket/appson/lib/appson';
	export type ConnectPropsState = {
	    props: object;
	    args: object;
	};
	export interface MapperFn {
	    (...states: object[]): object;
	}
	export interface ConnectFn<P = any, NP = any> {
	    (states: string[], mapper?: MapperFn): (WrappedComponent: React.ComponentType<P>) => React.ComponentType<P & NP>;
	}
	export type ConnectPropsContext = {
	    store: AppStore;
	}; const connectProps: ConnectFn;
	export default connectProps;

}
declare module '@onemarket/appson/lib/hocs/connect-handlers' {
	import React from 'react';
	export type ConnectHandlerState = {
	    handlers: object;
	    args: object;
	};
	export interface MapperFn {
	    (...states: object[]): object;
	}
	export interface ConnectFn<P = any, NP = any> {
	    (states: string[], mapper?: MapperFn): (WrappedComponent: React.ComponentType<P>) => React.ComponentType<P & NP>;
	} const connectHandlers: ConnectFn;
	export default connectHandlers;

}
declare module '@onemarket/appson' {
	export { default as appson } from '@onemarket/appson/lib/appson';
	export { default as Link } from '@onemarket/appson/lib/components/Link';
	export { default as Route } from '@onemarket/appson/lib/components/Route';
	export { default as Routes } from '@onemarket/appson/lib/components/Routes';
	export { default as State } from '@onemarket/appson/lib/state';
	export { default as addState } from '@onemarket/appson/lib/hocs/add-state';
	export { default as addEffects } from '@onemarket/appson/lib/hocs/add-effects';
	export { default as connectProps } from '@onemarket/appson/lib/hocs/connect-props';
	export { default as connectHandlers } from '@onemarket/appson/lib/hocs/connect-handlers';

}
