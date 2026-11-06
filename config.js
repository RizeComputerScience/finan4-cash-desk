/* The Cash Desk: FINAN IV Unit 2 (cash is not profit). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-03 (case_reuse.py): Loudhouse Live, Kirsten Sandoval, both clean.
   All numbers are fictional (Loudhouse Live is invented), so the desk has no citations and no `sources` box.
   Rework 2026-11-06 (Samuel's 11/05 desk rules, design/course-principles.md): a worked example on every problem (engine `example`),
   each question's field under that question (`parts`), round seeds, cells named in every formula, no tolerance sentences,
   wrong answers diagnosed with the student's own numbers. seedVersion 2 and version 3, so saved progress and receipts from
   earlier versions do not carry over. */
(function (root) {
  'use strict';
  const QUIZ = [
    { title: 'Quick win: when revenue counts',
      q: 'A company sells a service. When does it record the revenue on its income statement?',
      options: ['When it delivers the service and has earned the money', 'When the customer’s cash arrives', 'When the contract is signed', 'At the end of the year, all at once'],
      answer: 0,
      why: ['Right. Revenue is recorded when it is earned, which means when the service is delivered, whatever day the cash moves.',
        'Cash and revenue can arrive at different times. Revenue waits until the service is delivered.',
        'A signed contract is a promise, not revenue. Revenue is recorded when the service is delivered.',
        'Revenue is recorded as it is earned through the year, not in one lump at year end.'] },
    { title: 'Quick win: why depreciation gets added back',
      q: 'To get from net income to cash from operations, why do we add depreciation back?',
      options: ['It lowered profit, but no cash left the business this year for it', 'It is a tax refund', 'It is cash the company received from selling old equipment', 'It is added back only when the company has a loss'],
      answer: 0,
      why: ['Right. Depreciation spreads an old purchase over many years. The cash left when the equipment was bought, so this year’s depreciation is not cash going out.',
        'Depreciation is not a refund. It is an expense that uses no cash this year.',
        'Selling equipment is a separate cash flow. Depreciation is the yearly charge for equipment the company still owns.',
        'It is added back whether the company makes a profit or a loss, because it never uses cash in the year it is charged.'] },
    { title: 'Quick win: profitable and out of cash?',
      q: 'Can a company report a profit and still run low on cash?',
      options: ['Yes, if customers pay slowly or it spends heavily on equipment', 'No, profit always means cash came in', 'Only if it is breaking the law', 'Only if it has no debt'],
      answer: 0,
      why: ['Right. Profit counts sales when they are earned, and cash counts money when it moves. A growing company can be profitable and still short of cash.',
        'Profit and cash are measured differently. Slow-paying customers and big equipment purchases can drain cash from a profitable company.',
        'It is perfectly legal and common, especially for fast-growing companies.',
        'Debt has nothing to do with it. The gap comes from the timing of collections and spending.'] },
    { title: 'Exam-style question',
      q: 'A company reports net income of $500,000. Depreciation was $80,000, accounts receivable rose by $30,000, and deferred revenue rose by $20,000. What is its cash from operations?',
      options: ['$570,000', '$630,000', '$530,000', '$410,000'],
      answer: 0,
      why: ['Right. Start from $500,000, add back the $80,000 of depreciation, subtract the $30,000 rise in receivables, and add the $20,000 rise in deferred revenue. Questions on the exams look like this one.',
        '$630,000 adds the rise in receivables. Customers owing more means that cash has not arrived yet, so subtract it.',
        '$530,000 subtracts the rise in deferred revenue. Customers paid ahead, so that cash came in before the revenue. Add it.',
        '$410,000 subtracts the depreciation. Depreciation lowered profit without using any cash, so add it back.'] },
  ];
  const STEPS = [
    { id: 'walk', label: 'Worked example', kind: 'walk' },
    { id: 'q1', label: 'Check 1', kind: 'check', quiz: 0 },
    { id: 't1', label: 'Ticket sales', kind: 'task' },
    { id: 't2', label: 'The sound system', kind: 'task' },
    { id: 'q2', label: 'Check 2', kind: 'check', quiz: 1 },
    { id: 't3', label: 'Profit to cash', kind: 'task' },
    { id: 't4', label: 'Free cash flow', kind: 'task' },
    { id: 'q3', label: 'Check 3', kind: 'check', quiz: 2 },
    { id: 't5', label: 'Two venues', kind: 'task' },
    { id: 'q4', label: 'Exam-style question', kind: 'check', quiz: 3 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];
  const ROWS3 = [null, { key: 'dep', label: 'Depreciation', sign: 1, why: 'It lowered profit, but no cash left this year.' },
    { key: 'dr', label: 'Deferred revenue went up (tickets sold for future shows)', sign: 1, why: 'Fans paid cash for shows that have not happened yet, so cash came in before the revenue.' },
    { key: 'ar', label: 'Accounts receivable went up (sponsors owe us more)', sign: -1, why: 'Revenue was recorded, but the sponsors have not paid yet, so that cash has not arrived.' },
    { key: 'pp', label: 'Prepaid expenses went up (deposits paid to venues)', sign: -1, why: 'Cash went out now for shows we will expense later.' }];

  // Round seeds: the lesson in every task is the idea, not the arithmetic. The exam-style question uses $500,000, $80,000,
  // $30,000 and $20,000, so the profit-to-cash seeds avoid $500,000 of net income and $80,000 of depreciation.
  const SEED = { n: [1000, 2000, 3000, 4000], p: [40, 50, 60, 75, 80], life: [4, 5, 6], perYear: [10000, 20000, 25000, 30000],
    NI3: [400000, 600000, 700000, 800000, 900000], dep: [60000, 90000, 120000], dr: [100000, 150000, 200000, 250000, 300000],
    ar: [50000, 100000, 150000], pp: [40000, 50000, 60000, 70000],
    ocf: [400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1200000], niShare: [0.5, 0.6, 0.7, 0.8],
    NI5: [400000, 500000, 600000, 800000, 1000000], hi: [1.2, 1.25, 1.5, 1.6, 1.8], lo: [0.4, 0.5, 0.6] };

  function buildTasks(rng, h) {
    const T = [], P = (a) => h.pick(rng, a);
    { const n = P(SEED.n), p = P(SEED.p);
      T.push({ id: 't1', n, p, cash: n * p, answer: n * p, decision: 'zero' }); }
    { const life = P(SEED.life), E = life * P(SEED.perYear);
      T.push({ id: 't2', E, life, answer: E / life, decision: 'full' }); }
    { const NI = P(SEED.NI3), v = [0, P(SEED.dep), P(SEED.dr), P(SEED.ar), P(SEED.pp)];
      const eff = v.map((x, i) => (i === 0 ? 0 : x * ROWS3[i].sign));
      T.push({ id: 't3', NI, v, eff, answer: NI + eff.reduce((a, b) => a + b, 0) }); }
    { const ocf = P(SEED.ocf); let capex = h.between(rng, 100000, ocf - 100000, 50000); if (capex * 2 === ocf) capex += 50000;
      let NI = h.round(ocf * P(SEED.niShare), 10000);
      if (NI === 2 * capex) NI += ocf >= 1000000 ? 100000 : 50000;   // keeps "net income − capital spending" distinct from "capital spending"
      T.push({ id: 't4', ocf, capex, NI, answer: ocf - capex }); }
    { const NI = P(SEED.NI5), ra = P(SEED.hi), rb = P(SEED.lo);
      const aFirst = rng() < 0.5; const A = { NI, ocf: h.round(NI * (aFirst ? ra : rb), 10000) }, B = { NI, ocf: h.round(NI * (aFirst ? rb : ra), 10000) };
      const win = A.ocf > B.ocf ? 'a' : 'b'; const W = win === 'a' ? A : B;
      T.push({ id: 't5', A, B, answer: W.ocf / W.NI, decision: win }); }
    return T;
  }
  const m = (x) => root.DeskEngine.h.money(x);
  const num = (x) => x.toLocaleString('en-US');
  const ratio = (x) => String(Math.round(x * 100) / 100);
  const tbl = (cap, head, rows) => `<div class="tw"><table class="cf"><caption>${cap}</caption><thead><tr>${head.map((x, i) => `<th scope="col"${i === 0 ? ' style="text-align:left"' : ''}>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x, i) => `<td${i === 0 ? ' class="lbl"' : ''}>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  function taskView(t, L, h) {
    if (t.id === 't1') return { title: 'Ticket sales', place: 'Loudhouse Live is promoting a spring concert at a 4,000-seat arena.',
      body: `<p>In November and December, fans buy <b>${num(t.n)} tickets</b> at <b>${m(t.p)}</b> each. The show is in <b>March</b>. Loudhouse’s year ends December 31.</p>`,
      example: `<p>A comedy club sells 500 tickets at $20 in October for a show on November 15. Its year ends December 31.</p>
        <p>Cash this year: 500 × $20 = $10,000, paid in October.</p>
        <p>Revenue this year: $10,000, because the show took place on November 15, before the year ended.</p>`,
      parts: [{ field: 'value' }, { field: 'choice' }],
      value: { label: '1. How much cash came in from these tickets this year?', help: '' },
      choice: { legend: '2. How much revenue does Loudhouse record this year?', options: [['zero', '$0'], ['full', `${m(t.cash)}, all of it`], ['half', `Half of it, ${m(t.cash / 2)}`]] } };
    if (t.id === 't2') return { title: 'The sound system', place: 'The company’s old speakers finally gave out.',
      body: `<p>On January 2, Loudhouse pays <b>${m(t.E)}</b> in cash for a touring sound system that will last <b>${t.life} years</b>. The accountants spread its cost evenly over those years (straight-line depreciation).</p>
        <p class="formula">depreciation each year = cost ÷ years of use</p>`,
      example: `<p>A café pays $36,000 for an espresso machine that lasts 3 years.</p>
        <p>Depreciation each year: $36,000 ÷ 3 = $12,000.</p>
        <p>Cash out in year 2: $0. The café paid for the machine in full in year 1.</p>`,
      parts: [{ field: 'value' }, { field: 'choice' }],
      value: { label: '1. How much depreciation expense hits this year’s income statement?', help: '' },
      choice: { legend: '2. How much cash left the business this year for the sound system?', options: [['full', m(t.E)], ['dep', `${m(t.E / t.life)}, the same as the expense`], ['zero', '$0']] } };
    if (t.id === 't3') {
      const rows = L.rows || [];
      const body = ROWS3.slice(1).map((r, j) => { const i = j + 1;
        return `<tr><td class="lbl">${r.label}</td><td>${m(t.v[i])}</td><td><label class="sr-only" for="r${i}">Effect on cash, ${r.label}</label><input id="r${i}" class="rowin" data-row="${i}" inputmode="decimal" autocomplete="off" value="${rows[i] ? String(rows[i]).replace(/"/g, '') : ''}"><span class="mark" id="mk${i}"></span></td></tr>`; }).join('');
      return { title: 'Profit to cash', place: 'Kirsten, the controller, is preparing the year-end numbers.',
        body: `<p>Loudhouse earned <b>${m(t.NI)}</b> of net income this year. Four other things changed. For each one, type its effect on cash: a positive number if it adds cash compared with profit, a negative number if it takes cash away.</p>
          <p class="formula">cash from operations = net income + the four effects on cash</p>`,
        example: `<p>Net income is $200,000.</p>
          <p>Depreciation of $40,000 lowered profit but used no cash: +$40,000.</p>
          <p>Customers owe $10,000 more than last year: −$10,000.</p>
          <p>Cash from operations = $200,000 + $40,000 − $10,000 = $230,000.</p>`,
        table: `<div class="tw"><table class="cf"><caption>From net income to cash from operations</caption><thead><tr><th scope="col" style="text-align:left">What changed</th><th scope="col">Amount</th><th scope="col">Effect on cash</th></tr></thead><tbody>
          <tr><td class="lbl"><b>Net income</b></td><td>${m(t.NI)}</td><td><input value="${m(t.NI).replace('−', '-')}" readonly aria-label="Net income"></td></tr>${body}</tbody>
          <tfoot><tr class="total hl"><td class="lbl" colspan="2"><b>Cash from operations</b> (net income + the four effects on cash)</td><td id="rowTotal"><b>${m(t.NI)}</b></td></tr></tfoot></table></div>
          <p class="small">Start a negative effect with a minus sign, like −5,000.</p>`,
        onRows: (rs, $) => { let s = t.NI; for (let i = 1; i <= 4; i++) { const v = h.parseMoney(rs[i]); if (isFinite(v)) s += v; } $('#rowTotal').innerHTML = '<b>' + m(s) + '</b>'; },
        helpLabels: ['Show me the first row', 'Show me every row'] };
    }
    if (t.id === 't4') return { title: 'Free cash flow', place: 'The owners want to know what is left over.',
      body: `<p>Loudhouse is thinking of buying a second promoter in the region. Last year that promoter reported:</p>
        ${tbl('The other promoter, last year', ['Line', 'Amount'], [['Net income', m(t.NI)], ['Cash from operations', m(t.ocf)], ['Capital spending (new equipment and a venue renovation)', m(t.capex)]])}
        <p><b>Free cash flow</b> is the cash a business has left after paying for the equipment and buildings it needs.</p>
        <p class="formula">free cash flow = cash from operations − capital spending</p>`,
      example: `<p>A shop has net income of $250,000, cash from operations of $300,000 and capital spending of $120,000.</p>
        <p>Free cash flow = $300,000 − $120,000 = $180,000.</p>
        <p>Net income is not part of the calculation.</p>`,
      parts: [{ field: 'value' }],
      value: { label: 'What is this promoter’s free cash flow?', help: '' } };
    if (t.id === 't5') return { title: 'Two venues', place: 'Two small venues are for sale, and each reports the same profit.',
      body: `${tbl('The two venues, last year', ['Venue', 'Net income', 'Cash from operations'], [['Venue A', m(t.A.NI), m(t.A.ocf)], ['Venue B', m(t.B.NI), m(t.B.ocf)]])}
        <p>Analysts compare <b>cash conversion</b>: how many dollars of operating cash come in for each dollar of profit.</p>
        <p class="formula">cash conversion = cash from operations ÷ net income</p>`,
      example: `<p>Two shops each earn $100,000 of net income.</p>
        <p>Shop 1 brings in $70,000 of cash from operations: $70,000 ÷ $100,000 = 0.7.</p>
        <p>Shop 2 brings in $130,000: $130,000 ÷ $100,000 = 1.3. Shop 2 turns more of its profit into cash.</p>`,
      parts: [{ field: 'choice' }, { field: 'value' }],
      choice: { legend: '1. Which venue turns more of its profit into cash?', options: [['a', 'Venue A'], ['b', 'Venue B']] },
      value: { label: '2. What is that venue’s cash conversion?', placeholder: '0.0', help: 'Type a ratio like 0.7, or a percentage like 70%.' } };
  }
  function judgeTask(t, e, h) {
    const v = h.parseMoney(e.value);
    if (t.id === 't1') {
      const n = h.judgeNumber(v, t.cash, [
        [0, 'zero', 'Question 1 asks about cash, not revenue. The fans paid this year, so the cash is in the bank now.'],
        [t.n, 'count', `That is the number of tickets. Cash = ${num(t.n)} tickets × ${m(t.p)}.`],
        [t.cash / 2, 'half', `That is half. Fans paid for all ${num(t.n)} tickets this year, so cash = ${num(t.n)} × ${m(t.p)}.`]],
        { otherMsg: `Cash received = ${num(t.n)} tickets × ${m(t.p)}.` });
      if (!n.ok) return n;
      if (e.choice === 'zero') return { ok: true };
      if (!e.choice) return { ok: false, code: 'nochoice', msg: 'Now pick an answer to question 2.' };
      if (e.choice === 'full') return { ok: false, code: 'full', msg: `${m(t.cash)} is the cash, not the revenue. Revenue counts once the show takes place, and the show is in March. Until then the money is deferred revenue: Loudhouse owes the fans a concert.` };
      return { ok: false, code: 'half', msg: 'Revenue is not split across the months. It counts once the show takes place, and the show is in March.' };
    }
    if (t.id === 't2') {
      const n = h.judgeNumber(v, t.answer, [
        [t.E, 'full', `That is the whole price. Straight-line depreciation spreads it over ${t.life} years: ${m(t.E)} ÷ ${t.life}.`],
        [t.E * t.life, 'mult', `That multiplies. Depreciation each year = cost ÷ years of use = ${m(t.E)} ÷ ${t.life}.`]],
        { otherMsg: `Depreciation each year = cost ÷ years of use = ${m(t.E)} ÷ ${t.life}.` });
      if (!n.ok) return n;
      if (e.choice === 'full') return { ok: true };
      if (!e.choice) return { ok: false, code: 'nochoice', msg: 'Now pick an answer to question 2.' };
      if (e.choice === 'dep') return { ok: false, code: 'dep', msg: `${m(t.answer)} is this year’s expense on the income statement. The cash moved all at once: Loudhouse paid ${m(t.E)} on January 2.` };
      return { ok: false, code: 'zero', msg: `Cash did leave this year. Loudhouse paid ${m(t.E)} in cash on January 2.` };
    }
    if (t.id === 't3') { const rows = e.rows || []; const rowRes = [];
      for (let i = 1; i <= 4; i++) { const val = h.parseMoney(rows[i]); const ex = t.eff[i];
        rowRes[i] = h.judgeNumber(val, ex, [[-ex, 'sign', `Check the sign. ${ROWS3[i].why} So it ${ex > 0 ? 'adds to' : 'takes away from'} cash: ${ex > 0 ? '+' : '−'}${m(Math.abs(ex))}.`]],
          { scale: Math.abs(ex), unreadable: 'Type a number in every row, like 5,000 or −5,000.', otherMsg: `Use the amount shown, ${m(t.v[i])}, with a plus or minus sign. ${ROWS3[i].why}` }); }
      const bad = rowRes.findIndex((x, i) => i > 0 && !x.ok);
      if (bad > 0) return { ok: false, rowRes, msg: `${ROWS3[bad].label}: ${rowRes[bad].msg}` };
      return { ok: true, rowRes }; }
    if (t.id === 't4') return h.judgeNumber(v, t.answer, [
      [t.ocf + t.capex, 'add', `Capital spending is cash going out, so subtract it: ${m(t.ocf)} − ${m(t.capex)}.`],
      [t.NI - t.capex, 'ni', `Start from cash from operations (${m(t.ocf)}), not net income. Free cash flow is about cash.`],
      [t.ocf, 'nocapex', `That is cash from operations. Free cash flow also subtracts the ${m(t.capex)} of capital spending.`],
      [t.capex, 'capex', `That is the capital spending itself. Free cash flow = cash from operations − capital spending = ${m(t.ocf)} − ${m(t.capex)}.`]],
      { otherMsg: `Free cash flow = cash from operations − capital spending = ${m(t.ocf)} − ${m(t.capex)}.` });
    if (t.id === 't5') {
      const W = t.decision === 'a' ? t.A : t.B, Lz = t.decision === 'a' ? t.B : t.A, wn = t.decision.toUpperCase(), ln = wn === 'A' ? 'B' : 'A';
      if (!e.choice) return { ok: false, code: 'nochoice', msg: 'Pick a venue for question 1 as well.' };
      if (e.choice !== t.decision) return { ok: false, code: 'loser', msg: `Both venues earned ${m(W.NI)}. Venue ${wn} brought in ${m(W.ocf)} of cash from operations and Venue ${ln} only ${m(Lz.ocf)}, so Venue ${wn} turns more of its profit into cash.` };
      const x = isFinite(v) && v > 5 ? v / 100 : v;
      return h.judgeNumber(x, t.answer, [
        [W.NI / W.ocf, 'flip', `That divides the wrong way round. Cash conversion = cash from operations ÷ net income = ${m(W.ocf)} ÷ ${m(W.NI)}.`],
        [Lz.ocf / Lz.NI, 'other', `That is Venue ${ln}’s cash conversion. You picked Venue ${wn}, so use its numbers: ${m(W.ocf)} ÷ ${m(W.NI)}.`]],
        { tol: 0.01 * t.answer, unreadable: 'Type a ratio like 0.7, or a percentage like 70%.', otherMsg: `Cash conversion = cash from operations ÷ net income = ${m(W.ocf)} ÷ ${m(W.NI)}.` });
    }
  }
  function helpText(t, lvl, h) {
    if (t.id === 't1') return lvl === 1 ? 'For cash, count what fans paid this year. For revenue, ask whether the show has happened yet.' : `Cash = ${num(t.n)} × ${m(t.p)} = ${m(t.cash)}. Revenue this year = $0, because the show is in March.`;
    if (t.id === 't2') return lvl === 1 ? `Depreciation spreads the ${m(t.E)} cost evenly over ${t.life} years.` : `Depreciation = ${m(t.E)} ÷ ${t.life} = ${m(t.answer)}. Cash out this year = the full ${m(t.E)}, paid on January 2.`;
    if (t.id === 't3') { const line = (i) => `${ROWS3[i].label}: ${t.eff[i] > 0 ? '+' : '−'}${m(Math.abs(t.eff[i]))}. ${ROWS3[i].why}`;
      return lvl === 1 ? line(1) : [1, 2, 3, 4].map(line).join('<br>') + `<br>Cash from operations = ${m(t.answer)}.`; }
    if (t.id === 't4') return lvl === 1 ? 'Start from cash from operations, then take away the capital spending.' : `${m(t.ocf)} − ${m(t.capex)} = ${m(t.answer)}.`;
    if (t.id === 't5') { const W = t.decision === 'a' ? t.A : t.B; return lvl === 1 ? 'Both venues earned the same profit. The one with more cash from operations converts more of it.' : `Venue ${t.decision.toUpperCase()}: ${m(W.ocf)} ÷ ${m(W.NI)} = ${ratio(t.answer)}.`; }
  }
  function praise(t) {
    if (t.id === 't1') return `${m(t.cash)} is in the bank, but revenue this year is $0. Until the March show, that cash is deferred revenue: Loudhouse owes the fans a concert.`;
    if (t.id === 't2') return `Profit falls by ${m(t.answer)} this year, but cash fell by the full ${m(t.E)} on day one. Next year the expense repeats with no cash going out at all.`;
    if (t.id === 't3') return `Cash from operations is ${m(t.answer)}, against net income of ${m(t.NI)}. This is the bridge at the top of every cash flow statement.`;
    if (t.id === 't4') return `Free cash flow is ${m(t.answer)}: what the owners could take out, or reinvest, after paying for equipment.`;
    if (t.id === 't5') return `Venue ${t.decision.toUpperCase()} turns each dollar of profit into ${ratio(t.answer)} dollars of operating cash. The two venues report the same profit, but they bring in very different amounts of cash.`;
  }
  function selfAnswer(t) {
    if (t.id === 't3') { const rows = []; for (let i = 1; i <= 4; i++) rows[i] = String(t.eff[i]); return { rows }; }
    if (t.id === 't5') return { value: ratio(t.answer), choice: t.decision };
    return { value: String(Math.round(t.answer)), choice: t.decision || null };
  }
  function selfWrong(t) {
    if (t.id === 't3') { const rows = []; for (let i = 1; i <= 4; i++) rows[i] = String(-t.eff[i]); return { rows }; }
    if (t.id === 't5') return { value: ratio(t.answer), choice: t.decision === 'a' ? 'b' : 'a' };
    return { value: String(Math.round(t.answer * 1.3 + 1000)), choice: t.decision || null };
  }

  const WALK = {
    title: 'How Kirsten finds the cash in a profit',
    intro: `<p>One month at a food truck that Kirsten once audited:</p>
      <ul><li>It sold <b>$10,000</b> of tacos. An office still owes <b>$2,000</b> of that.</li>
      <li>Food, wages and fuel cost <b>$7,000</b>, all paid in cash.</li>
      <li>It bought a <b>$3,000</b> grill, which the accountants depreciate at <b>$50</b> a month.</li></ul>`,
    render(stage) {
      const rows = [['Net income: $10,000 − $7,000 − $50', '$2,950', 0], ['+ Depreciation (no cash left for it)', '+$50', 1], ['− Credit sales not yet collected', '−$2,000', 2],
        ['= Cash from operations (net income + depreciation − sales not yet collected)', '$1,000', 3], ['− The grill (capital spending)', '−$3,000', 4], ['= Free cash flow (cash from operations − the grill)', '−$2,000', 4]];
      return `<div class="tw"><table class="cf"><caption>One month at the food truck</caption><thead><tr><th scope="col" style="text-align:left">Line</th><th scope="col">Amount</th></tr></thead><tbody>${rows.filter((r) => r[2] <= stage).map((r) => `<tr class="${r[2] === stage ? 'reveal' : ''}${r[0].startsWith('=') ? ' hl' : ''}"><td class="lbl">${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div>`;
    },
    stages: [
      { t: 'Start with profit', p: 'Revenue counts all $10,000 of tacos sold, paid or not. Subtract the $7,000 of costs and the $50 of depreciation: net income is $2,950.' },
      { t: 'Add back depreciation', p: 'The $50 lowered profit, but no cash left the truck for it this month; the cash left when the grill was bought. So add it back.' },
      { t: 'Take out the sales not yet paid', p: '$2,000 of the revenue is still owed by the office. It counts in profit but not in cash, so subtract it. (When customers owe you more, cash lags profit.)' },
      { t: 'That is cash from operations', p: '$2,950 + $50 − $2,000 = $1,000 of cash actually came in from running the truck.' },
      { t: 'Subtract what you spent on equipment', p: 'The $3,000 grill is <b>capital spending</b>: cash spent on things that last. Cash from operations minus capital spending is <b>free cash flow</b>: $1,000 − $3,000 = −$2,000.' },
      { t: 'The lesson', p: 'The truck made a $2,950 profit and still has $2,000 less cash than it started with. Profit shows whether the truck earns more than it costs over time. Cash shows whether it can pay this month’s bills.' },
    ],
  };

  root.DESK = {
    app: 'finan4-u2-cash-desk', version: 3, seedVersion: 2, salt: 'rize-finan4-u2-cash:5b81e3', points: 20,
    storageKey: 'rize-finan4-u2-cash-v1', filePrefix: 'CashDesk',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-cash-desk/verify.html',
    story: { title: 'The Cash Desk', kicker: 'Corporate Finance, Unit 2', company: 'Loudhouse Live', team: 'Finance Team',
      from: 'Kirsten Sandoval', fromTitle: 'Controller',
      dek: 'You have joined the finance team at Loudhouse Live, a regional concert promoter. The business is profitable, but the owners keep asking why the bank balance does not match the profit. Kirsten Sandoval, the controller, wants you to find out.',
      whatBox: '<b>Profit and cash are not the same thing.</b> Profit counts a sale when it is earned and an expense when it is used up. Cash counts money only when it actually moves. A promoter that sells tickets months before a show can be flush with cash and not yet have earned a dollar of it.',
      stepsLine: 'There are eleven steps: a worked example, five problems with three one-question checks between them, one exam-style question, and a short note to Kirsten.' },
    steps: STEPS, quiz: QUIZ, walk: WALK, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the owners', label: 'Your note to Kirsten', minWords: 30, receiptHeading: 'Note to the controller',
      prompt: 'Kirsten asks you to explain, for the owners, why a profitable promoter can have a bank balance that does not match its profit. Use at least two of the things you worked on today in your explanation.' },
    calcPlaceholder: '500*20',
    calcHint: 'Type or tap. For example, 500*20 is 500 tickets at $20, and 36000/3 spreads a $36,000 cost over three years.',
  };
})(typeof window !== 'undefined' ? window : globalThis);
