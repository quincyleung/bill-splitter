/**
 * How many things, in order, fit in a number of rows of a wrapping line (flex-wrap):
 * given their widths, the line's width and the gap between them. Something wider than
 * the line takes a row of its own.
 */
export function itemsThatFit(widths: number[], lineWidth: number, gap: number, rows: number): number {
  let row = 1;
  let used = 0;
  for (let i = 0; i < widths.length; i++) {
    const width = Math.min(widths[i], lineWidth);
    const next = used === 0 ? width : used + gap + width;
    if (next <= lineWidth) {
      used = next;
      continue;
    }
    row++;
    if (row > rows) return i;
    used = width;
  }
  return widths.length;
}
