export function zip<A, B>(a: A[], b: B[]): [A, B][] {
	const ret: [A, B][] = [];
	for (let i = 0; i < Math.min(a.length, b.length); i++) {
		ret.push([a[i], b[i]]);
	}

	return ret;
}
