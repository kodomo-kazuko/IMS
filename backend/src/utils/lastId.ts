export default function getLastId<T>(arr: T[]) {
	if (arr.length === 0) {
		return undefined;
	}

	const lastObject = arr[arr.length - 1];
	if (!lastObject) {
		throw new Error();
	}
	if (typeof lastObject === "object" && "id" in lastObject) {
		return lastObject.id as number;
	}
	return undefined;
}
