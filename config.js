/* The Cash Desk: FINAN IV Unit 2 (cash). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-03 (case_reuse.py): Loudhouse Live, Kirsten Sandoval, both clean. Every other business on the desk
   is unnamed ("a comedy club", "the smaller promoter"), so nothing new needed a sweep. All numbers are fictional; no `sources` box.
   Version 4 (2026-11-12), rebuilt to the Unit 9 pattern (process/standards/interactive-assignments.md rules 25 to 39;
   u02/TEACHING-MAP.md; design/scope-2026-11-11.md):
   - The reading teaches; the desk has no walkthrough of its own (rule 32).
   - Every task states the problem first, then shows a worked example drawn as the SAME table the student fills, read-only, with a
     different business and numbers (h.ladder, rule 29). A faded step gives most lines; the next step leaves every line blank.
   - Depreciation (cost ÷ years) is a line inside the cash-from-operations table, not a step of its own.
   - Cut from the desk: the walkthrough, the ticket-sales and sound-system steps (their ideas now sit inside the bridge and the
     quick check), two of the three quick checks.
   The previous version is in v2-archive/. seedVersion 3 and version 4: progress and receipts from v3 do not carry over. */
(function (root) {
  'use strict';
  const QUIZ = [
    { title: 'Quick check: paid in advance',
      q: 'In August a theater sells $50,000 of season passes for shows from October to May. What happens in August?',
      options: ['Cash and revenue both rise by $50,000', 'Revenue rises by $50,000, but cash does not change',
        'Cash rises by $50,000, and so does deferred revenue. Revenue is recorded as the shows happen.', 'Nothing is recorded until the first show'],
      answer: 2,
      why: ['Revenue waits until the theater delivers the shows. The cash has arrived, so deferred revenue records what the theater still owes.',
        'The cash has arrived in August. What waits is the revenue.',
        'Right. Fans paid early, so cash came in before the revenue. That is why a rise in deferred revenue is added on the way to cash from operations.',
        'The cash has arrived, so the theater records it now, with deferred revenue for the shows it still owes.'] },
    { title: 'Exam-style question',
      q: 'A company reports net income of $500,000. Depreciation was $80,000, accounts receivable fell by $30,000, and accounts payable rose by $20,000. What is its cash from operations?',
      options: ['$570,000', '$630,000', '$590,000', '$470,000'],
      answer: 1,
      why: ['$570,000 subtracts the fall in receivables. Customers paid down what they owed, so that cash came in. Add it.',
        'Right. $500,000 + $80,000 + $30,000 + $20,000 = $630,000. Exam questions look like this one.',
        '$590,000 subtracts the rise in payables. The company has not paid those bills yet, so it kept the cash. Add it.',
        '$470,000 subtracts depreciation. Depreciation lowered profit without using cash, so add it back.'] },
  ];

  const STEPS = [
    { id: 'cfo1', label: 'Profit to cash', kind: 'task' },
    { id: 'q1', label: 'Quick check', kind: 'check', quiz: 0 },
    { id: 'cfo2', label: 'A fall and a rise', kind: 'task' },
    { id: 'fcf1', label: 'Free cash flow', kind: 'task' },
    { id: 'fcf2', label: 'Can it pay its loan?', kind: 'task' },
    { id: 'cc1', label: 'Cash conversion', kind: 'task' },
    { id: 'cc2', label: 'Two venues', kind: 'task' },
    { id: 'q2', label: 'Exam-style question', kind: 'check', quiz: 1 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];

  // Answers on the reading (12,000; 240,000; 270,000; 150,000; 1.2), the worked examples and the exam-style check never come up.
  const AVOID = [12000, 240000, 270000, 150000, 125000, 91000, 80000, 70000, 630000];
  const KIND = { ar: 'asset', pp: 'asset', dr: 'liability', ap: 'liability' };
  const NAME = { ar: 'Receivables', pp: 'Prepaid expenses', dr: 'Deferred revenue', ap: 'Payables' };
  const eff = (c) => (KIND[c.key] === 'asset' ? -1 : 1) * c.dir * c.amt;

  function buildTasks(rng, h) {
    const T = [], bad = (x) => AVOID.includes(Math.round(x));
    // cfo1: Loudhouse's year. Receivables and deferred revenue both rose (the midterm's form).
    let c1;
    do {
      const life = h.pick(rng, [4, 5, 6]), dep = h.between(rng, 10000, 30000, 5000);
      c1 = { id: 'cfo1', NI: h.between(rng, 300000, 900000, 100000), cost: dep * life, life, dep,
        ch: [{ key: 'ar', dir: 1, amt: h.between(rng, 20000, 80000, 10000) }, { key: 'dr', dir: 1, amt: h.between(rng, 40000, 200000, 20000) }] };
      c1.answer = c1.NI + c1.dep + c1.ch.reduce((s, c) => s + eff(c), 0);
    } while (bad(c1.answer) || Math.abs(c1.answer / c1.NI - 1.2) < 0.005 || Math.abs(c1.answer / c1.NI - 1.5) < 0.005);
    T.push(c1);
    // cfo2: the smaller promoter. Receivables fell and payables rose (the final's form), and prepaid expenses rose.
    let c2;
    do {
      const life = h.pick(rng, [3, 4, 5]), dep = h.between(rng, 5000, 25000, 5000);
      c2 = { id: 'cfo2', NI: h.between(rng, 200000, 800000, 100000), cost: dep * life, life, dep,
        ch: [{ key: 'ar', dir: -1, amt: h.between(rng, 10000, 60000, 10000) }, { key: 'ap', dir: 1, amt: h.between(rng, 10000, 50000, 5000) },
          { key: 'pp', dir: 1, amt: h.between(rng, 10000, 40000, 5000) }] };
      c2.answer = c2.NI + c2.dep + c2.ch.reduce((s, c) => s + eff(c), 0);
    } while (bad(c2.answer) || c2.dep === 12000 || c2.NI === c1.NI);
    T.push(c2);
    // fcf1: Loudhouse's free cash flow, from its cash from operations in cfo1
    { let capex; do { capex = h.between(rng, 100000, Math.min(300000, Math.floor((c1.answer - 100000) / 50000) * 50000), 50000); } while (bad(c1.answer - capex) || c1.answer - capex === 45000);
      T.push({ id: 'fcf1', NI: c1.NI, CFO: c1.answer, capex, answer: c1.answer - capex }); }
    // fcf2: the smaller promoter's free cash flow against its yearly loan payment, at least 20% away either way
    { let capex; do { capex = h.between(rng, 50000, Math.min(400000, Math.floor((c2.answer - 100000) / 50000) * 50000), 50000); } while (bad(c2.answer - capex) || [120000, 50000].includes(c2.answer - capex));
      const F = c2.answer - capex, yes = rng() < 0.5;
      const L = Math.round(F * (yes ? h.pick(rng, [0.6, 0.7, 0.8]) : h.pick(rng, [1.25, 1.4, 1.6])) / 10000) * 10000;
      T.push({ id: 'fcf2', NI: c2.NI, CFO: c2.answer, capex, loan: L, answer: F, decision: F >= L ? 'yes' : 'no' }); }
    // cc1: Loudhouse's cash conversion, from cfo1
    T.push({ id: 'cc1', NI: c1.NI, CFO: c1.answer, answer: c1.answer / c1.NI });
    // cc2: two venues, same net income, one ratio well above 1 and one well below
    { const NI = h.between(rng, 300000, 800000, 100000), hi = h.pick(rng, [1.3, 1.4, 1.6, 1.8]), lo = h.pick(rng, [0.4, 0.5, 0.6, 0.7]);
      const northHi = rng() < 0.5, rn = northHi ? hi : lo, rs = northHi ? lo : hi;
      T.push({ id: 'cc2', NI, north: Math.round(NI * rn), south: Math.round(NI * rs), rn, rs, answer: rn, decision: northHi ? 'north' : 'south' }); }
    return T;
  }

  const m0 = (x) => root.DeskEngine.h.money(x);
  const r2 = (x) => String(+x.toFixed(2));
  // A ratio typed as 1.25, 125% or 125 all mean 1.25. Every ratio on this desk is below 5.
  const ratioIn = (h, s) => { const v = h.parseMoney(s); if (!isFinite(v)) return v; return (!/%/.test(String(s)) && Math.abs(v) >= 5) ? v / 100 : v; };

  /* Lines for each task. The worked example uses the same function on other numbers, so the two tables always match.
     mode: 'filled' (worked example), 'faded' (most lines given), 'own' (every line blank). full is the explained calculation,
     used by the help ladder whatever the mode. */
  function changeLine(c, mode) {
    const e = eff(c), kind = KIND[c.key] === 'asset' ? 'An asset' : 'A liability', moved = c.dir > 0 ? 'rose' : 'fell';
    const full = `${kind} ${moved}, so ${e > 0 ? 'add' : 'subtract'}`;
    return { key: c.key, label: `${NAME[c.key]} ${moved} ${m0(c.amt)}`, full, value: e, c,
      calc: mode === 'own' ? 'Add or subtract?' : mode === 'faded' && c.key === 'dr' ? `${kind} ${moved}` : full, input: mode === 'own' || (mode === 'faded' && c.key === 'dr') };
  }
  const sumExpr = (NI, dep, ch) => [m0(NI), '+ ' + m0(dep)].concat(ch.map((c) => (eff(c) > 0 ? '+ ' : '− ') + m0(c.amt))).join(' ');
  const LINES = {
    cfo: (x, mode) => {
      const ch = x.ch.map((c) => changeLine(c, mode)), total = x.NI + x.dep + x.ch.reduce((s, c) => s + eff(c), 0), full = sumExpr(x.NI, x.dep, x.ch);
      return [{ label: 'Net income', calc: 'From the income statement', full: 'From the income statement', value: x.NI },
        { label: 'Depreciation', calc: `${m0(x.cost)} ÷ ${x.life} years, added back`, full: `${m0(x.cost)} ÷ ${x.life} years, added back`, value: x.dep, input: mode === 'own', dep: true }]
        .concat(ch, [{ label: 'Cash from operations', total: true, value: total, input: mode !== 'filled', full,
          calc: mode === 'filled' ? full : mode === 'faded' ? `${m0(x.NI)} + ${m0(x.dep)} − ${m0(x.ch[0].amt)} + the deferred revenue line` : 'Net income + depreciation + each change' }]);
    },
    fcf: (x, mode) => [
      { label: 'Cash from operations', calc: 'From the cash flow statement', full: 'From the cash flow statement', value: x.CFO, input: mode === 'own', cfo: true },
      { label: 'Capital spending', calc: x.what || 'From the cash flow statement', full: x.what || 'From the cash flow statement', value: x.capex, input: mode === 'own', capex: true },
      { label: 'Free cash flow', calc: mode === 'own' ? 'Cash from operations − capital spending' : `${m0(x.CFO)} − ${m0(x.capex)}`,
        full: `${m0(x.CFO)} − ${m0(x.capex)}`, value: x.CFO - x.capex, input: mode !== 'filled', fcf: true }],
    cc1: (x, mode) => [
      { label: 'Cash from operations', calc: 'From the cash flow statement', full: 'From the cash flow statement', value: x.CFO },
      { label: 'Net income', calc: 'From the income statement', full: 'From the income statement', value: x.NI },
      { label: 'Cash conversion', calc: `${m0(x.CFO)} ÷ ${m0(x.NI)}`, full: `${m0(x.CFO)} ÷ ${m0(x.NI)}`, value: x.CFO / x.NI, fmt: 'num', input: mode !== 'filled', ratio: true }],
    cc2: (x, mode) => [
      { label: `${x.names[0]} cash conversion`, calc: mode === 'filled' ? `${m0(x.north)} ÷ ${m0(x.NI)}` : 'Cash from operations ÷ net income',
        full: `${m0(x.north)} ÷ ${m0(x.NI)}`, value: x.north / x.NI, fmt: 'num', input: mode !== 'filled', ratio: true, mine: 'north' },
      { label: `${x.names[1]} cash conversion`, calc: mode === 'filled' ? `${m0(x.south)} ÷ ${m0(x.NI)}` : 'Cash from operations ÷ net income',
        full: `${m0(x.south)} ÷ ${m0(x.NI)}`, value: x.south / x.NI, fmt: 'num', input: mode !== 'filled', ratio: true, mine: 'south' }],
  };
  const VENUES = ['North venue', 'South venue'];
  // Built on first use: config.js loads before the engine, so money() is not available at load time.
  const EXAMPLES = () => ({
    cfo1: { cap: 'A comedy club earned $100,000. Its $40,000 sound system lasts 4 years. Receivables rose $5,000 and deferred revenue rose $20,000.',
      lines: LINES.cfo({ NI: 100000, cost: 40000, life: 4, dep: 10000, ch: [{ key: 'ar', dir: 1, amt: 5000 }, { key: 'dr', dir: 1, amt: 20000 }] }, 'filled') },
    cfo2: { cap: 'A theater earned $80,000. Its $30,000 lighting lasts 5 years. Receivables fell $4,000, payables rose $3,000 and prepaid expenses rose $2,000.',
      lines: LINES.cfo({ NI: 80000, cost: 30000, life: 5, dep: 6000, ch: [{ key: 'ar', dir: -1, amt: 4000 }, { key: 'ap', dir: 1, amt: 3000 }, { key: 'pp', dir: 1, amt: 2000 }] }, 'filled') },
    fcf1: { cap: 'The comedy club brought in $125,000 of cash from operations and spent $45,000 on a new stage.', lines: LINES.fcf({ CFO: 125000, capex: 45000 }, 'filled') },
    fcf2: { cap: 'A booking agency earned $90,000, brought in $120,000 of cash from operations and spent $50,000 on equipment. It owes $60,000 a year on a loan.',
      lines: LINES.fcf({ CFO: 120000, capex: 50000 }, 'filled'), after: 'Free cash flow, $70,000, is more than the $60,000 loan payment, so the agency can pay it from its own cash.' },
    cc1: { cap: 'A jazz club earned $100,000 and brought in $150,000 of cash from operations.', lines: LINES.cc1({ CFO: 150000, NI: 100000 }, 'filled') },
    cc2: { cap: 'Two clubs each earned $100,000. Club A brought in $110,000 of cash from operations, and Club B brought in $30,000.',
      lines: LINES.cc2({ NI: 100000, north: 110000, south: 30000, names: ['Club A', 'Club B'] }, 'filled'),
      after: 'Club A’s profit is better backed by cash: each dollar of profit came with $1.10 of cash, against $0.30 at Club B.' },
  });

  function linesFor(t) {
    if (t.id === 'cfo1') return LINES.cfo(t, 'faded');
    if (t.id === 'cfo2') return LINES.cfo(t, 'own');
    if (t.id === 'fcf1') return LINES.fcf(Object.assign({ what: 'The new stage' }, t), 'faded');
    if (t.id === 'fcf2') return LINES.fcf(t, 'own');
    if (t.id === 'cc1') return LINES.cc1(t, 'faded');
    if (t.id === 'cc2') return LINES.cc2(Object.assign({ names: VENUES }, t), 'own');
  }

  const PROBLEM = {
    cfo1: (t) => ({ title: 'From profit to cash', place: 'The owners ask Kirsten how much cash Loudhouse brought in last year.',
      body: `<p>Loudhouse Live earned <b>${m0(t.NI)}</b> of net income. Its <b>${m0(t.cost)}</b> sound system lasts <b>${t.life}</b> years. Sponsors owe <b>${m0(t.ch[0].amt)}</b> more than a year ago, and fans paid <b>${m0(t.ch[1].amt)}</b> for next year’s shows. What was its cash from operations?</p>` }),
    cfo2: (t) => ({ title: 'A fall and a rise', place: 'The owners might buy a smaller promoter, and Kirsten wants to know how much cash it brings in.',
      body: `<p>The smaller promoter earned <b>${m0(t.NI)}</b>. Its <b>${m0(t.cost)}</b> stage lasts <b>${t.life}</b> years. Its receivables fell <b>${m0(t.ch[0].amt)}</b>, its payables rose <b>${m0(t.ch[1].amt)}</b>, and its prepaid expenses rose <b>${m0(t.ch[2].amt)}</b>. What was its cash from operations?</p>` }),
    fcf1: (t) => ({ title: 'Free cash flow', place: 'The owners want to know how much cash Loudhouse could pay out.',
      body: `<p>Loudhouse brought in <b>${m0(t.CFO)}</b> of cash from operations and spent <b>${m0(t.capex)}</b> on a new stage. What is its free cash flow? The first two lines are done for you.</p>` }),
    fcf2: (t) => ({ title: 'Can it pay its loan?', place: 'Back to the smaller promoter the owners might buy.',
      body: `<p>The smaller promoter earned <b>${m0(t.NI)}</b> of net income, brought in <b>${m0(t.CFO)}</b> of cash from operations and spent <b>${m0(t.capex)}</b> on equipment. It owes <b>${m0(t.loan)}</b> a year on a loan. Can it pay from its own cash?</p>`,
      choice: { legend: `Does free cash flow cover the ${m0(t.loan)} loan payment?`, options: [['yes', 'Yes: free cash flow is more than the payment'], ['no', 'No: free cash flow is less than the payment']] } }),
    cc1: (t) => ({ title: 'Cash conversion', place: 'Kirsten wants one number that shows how well Loudhouse’s profit turned into cash.',
      body: `<p>Loudhouse earned <b>${m0(t.NI)}</b> of net income and brought in <b>${m0(t.CFO)}</b> of cash from operations. What is its cash conversion? The first two lines are done for you.</p>` }),
    cc2: (t) => ({ title: 'Two venues, same profit', place: 'Loudhouse runs two venues, and the owners ask which one is doing better.',
      body: `<p>Each venue earned <b>${m0(t.NI)}</b> of net income. The North venue brought in <b>${m0(t.north)}</b> of cash from operations, and the South venue brought in <b>${m0(t.south)}</b>. Whose profit is better backed by cash?</p>`,
      choice: { legend: 'Which venue’s profit is better backed by cash?', options: [['north', 'The North venue'], ['south', 'The South venue']] } }),
  };

  function taskView(t, L, h) {
    const P = PROBLEM[t.id](t), E = EXAMPLES()[t.id], lines = linesFor(t);
    const example = h.ladder(E.lines, { filled: true, caption: E.cap }) + (E.after ? `<p>${E.after}</p>` : '');
    const table = h.ladder(lines, { rows: L.rows, caption: 'Your turn' })
      + (lines.some((l) => l.input && l.ratio) ? '<p class="small">Type the ratio to two decimal places, like 1.25.</p>'
        : lines.some((l) => l.input && l.c) ? '<p class="small">Type an amount that lowers cash with a minus sign, like −5,000.</p>' : '');
    const parts = [{ html: '', field: 'table' }];
    if (P.choice) parts.push({ html: '', field: 'choice' });
    return { title: P.title, place: P.place, body: P.body, example, table, parts, choice: P.choice,
      helpLabels: ['Show me the first blank', 'Show me every line'] };
  }

  const RULE = { 'asset:1': 'An asset that rises takes cash away', 'asset:-1': 'An asset that falls brings cash in',
    'liability:1': 'A liability that rises keeps cash in the business', 'liability:-1': 'A liability that falls uses cash' };
  // Common slips, per line, phrased with the student's own numbers.
  function diagFor(t, line) {
    const D = [];
    if (line.dep) D.push([t.cost, 'cost', `That is the full price. Spread it over the years: ${m0(t.cost)} ÷ ${t.life}.`],
      [t.cost * t.life, 'times', `That multiplies. Divide the price by the years: ${m0(t.cost)} ÷ ${t.life}.`],
      [-t.dep, 'sign', `Depreciation is added back, so type it as a positive amount: ${m0(t.dep)}.`]);
    if (line.c) { const c = line.c, k = KIND[c.key] + ':' + c.dir;
      D.push([-line.value, 'sign', `${NAME[c.key]} ${c.key === 'dr' ? 'is' : 'are'} ${KIND[c.key] === 'asset' ? 'an asset' : 'a liability'}. ${RULE[k]}, so type ${m0(line.value)}.`]); }
    if (line.total) { const all = t.NI + t.dep + t.ch.reduce((s, c) => s + c.amt, 0), noNI = line.value - t.NI;
      D.push([all, 'alladd', `That adds every change. Subtract the ones that take cash away. ${line.full}.`],
        [noNI, 'noni', `Start from net income. ${line.full}.`], [line.value - 2 * t.dep, 'depsub', `Add depreciation back, don’t subtract it. ${line.full}.`]); }
    if (line.cfo) D.push([t.NI, 'ni', `That is net income. Free cash flow starts from cash from operations, ${m0(t.CFO)}.`]);
    if (line.fcf) D.push([t.CFO + t.capex, 'add', 'Subtract capital spending, don’t add it.'],
      [t.NI - t.capex, 'ni', `Start from cash from operations, ${m0(t.CFO)}, not net income.`], [t.CFO, 'nocapex', `Subtract capital spending: ${m0(t.CFO)} − ${m0(t.capex)}.`],
      [t.capex, 'capex', 'That is capital spending itself. Subtract it from cash from operations.']);
    if (line.ratio) { const cfo = line.mine ? t[line.mine] : t.CFO, other = line.mine === 'north' ? t.south : line.mine === 'south' ? t.north : null;
      D.push([t.NI / cfo, 'flip', `That is net income ÷ cash from operations. Put cash from operations on top: ${m0(cfo)} ÷ ${m0(t.NI)}.`]);
      if (other != null) D.push([other / t.NI, 'other', 'That is the other venue’s ratio. Use this venue’s own cash from operations.']); }
    return D;
  }

  const plain = (s) => String(s).replace(/<[^>]+>/g, '');
  function judgeTask(t, e, h) {
    const lines = linesFor(t), rows = e.rows || [], rowRes = [];
    lines.forEach((l, i) => {
      if (!l.input) return;
      const opts = l.ratio ? { tol: 0.006, scale: Math.abs(l.value), unreadable: 'Type the ratio as a number, like 1.25.', closeMsg: 'Close. Keep two decimal places.', otherMsg: `${plain(l.full)}.` }
        : { tol: 2, scale: Math.abs(l.value), unreadable: 'Type a dollar amount, like 25,000 or −5,000.',
          otherMsg: l.cfo || l.capex ? `Use the ${l.cfo ? 'cash from operations' : 'capital spending'} given in the problem, ${m0(l.value)}.` : `${plain(l.full)}.` };
      const v = l.ratio ? ratioIn(h, rows[i]) : h.parseMoney(rows[i]);
      rowRes[i] = h.judgeNumber(v, l.value, diagFor(t, l), opts);
    });
    const bad = rowRes.findIndex((x) => x && !x.ok);
    if (bad >= 0) return { ok: false, rowRes, code: rowRes[bad].code, msg: `${plain(lines[bad].label)}: ${rowRes[bad].msg}` };
    if (t.decision && e.choice !== t.decision) {
      if (!e.choice) return { ok: false, rowRes, code: 'nochoice', msg: 'Now answer the question under the table.' };
      return { ok: false, rowRes, code: 'choice', msg: t.id === 'fcf2' ? `Compare free cash flow, ${m0(t.answer)}, with the ${m0(t.loan)} loan payment. Which is bigger?`
        : `Compare the two ratios, ${r2(t.rn)} and ${r2(t.rs)}. The higher one means more cash came in for each dollar of profit.` };
    }
    return { ok: true, rowRes };
  }

  const showVal = (l) => (l.ratio ? r2(l.value) : m0(l.value));
  function helpText(t, lvl) {
    const lines = linesFor(t), blanks = lines.filter((l) => l.input);
    const say = (l) => `${plain(l.label)}: ${plain(l.full)} = ${showVal(l)}`;
    return lvl === 1 ? say(blanks[0]) : lines.map(say).join('<br>');
  }
  function praise(t) {
    if (t.id === 'cfo1') return `Loudhouse earned ${m0(t.NI)} of profit and brought in ${m0(t.answer)} of cash from running the business.`;
    if (t.id === 'cfo2') return `The smaller promoter brought in ${m0(t.answer)} of cash. The fall in receivables added cash, because sponsors paid down what they owed.`;
    if (t.id === 'fcf1') return `After the new stage, Loudhouse has ${m0(t.answer)} it could pay its owners or use to repay loans without borrowing.`;
    if (t.id === 'fcf2') return `Free cash flow of ${m0(t.answer)} ${t.decision === 'yes' ? 'covers' : 'does not cover'} the ${m0(t.loan)} loan payment${t.decision === 'yes' ? '.' : ', so the promoter would have to borrow or cut spending to pay it.'}`;
    if (t.id === 'cc1') return `Each dollar of Loudhouse’s profit came with about $${t.answer.toFixed(2)} of cash${t.answer >= 1 ? ', so its profit is well backed by cash.' : ', so part of its profit has not arrived as cash yet.'}`;
    if (t.id === 'cc2') return `The ${t.decision === 'north' ? 'North' : 'South'} venue’s profit is better backed by cash. The other venue’s customers may be paying slowly.`;
  }
  function selfAnswer(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = l.ratio ? r2(l.value) : String(Math.round(l.value)); });
    return { rows, choice: t.decision || null };
  }
  function selfWrong(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = l.ratio ? r2(l.value * 1.3) : String(Math.round(l.value * 1.3 + 7)); });
    return { rows, choice: t.decision || null };
  }

  root.DESK = {
    app: 'finan4-u2-cash-desk', version: 4, seedVersion: 3, salt: 'rize-finan4-u2-cash:5b81e3', points: 20,
    storageKey: 'rize-finan4-u2-cash-v3', filePrefix: 'CashDesk',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-cash-desk/verify.html',
    calcPlaceholder: '450000+20000-30000',
    story: { title: 'The Cash Desk', kicker: 'Corporate Finance, Unit 2', company: 'Loudhouse Live', team: 'Finance Team',
      from: 'Kirsten Sandoval', fromTitle: 'controller, Loudhouse Live',
      dek: 'Loudhouse Live, a regional concert promoter, made a profit last year. Its owners want to know how much cash the business can actually spend, and whether a smaller promoter they might buy could pay its own loan. Kirsten Sandoval, the controller, finds the cash behind the profit, and you work through each step with her.',
      whatBox: '',
      stepsLine: 'Nine short steps. Each shows a worked example in the same table you fill in, then you do the same calculation with your own numbers.' },
    steps: STEPS, quiz: QUIZ, walk: null, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the owners', label: 'Your note to Kirsten', minWords: 30, receiptHeading: 'Note to the controller',
      prompt: 'Write Kirsten a note for the owners. How much cash could Loudhouse spend last year, why is that different from its profit, and could the smaller promoter pay its loan? Use your own numbers.' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
