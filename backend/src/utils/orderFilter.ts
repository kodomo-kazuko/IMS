// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function OrderFilter(args: any) {
	return args.orderBy ? args : { ...args, orderBy: { createdAt: "desc" } };
}
