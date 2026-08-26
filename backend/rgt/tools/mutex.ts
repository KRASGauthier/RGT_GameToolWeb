import { DEFAULT_WATCHDOG_FAILURE_TIME } from "../backendConsts.js";
import { uError } from "../util/ULog.js";

//--------------------------------------------------
//                      CLASSS / TYPES
//-------------------------------------------------
export interface IMutexOptions {
	timeoutMS?: number;
}

export type TReleaseMutex = () => void;
type TLockMutex = {
	promise: Promise<TReleaseMutex>;
	resolve: (release: TReleaseMutex) => void;
	reject: (reason: unknown) => void;
	to?: ReturnType<typeof setTimeout>;
	options: IMutexOptions;
};

export class TMutex {
	constructor() {}

	//Methods
	addLock = async (options: IMutexOptions): Promise<TReleaseMutex> => {
		let nResolve!: (release: TReleaseMutex) => void;
		let nReject!: (reason: unknown) => void;
		const nPromise = new Promise<TReleaseMutex>((resolve, reject) => {
			nResolve = resolve;
			nReject = reject;
		});
		const nLock: TLockMutex = {
			promise: nPromise,
			resolve: nResolve,
			reject: nReject,
			options,
		};
		this.locks.push(nLock);
		this.next();
		return nLock.promise;
	};
	private next = () => {
		if (this.locks.length == 0) return;

		if (this.current == null) {
			const localLock = this.locks[0];
			this.current = localLock;
			localLock.to = setTimeout(() => {
				uError("Mutex failed to release");
				process.exit(1);
			}, localLock.options.timeoutMS ?? DEFAULT_WATCHDOG_FAILURE_TIME);
			localLock.resolve(() => {
				if (localLock.to) clearTimeout(localLock.to);
				const pos = this.locks.findIndex((lock: TLockMutex) => lock == localLock);
				if (pos > -1) this.locks.splice(pos, 1);
				if (this.current == localLock) this.current = null;
				this.next();
			});
		}
	};

	//Properties
	private current: TLockMutex | null = null;
	private locks: TLockMutex[] = [];
}

//--------------------------------------------------
//                     GLOBALS
//--------------------------------------------------
const mutex = new Map<string, TMutex>();

//--------------------------------------------------
//                     FUNCTIONS
//--------------------------------------------------
function mutexGetClass(id: string): TMutex {
	let current: TMutex | undefined = mutex.get(id);
	if (!current) {
		current = new TMutex();
		mutex.set(id, current);
	}
	return current;
}
export async function mutexLock(id: string, options?: IMutexOptions): Promise<TReleaseMutex> {
	return mutexGetClass(id).addLock(options ?? {});
}
