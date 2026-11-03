import { CENTERED_PERIMETER } from './optimize-layout';
import { bbox, pointInPoly } from '../src/geometry/poly';

const b = bbox(CENTERED_PERIMETER);
console.log('BBox:', b);

// Print 60x30 ASCII map of the park
const W = 70, H = 35;
let map = '';
for (let y = 0; y < H; y++) {
  const z = b.minZ + (y / (H - 1)) * (b.maxZ - b.minZ);
  let line = '';
  for (let x = 0; x < W; x++) {
    const px = b.minX + (x / (W - 1)) * (b.maxX - b.minX);
    if (pointInPoly([px, z], CENTERED_PERIMETER)) {
      line += '█';
    } else {
      line += '·';
    }
  }
  map += line + '\n';
}
console.log(map);
