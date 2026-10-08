const M = require('./engine.js');
const cases = require('./expected.json').cases;
let pass = 0, fail = 0;
function ok(cond, label) { if (cond) pass++; else { fail++; console.log('FAIL:', label); } }
function close(a, b) { return Math.abs(a - b) < 1e-9; }
function eqObj(a, b, label) {
  const ka = Object.keys(a), kb = Object.keys(b);
  ok(ka.length === kb.length, label + ' key count');
  for (const k of ka) {
    const va = a[k], vb = b[k];
    if (typeof va === 'number' && typeof vb === 'number') ok(close(va, vb), label + '.' + k + ' ' + va + ' vs ' + vb);
    else ok(va === vb, label + '.' + k + ' ' + va + ' vs ' + vb);
  }
}
for (const c of cases) {
  const fn = M[c.kind];
  const out = fn(...c.args);
  eqObj(out, c.out, c.kind + '(' + c.args.join(',') + ')');
}
// anchors
const p1 = M.plan(110);
ok(close(p1.wormsPerWeek, 1000), 'anchor 110g -> 1000 worms/week');
const s1 = M.starter(1000);
ok(s1.beetles === 800 && s1.females === 400, 'anchor 1000 starter -> 800 beetles, 400 females');
// plan/starter consistency: starter capacity feeds back through plan
const cap = M.starter(5000).capacityGPerWeek;
ok(M.plan(cap).wormsPerWeek <= M.starter(5000).females * 25 * 0.4 + 1e-6, 'capacity consistency');
// properties: monotonicity
ok(M.plan(200).trays >= M.plan(100).trays, 'monotonic trays');
ok(M.plan(200).beetles >= M.plan(100).beetles, 'monotonic beetles');
ok(M.starter(2000).capacityGPerWeek >= M.starter(1000).capacityGPerWeek, 'monotonic capacity');
ok(M.starter(2000).capacityTrays >= M.starter(1000).capacityTrays, 'monotonic capacity trays');
ok(M.timeline(5000).saveForBreeding >= M.timeline(1000).saveForBreeding, 'monotonic save');
// gap shape
const t = M.timeline(1000);
ok(t.gapEndWeek - t.gapStartWeek === 13 && t.nextGenWeek === 21, 'gap weeks 7-20, next gen 21');
// error cases
function throws(fn, msg) { try { fn(); return false; } catch (e) { return e.message === msg; } }
ok(() => {}, 'noop');
pass--; // discard noop trick
ok(throws(() => M.plan(0), 'target must be positive'), 'plan 0');
ok(throws(() => M.plan(-5), 'target must be positive'), 'plan negative');
ok(throws(() => M.plan(NaN), 'target must be a number'), 'plan NaN');
ok(throws(() => M.starter(0), 'starter count must be positive'), 'starter 0');
ok(throws(() => M.starter(NaN), 'starter count must be a number'), 'starter NaN');
ok(throws(() => M.timeline(0), 'starter count must be positive'), 'timeline 0');
console.log(pass + '/' + (pass + fail) + ' checks pass');
process.exit(fail ? 1 : 0);
