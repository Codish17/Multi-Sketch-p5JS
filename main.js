let currentSketch = null;

const sketchMap = {
  sketch1: () => import('./sketches/sketch1.js'),
  sketch2: () => import('./sketches/sketch2.js'),
  sketch3: () => import('./sketches/sketch3.js'),
  sketch4: () => import('./sketches/sketch4.js') // snowflake sketch
};

async function loadSketch(name) {
  if (!sketchMap[name]) {
    console.error(`Sketch "${name}" not found in sketchMap`);
    return;
  }

  try {
    if (currentSketch) {
      currentSketch.remove();
      currentSketch = null;
    }

    const module = await sketchMap[name]();
    if (!module.default) throw new Error(`Sketch "${name}" has no default export`);

    currentSketch = new p5(
      module.default,
      document.getElementById('sketch-container')
    );

  } catch (err) {
    console.error(`Failed to load ${name}:`, err);
  }
}

window.loadSketch = loadSketch;

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.sketch-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      loadSketch(btn.dataset.sketch);
    });
  });

  // auto-load from active button
  const activeBtn = document.querySelector('.sketch-btn.active');
  if (activeBtn) loadSketch(activeBtn.dataset.sketch);
});
