import { useRef } from "react";
import { DEFAULT_DEBOUNCED_TIME } from "../consts";

export interface IDebounceOutput<_Args extends unknown[]> {
	call: (...args: _Args) => void;
}
export const useDebounced = <_Args extends unknown[]>(
	cb: (...args: _Args) => void,
	time: number = DEFAULT_DEBOUNCED_TIME,
): IDebounceOutput<_Args> => {
	const to: React.RefObject<number> = useRef<number>(-1);

	const call = (...args: _Args) => {
		if (to.current != -1) {
			clearTimeout(to.current);
			to.current = -1;
		}

		to.current = setTimeout(() => {
			to.current = -1;
			cb(...args);
		}, time);
	};

	return {
		call,
	};
};
