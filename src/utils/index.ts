export function generateId(): string {
  const seed = new Uint32Array(4);
  const cryptoObj = window?.crypto || ((window as any).msCrypto as Crypto);
  return cryptoObj.getRandomValues(seed).join('-');
}

export function getTimestamp(): Date {
  return new Date();
}

/**
 * Getting a random integer between two values.
 *  The maximum is inclusive and the minimum is inclusive.
 */
export function getRandomInt(min: number, max: number) {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

/**
 * Converts an object into a flat object.
 */
export function flatten(data: any): any {
  const result = {};
  const recurse = (cur: any, prop: any) => {
    let i;
    let l;

    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (typeof cur === 'function') {
      result[prop] = '';
    } else if (Array.isArray(cur)) {
      for (i = 0, l = cur.length; i < l; i += 1) {
        recurse(cur[i], `${prop}[${i}]`);
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  };

  recurse(data, '');
  return result;
}

/**
 * Vertical alignment with Flex Display.
 */
export function formatItem(_: any, e: any) {
  const style = e.cell.style;
  style.display = 'flex';
  style.alignItems = 'center'; // vertical alignment
  switch (
    getComputedStyle(e.cell).textAlign // horizontal alighment
  ) {
    case 'right':
      style.justifyContent = 'flex-end';
      break;
    case 'center':
      style.justifyContent = 'center';
      break;
    default:
      style.justifyContent = '';
      break;
  }
}
