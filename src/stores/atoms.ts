import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const countAtom = atom<number>(0);
export const infiniteCountAtom = atomWithStorage('infiniteCount', 0);
