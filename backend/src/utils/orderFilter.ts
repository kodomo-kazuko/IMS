export function OrderFilter(args: any) {
  return args.orderBy ? args : { ...args, orderBy: { createdAt: "desc" } };
}
