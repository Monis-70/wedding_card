// Scene 0: the gold monogram draws itself (pure CSS, starts before JS), then melts away as the flowers part.
import { $ } from '../lib/dom.js';
import { E, finished, play, wait } from '../lib/anim.js';

const capped = (p, ms) => Promise.race([p, wait(ms)]);

export async function loadAssets({ music, quick, reduced }) {
  const bar = $('#loader .loader-line span');
  const fonts = document.fonts
    ? Promise.all([
        document.fonts.load('400 40px "Great Vibes"'),
        document.fonts.load('400 40px "Allura"', 'A'),
        document.fonts.load('500 20px "Cormorant Garamond"'),
        document.fonts.load('italic 500 20px "Cormorant Garamond"'),
        document.fonts.load('500 20px "Cinzel"'),
        document.fonts.load('400 40px "Amiri"', '\uFDFD'),
      ]).catch(() => {})
    : Promise.resolve();
  const tasks = [capped(fonts, 4000), capped(music.preload(), 4000)];
  let done = 0;
  const step = () => {
    done++;
    if (bar) bar.style.transform = `scaleX(${(0.15 + (0.85 * done) / tasks.length).toFixed(3)})`;
  };
  tasks.forEach((t) => t.then(step));
  await Promise.all([...tasks, wait(quick || reduced ? 700 : 2900)]);
  if (bar) bar.style.transform = 'scaleX(1)';
  await wait(300);
}

// The loader's backdrop fades away (the flower scene behind it has the same colour); the logo stays put.
export async function revealStage({ reduced }) {
  const loader = $('#loader');
  if (!loader) return;
  play($('.loader-line', loader), [{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: E.out });
  await finished(play($('.loader-bg', loader), [{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 300 : 700, easing: E.inOutSoft }));
}

// The logo melts away while the flowers part and the ribbon-tied invitation appears behind it.
export async function fadeLogo({ reduced }) {
  const loader = $('#loader');
  if (!loader) return;
  const fade = reduced
    ? play(loader, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 })
    : play($('.loader-mono', loader), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(1.1)' }], { duration: 900, easing: E.inOutSoft });
  await finished(fade);
  loader.remove();
}
