import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type counterStateType = {
  +counter: number
};

export type Action = {
  +type: string,
  +value: any
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;

export const MEDIA_STATUS = {
  READY: 0,
  FIND_START: 1,
  FIND_DONE: 2,
  HASHING_START: 3,
  HASHING_DONE: 4
}

