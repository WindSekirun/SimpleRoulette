export function byte2Hex(n) {
  const nybHexString = '0123456789ABCDEF';
  return String(nybHexString.substr((n >> 4) & 0x0f, 1)) + nybHexString.substr(n & 0x0f, 1);
}

export function RGB2Color(r, g, b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

export function getColor(item, maxitem) {
  const phase = 0;
  const center = 128;
  const width = 128;
  const frequency = (Math.PI * 2) / maxitem;

  const red = Math.sin(frequency * item + 2 + phase) * width + center;
  const green = Math.sin(frequency * item + 0 + phase) * width + center;
  const blue = Math.sin(frequency * item + 4 + phase) * width + center;

  return RGB2Color(red, green, blue);
}


export function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }
