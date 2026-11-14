// food-picture-01 resubmit — a tonkotsu ramen photo for the food judge.
// 45-degree close-up: a tall glossy noodle pull, molten egg yolk dripping
// over the bowl rim, glistening chashu, steam. The program copies the
// image beside it to /output/entry.png.
//
// Local test:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { chmodSync, copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
if (!existsSync(src)) {
  throw new Error(`entry.png not found beside main.ts in ${here}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'entry.png');
copyFileSync(src, out);
// copyFileSync keeps the source file's mode (here 660), and the grader may
// run as another user: force 0644 so the output is always readable.
chmodSync(out, 0o644);

// Guard against a truncated or empty copy: the judge scores the bytes it
// reads, so refuse to hand over an empty file.
if (statSync(out).size === 0) {
  throw new Error('entry.png was copied but is empty');
}
