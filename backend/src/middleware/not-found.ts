type Validatable = any[] | object | null | undefined | string | number | boolean;

function notFound<T extends Validatable>(
  value: T,
  name: string
): asserts value is Exclude<T, null | undefined> {
  switch (typeof value) {
    case "undefined":
      throw new Error(`${name} not found`);

    case "object":
      if (
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        Object.keys(value).length === 0
      ) {
        throw new Error(`${name} not found`);
      }
      break;

    case "string":
      if (value.trim().length === 0) {
        throw new Error(`${name} not found`);
      }
      break;

    case "number":
      if (value === 0) {
        throw new Error(`${name} not found`);
      }
      break;

    case "boolean":
      if (value === false) {
        throw new Error(`${name} invalid`);
      }
      break;

    default:
      break;
  }
}

export default notFound;
