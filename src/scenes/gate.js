// Scene 2: the gatefold invitation tied with a chiffon ribbon. The guest's tap opens the knot, the ribbon slides
// away to both sides (slow drift, then fast), and the doors swing open.
import { gateMarkup } from '../lib/gate-art.js';
import { $, $$, esc } from '../lib/dom.js';
import { E, finished, play, vibrate, wait } from '../lib/anim.js';
import { sparkBurst } from '../lib/fx.js';

const DRIFT = 'cubic-bezier(.35,0,.65,1)';
const SPEED_UP = 'cubic-bezier(.5,0,.86,.32)';

export function createGate(root, { reduced, petals, hint }) {
  root.innerHTML = `
    <div class="gate-zoom">
      <div class="gate">
        <div class="gate-liner"></div>
        <div class="gate-doors"></div>
        <div class="gate-ribbon"></div>
        <p class="gate-hint" aria-hidden="true">${esc(hint)}</p>
        <div class="gate-glow"></div>
      </div>
    </div>
    <button class="gate-tap" type="button" aria-label="Open the invitation" hidden></button>`;
  const zoom = $('.gate-zoom', root);
  const gate = $('.gate', root);
  const hintEl = $('.gate-hint', root);
  let geo;

  function build() {
    const W = gate.offsetWidth;
    const H = gate.offsetHeight;
    geo = gateMarkup(W, H);
    $('.gate-doors', root).innerHTML = geo.doors;
    $('.gate-ribbon', root).innerHTML = geo.ribbon;
    hintEl.style.top = `${geo.cy - W * 0.125}px`;
  }
  build();
  let opening = false;
  const onResize = () => !opening && build();
  window.addEventListener('resize', onResize);
  if (!reduced) zoom.style.transform = 'scale(1.06)';
  const ribbonY = () => (geo.cy / gate.offsetHeight) * 100;

  return {
    // settle into place while the flowers part
    reveal(dur) {
      if (!reduced) play(zoom, [{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: dur + 600, easing: E.out });
    },

    // Anywhere on the screen opens it; onTap runs inside the tap itself, so phones allow the song to start.
    waitForTap(onTap) {
      const btn = $('.gate-tap', root);
      root.removeAttribute('aria-hidden');
      btn.hidden = false;
      const show = setTimeout(() => hintEl.classList.add('is-on'), 350);
      return new Promise((resolve) => {
        btn.addEventListener(
          'click',
          () => {
            onTap();
            clearTimeout(show);
            btn.remove();
            root.setAttribute('aria-hidden', 'true');
            hintEl.classList.remove('is-on');
            resolve();
          },
          { once: true },
        );
      });
    },

    async open(onReveal) {
      opening = true;
      window.removeEventListener('resize', onResize);
      const part = (c) => $(`.${c}`, root);
      if (reduced) {
        onReveal();
        await finished(play(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 700 }));
        return;
      }

      // 1. the ribbon: the knot opens, tails slip down, both halves slide away - a slow drift, then fast
      vibrate(30);
      sparkBurst(gate, 50, ribbonY(), { count: 14, reach: [0.1, 0.28], size: [8, 14] });
      const rd = 2500;
      play(
        part('rb-knot'),
        [
          { transform: 'none', opacity: 1, easing: DRIFT },
          { transform: 'scale(.9) rotate(-4deg)', opacity: 1, offset: 0.45, easing: SPEED_UP },
          { transform: 'scale(.5) rotate(-10deg)', opacity: 0 },
        ],
        { duration: rd * 0.7 },
      );
      [
        ['rb-tail-l', -1],
        ['rb-tail-r', 1],
      ].forEach(([name, dir]) =>
        play(
          part(name),
          [
            { transform: 'none', opacity: 1, easing: DRIFT },
            { transform: `translate(${dir * 2}%, 5%) rotate(${dir * -3}deg)`, opacity: 1, offset: 0.4, easing: SPEED_UP },
            { transform: `translate(${dir * 17}%, 72%) rotate(${dir * -12}deg)`, opacity: 0 },
          ],
          { duration: rd * 0.85 },
        ),
      );
      const bands = [
        [part('rb-band-l'), -1],
        [part('rb-band-r'), 1],
      ].map(([band, dir]) => {
        play(
          $('.gate-part-inner', band),
          [
            { transform: 'skewY(0deg) scaleY(1)' },
            { transform: `skewY(${dir * 1.4}deg) scaleY(1.12)`, offset: 0.4 },
            { transform: `skewY(${dir * -2.4}deg) scaleY(.88)`, offset: 0.68 },
            { transform: `skewY(${dir * 1.6}deg) scaleY(1.08)`, offset: 0.86 },
            { transform: 'skewY(0deg) scaleY(1)' },
          ],
          { duration: rd, easing: 'ease-in-out' },
        );
        return play(
          band,
          [
            { transform: 'translateX(0) rotate(0deg)', easing: DRIFT },
            { transform: `translateX(${dir * 7}%) rotate(${dir * 1}deg)`, offset: 0.38, easing: SPEED_UP },
            { transform: `translateX(${dir * 130}%) rotate(${dir * 5}deg)` },
          ],
          { duration: rd },
        );
      });
      setTimeout(() => {
        sparkBurst(gate, 30, ribbonY(), { count: 8, reach: [0.05, 0.16], size: [7, 12] });
        sparkBurst(gate, 70, ribbonY(), { count: 8, reach: [0.05, 0.16], size: [7, 12] });
      }, rd * 0.55);
      await wait(rd * 0.7);

      // 2. the envelope opens: a small unlatch, a slow creep, then both doors swing out fast
      const dd = 2100;
      $$('.door', root).forEach((door, k) => {
        const dir = k === 0 ? -1 : 1;
        play(
          door,
          [
            { transform: 'rotateY(0deg)', easing: 'cubic-bezier(.2,.8,.3,1)' },
            { transform: `rotateY(${dir * 8}deg)`, offset: 0.14, easing: 'linear' },
            { transform: `rotateY(${dir * 14}deg)`, offset: 0.34, easing: SPEED_UP },
            { transform: `rotateY(${dir * 108}deg)` },
          ],
          { duration: dd },
        );
        play(door, [{ opacity: 1 }, { opacity: 1, offset: 0.78 }, { opacity: 0 }], { duration: dd });
      });
      play($('.gate-liner', root), [{ opacity: 1 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }], { duration: dd * 0.9, easing: 'linear' });
      play($('.gate-glow', root), [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.15)', offset: 0.45 }, { opacity: 0, transform: 'scale(1.6)' }], {
        duration: dd,
        delay: 250,
        easing: E.outSoft,
      });
      setTimeout(() => {
        onReveal();
        const r = gate.getBoundingClientRect();
        const y = r.top + geo.cy;
        petals?.burst({ x: r.left + r.width / 2, y, angle: 180, spread: 80, count: 24, speed: [320, 620] });
        petals?.burst({ x: r.left + r.width / 2, y, angle: 0, spread: 80, count: 24, speed: [320, 620] });
      }, 850);
      await Promise.all(bands.map(finished));
      await wait(dd - rd * 0.3 + 100);
    },
  };
}
