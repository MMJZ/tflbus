export function zip<A, B>(a: A[], b: B[]): Array<[A, B]> {
	const ret: Array<[A, B]> = [];
	for (let i = 0; i < Math.min(a.length, b.length); i++) {
		ret.push([a[i], b[i]]);
	}

	return ret;
}

export function zipLax<A, B>(a: A[], b: B[]): Array<[A | undefined, B | undefined]> {
	const ret: Array<[A, B]> = [];
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		ret.push([a[i], b[i]]);
	}

	return ret;
}

export function dovetail<T>(a: T[], b: T[]): T[] {
	const [larger, smaller] = a.length > b.length ? [a, b] : [b, a];

	return zipLax(larger, smaller).reduce<T[]>((acc, [x, y]) => {
		if (x !== undefined) {
			acc.push(x);
		}
		if (y !== undefined) {
			acc.push(y);
		}
		return acc;
	}, []);
}

export function maxBy<T>(ts: T[], comp: (t: T) => number): T | undefined {
	return ts.slice().sort((a, b) => comp(b) - comp(a))[0];
}

// export function distanceIntersperse<T>(
// 	prevA: LatLonLoc | undefined,
// 	prevB: LatLonLoc | undefined,
// 	a: T[],
// 	b: T[],
// 	postA: LatLonLoc | undefined,
// 	postB: LatLonLoc | undefined,
// ): T[] {

// }

// interface LatLonLoc {
// 	lat: number;
// 	lon: number;
// }

// function distance(a: LatLonLoc, b: LatLonLoc): number {
// 	return Math.sqrt(a.lat * b.lat + a.lon * b.lon);
// }
