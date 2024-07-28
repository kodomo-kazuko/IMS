export default function toNewArray(
  arr: string[]
): { value: string; label: string }[] {
  return arr.map((item) => ({ value: item, label: item }));
}
