/* The Cash Desk: FINAN IV Unit 2 (cash is not profit). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-03 (case_reuse.py): Loudhouse Live, Kirsten Sandoval, both clean. */
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
    { id: 'note', label: 'Your note', kind: 'note' },
  ];
  const ROWS3 = [null, { key: 'dep', label: 'Depreciation', sign: 1, why: 'It lowered profit, but no cash left this year.' },
    { key: 'dr', label: 'Deferred revenue went up (tickets sold for future shows)', sign: 1, why: 'Fans paid cash for shows that have not happened yet, so cash came in before the revenue.' },
    { key: 'ar', label: 'Accounts receivable went up (sponsors owe us more)', sign: -1, why: 'Revenue was recorded, but the sponsors have not paid yet, so that cash has not arrived.' },
    { key: 'pp', label: 'Prepaid expenses went up (deposits paid to venues)', sign: -1, why: 'Cash went out now for shows we will expense later.' }];

  function buildTasks(rng, h) {
    const T = [];
    { const n = h.between(rng, 1200, 4000, 100), p = h.between(rng, 45, 95, 5);
      T.push({ id: 't1', n, p, cash: n * p, answer: n * p, decision: 'zero' }); }
    { const E = h.between(rng, 60000, 180000, 5000), life = h.pick(rng, [4, 5, 6]);
      T.push({ id: 't2', E, life, answer: E / life, decision: 'full' }); }
    { const NI = h.between(rng, 300000, 900000, 10000), v = [0, h.between(rng, 60000, 160000, 5000), h.between(rng, 100000, 400000, 10000), h.between(rng, 40000, 180000, 5000), h.between(rng, 20000, 90000, 5000)];
      const eff = v.map((x, i) => (i === 0 ? 0 : x * ROWS3[i].sign));
      T.push({ id: 't3', NI, v, eff, answer: NI + eff.reduce((a, b) => a + b, 0) }); }
    { const ocf = h.between(rng, 400000, 1200000, 10000), capex = h.round(ocf * (0.35 + 0.5 * rng()), 5000), NI = h.round(ocf * (0.5 + 0.3 * rng()), 5000);
      T.push({ id: 't4', ocf, capex, NI, answer: ocf - capex }); }
    { const NI = h.between(rng, 500000, 1500000, 50000), ra = 1.4 + 0.6 * rng(), rb = 0.3 + 0.4 * rng();
      const aFirst = rng() < 0.5; const A = { NI, ocf: h.round(NI * (aFirst ? ra : rb), 10000) }, B = { NI, ocf: h.round(NI * (aFirst ? rb : ra), 10000) };
      const win = A.ocf > B.ocf ? 'a' : 'b'; const W = win === 'a' ? A : B;
      T.push({ id: 't5', A, B, answer: W.ocf / W.NI, decision: win }); }
    return T;
  }
  const m = (x) => root.DeskEngine.h.money(x);

  function taskView(t, L, h) {
    if (t.id === 't1') return { title: 'Ticket sales', place: 'Loudhouse Live is promoting a spring concert at a 4,000-seat arena.',
      body: `<p>In November and December, fans buy <b>${t.n.toLocaleString('en-US')} tickets</b> at <b>${m(t.p)}</b> each for a show in <b>March</b>. Loudhouse’s year ends December 31.</p><p>How much cash came in from these tickets this year, and how much revenue does Loudhouse record this year?</p>`,
      value: { label: 'Cash received this year', help: 'A dollar amount.' },
      choice: { legend: 'Revenue recorded this year', options: [['zero', '$0'], ['full', `${m(t.cash)}, all of it`], ['half', `Half of it, ${m(t.cash / 2)}`]] }, noCalc: false };
    if (t.id === 't2') return { title: 'The sound system', place: 'The company’s old speakers finally gave out.',
      body: `<p>On January 2, Loudhouse pays <b>${m(t.E)}</b> in cash for a touring sound system that will last <b>${t.life} years</b>. The accountants spread its cost evenly over those years (straight-line depreciation).</p><p>How much depreciation expense hits this year’s income statement, and how much cash left the business this year for the system?</p>`,
      value: { label: 'Depreciation expense this year' },
      choice: { legend: 'Cash that left the business this year for it', options: [['full', m(t.E)], ['dep', `${m(t.E / t.life)}, the same as the expense`], ['zero', '$0']] } };
    if (t.id === 't3') {
      const rows = L.rows || [];
      const body = ROWS3.slice(1).map((r, j) => { const i = j + 1;
        return `<tr><td class="lbl">${r.label}</td><td>${m(t.v[i])}</td><td><label class="sr-only" for="r${i}">Effect on cash, ${r.label}</label><input id="r${i}" class="rowin" data-row="${i}" inputmode="decimal" autocomplete="off" value="${rows[i] ? String(rows[i]).replace(/"/g, '') : ''}"><span class="mark" id="mk${i}"></span></td></tr>`; }).join('');
      return { title: 'Profit to cash', place: 'Kirsten, the controller, is preparing the year-end numbers.',
        body: `<p>Loudhouse earned <b>${m(t.NI)}</b> of net income this year. Four other things changed. For each one, type its effect on cash: a positive number if it adds cash compared with profit, a negative number if it takes cash away. The table adds them to net income to give cash from operations.</p>`,
        table: `<div class="tw"><table class="cf"><caption>From net income to cash from operations</caption><thead><tr><th scope="col" style="text-align:left">What changed</th><th scope="col">Amount</th><th scope="col">Effect on cash</th></tr></thead><tbody>
          <tr><td class="lbl"><b>Net income</b></td><td>${m(t.NI)}</td><td><input value="${m(t.NI).replace('−', '-')}" readonly aria-label="Net income"></td></tr>${body}</tbody>
          <tfoot><tr class="total hl"><td colspan="2"><b>Cash from operations</b></td><td id="rowTotal"><b>${m(t.NI)}</b></td></tr></tfoot></table></div>`,
        onRows: (rs, $) => { let s = t.NI; for (let i = 1; i <= 4; i++) { const v = h.parseMoney(rs[i]); if (isFinite(v)) s += v; } $('#rowTotal').innerHTML = '<b>' + m(s) + '</b>'; },
        helpLabels: ['Show me the first row', 'Show me every row'] };
    }
    if (t.id === 't4') return { title: 'Free cash flow', place: 'The owners want to know what is left over.',
      body: `<p>A second promoter in the region, which Loudhouse is thinking of buying, reported <b>${m(t.NI)}</b> of net income, <b>${m(t.ocf)}</b> of cash from operations, and <b>${m(t.capex)}</b> of capital spending on new equipment and a venue renovation.</p><p><b>Free cash flow</b> is the cash a business generates after paying for the equipment and buildings it needs: cash from operations minus capital spending. What is this promoter’s free cash flow?</p>`,
      value: { label: 'Free cash flow' } };
    if (t.id === 't5') return { title: 'Two venues', place: 'Two small venues are for sale, and each reports the same profit.',
      body: `<p><b>Venue A</b>: net income ${m(t.A.NI)}, cash from operations ${m(t.A.ocf)}. <b>Venue B</b>: net income ${m(t.B.NI)}, cash from operations ${m(t.B.ocf)}.</p><p>Analysts compare <b>cash conversion</b>, which is cash from operations divided by net income. Which venue turns more of its profit into cash, and what is that venue’s cash conversion?</p>`,
      value: { label: 'Cash conversion of the venue you pick', placeholder: '1.25', help: 'A ratio, like 1.25 (or 125%). Answers within about 1% count.' },
      choice: { legend: 'Which venue turns more profit into cash?', options: [['a', 'Venue A'], ['b', 'Venue B']] } };
  }
  function judgeTask(t, e, h) {
    const v = h.parseMoney(e.value);
    if (t.id === 't1') { const n = h.judgeNumber(v, t.cash, [[0, 'zero', 'Cash and revenue are different questions. The fans paid this year, so the cash is in the bank now.']], { otherMsg: `Cash received = ${t.n.toLocaleString('en-US')} tickets × ${m(t.p)}.` });
      if (!n.ok) return n; if (e.choice !== 'zero') return { ok: false, msg: !e.choice ? 'Pick how much revenue is recorded this year as well.' : 'The show happens in March, so Loudhouse has not earned the money yet. Revenue this year is $0; the cash sits as deferred revenue, a debt to fans until the show.' }; return { ok: true }; }
    if (t.id === 't2') { const n = h.judgeNumber(v, t.answer, [[t.E, 'full', `That is the whole price. Straight-line depreciation spreads it over ${t.life} years: ${m(t.E)} ÷ ${t.life}.`]], { otherMsg: `Depreciation each year = cost ÷ years = ${m(t.E)} ÷ ${t.life}.` });
      if (!n.ok) return n; if (e.choice !== 'full') return { ok: false, msg: !e.choice ? 'Pick how much cash left this year as well.' : `Loudhouse paid the whole ${m(t.E)} in cash on January 2. Depreciation is how the cost is spread on the income statement, not when the cash moves.` }; return { ok: true }; }
    if (t.id === 't3') { const rows = e.rows || []; const rowRes = [];
      for (let i = 1; i <= 4; i++) { const val = h.parseMoney(rows[i]); const ex = t.eff[i];
        rowRes[i] = h.judgeNumber(val, ex, [[-ex, 'sign', `Check the sign. ${ROWS3[i].why} So it ${ex > 0 ? 'adds to' : 'takes away from'} cash: ${ex > 0 ? '+' : '−'}${m(Math.abs(ex)).replace('−', '')}.`]], { scale: Math.abs(ex), otherMsg: `${ROWS3[i].why}` }); }
      const bad = rowRes.findIndex((x, i) => i > 0 && !x.ok);
      if (bad > 0) return { ok: false, rowRes, msg: `${ROWS3[bad].label}: ${rowRes[bad].msg}` };
      return { ok: true, rowRes }; }
    if (t.id === 't4') return h.judgeNumber(v, t.answer, [[t.ocf + t.capex, 'add', 'Capital spending is cash going out, so subtract it.'], [t.NI - t.capex, 'ni', 'Start from cash from operations, not net income. Free cash flow is about cash.'], [t.ocf, 'nocapex', 'That is cash from operations. Free cash flow also subtracts the capital spending.']], { otherMsg: `Free cash flow = ${m(t.ocf)} − ${m(t.capex)}.` });
    if (t.id === 't5') { if (e.choice !== t.decision) return { ok: false, msg: !e.choice ? 'Pick a venue as well.' : 'Compare cash from operations: both earned the same profit, so the one with more operating cash converts more of it.' };
      const W = t.decision === 'a' ? t.A : t.B; const x = isFinite(v) && v > 5 ? v / 100 : v;
      return h.judgeNumber(x, t.answer, [[W.NI / W.ocf, 'flip', 'That divides the wrong way round. Cash conversion = cash from operations ÷ net income.']], { tol: 0.01 * t.answer, otherMsg: `Cash conversion = ${m(W.ocf)} ÷ ${m(W.NI)}.` }); }
  }
  function helpText(t, lvl, h) {
    if (t.id === 't1') return lvl === 1 ? 'Cash: count what fans paid this year. Revenue: ask whether the show has happened yet.' : `Cash = ${t.n.toLocaleString('en-US')} × ${m(t.p)} = ${m(t.cash)}. Revenue this year = $0, because the show is in March.`;
    if (t.id === 't2') return lvl === 1 ? `Depreciation spreads the ${m(t.E)} cost evenly over ${t.life} years.` : `Depreciation = ${m(t.E)} ÷ ${t.life} = ${m(t.answer)}. Cash out this year = the full ${m(t.E)}, paid on January 2.`;
    if (t.id === 't3') { const line = (i) => `${ROWS3[i].label}: ${t.eff[i] > 0 ? '+' : '−'}${m(Math.abs(t.eff[i])).replace('−', '')}. ${ROWS3[i].why}`;
      return lvl === 1 ? line(1) : [1, 2, 3, 4].map(line).join('<br>') + `<br>Cash from operations = ${m(t.answer)}.`; }
    if (t.id === 't4') return lvl === 1 ? 'Start from cash from operations, then take away the capital spending.' : `${m(t.ocf)} − ${m(t.capex)} = ${m(t.answer)}.`;
    if (t.id === 't5') { const W = t.decision === 'a' ? t.A : t.B; return lvl === 1 ? 'Both venues earned the same profit. The one with more cash from operations converts more of it.' : `Venue ${t.decision.toUpperCase()}: ${m(W.ocf)} ÷ ${m(W.NI)} = ${t.answer.toFixed(2)}.`; }
  }
  function praise(t) {
    if (t.id === 't1') return `${m(t.cash)} is in the bank, but revenue this year is $0. Until the March show, that cash is deferred revenue: Loudhouse owes the fans a concert.`;
    if (t.id === 't2') return `Profit falls by ${m(t.answer)} this year, but cash fell by the full ${m(t.E)} on day one. Next year the expense repeats with no cash going out at all.`;
    if (t.id === 't3') return `Cash from operations is ${m(t.answer)}, against net income of ${m(t.NI)}. This is the bridge at the top of every cash flow statement.`;
    if (t.id === 't4') return `Free cash flow is ${m(t.answer)}: what the owners could take out, or reinvest, after paying for equipment.`;
    if (t.id === 't5') return `Venue ${t.decision.toUpperCase()} turns each dollar of profit into ${t.answer.toFixed(2)} dollars of operating cash. Same profit, very different businesses.`;
  }
  function selfAnswer(t) {
    if (t.id === 't3') { const rows = []; for (let i = 1; i <= 4; i++) rows[i] = String(t.eff[i]); return { rows }; }
    if (t.id === 't5') return { value: String(Math.round(t.answer * 100) / 100), choice: t.decision };
    return { value: String(Math.round(t.answer)), choice: t.decision || null };
  }
  function selfWrong(t) {
    if (t.id === 't3') { const rows = []; for (let i = 1; i <= 4; i++) rows[i] = String(-t.eff[i]); return { rows }; }
    if (t.id === 't5') return { value: String(Math.round(t.answer * 100) / 100), choice: t.decision === 'a' ? 'b' : 'a' };
    return { value: String(Math.round(t.answer * 1.3 + 1000)), choice: t.decision || null };
  }

  const WALK = {
    title: 'How Kirsten finds the cash in a profit',
    intro: '<p>Before your own numbers, here is one month at a food truck that Kirsten once audited. It sold <b>$10,000</b> of tacos, <b>$2,000</b> of that to an office that pays next month. Food, wages and fuel cost <b>$7,000</b>, all paid in cash. It also bought a <b>$3,000</b> grill this month, which the accountants depreciate at <b>$50</b> a month.</p>',
    render(stage) {
      const rows = [['Net income: $10,000 − $7,000 − $50', '$2,950', 0], ['+ Depreciation (no cash left for it)', '+$50', 1], ['− Credit sales not yet collected', '−$2,000', 2], ['= Cash from operations', '$1,000', 3], ['− The grill (capital spending)', '−$3,000', 4], ['= Free cash flow', '−$2,000', 4]];
      return `<div class="tw"><table class="cf"><caption>One month at the food truck</caption><thead><tr><th scope="col" style="text-align:left">Line</th><th scope="col">Amount</th></tr></thead><tbody>${rows.filter((r) => r[2] <= stage).map((r, i) => `<tr class="${r[2] === stage ? 'reveal' : ''}${r[0].startsWith('=') ? ' hl' : ''}"><td class="lbl">${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div>`;
    },
    stages: [
      { t: 'Start with profit', p: 'Revenue counts all $10,000 of tacos sold, paid or not. Subtract the $7,000 of costs and the $50 of depreciation: net income is $2,950.' },
      { t: 'Add back depreciation', p: 'The $50 lowered profit, but no cash left the truck for it this month; the cash left when the grill was bought. So add it back.' },
      { t: 'Take out the sales not yet paid', p: '$2,000 of the revenue is still owed by the office. It counts in profit but not in cash, so subtract it. (When customers owe you more, cash lags profit.)' },
      { t: 'That is cash from operations', p: '$2,950 + $50 − $2,000 = $1,000 of cash actually came in from running the truck.' },
      { t: 'Subtract what you spent on equipment', p: 'The $3,000 grill is <b>capital spending</b>: cash spent on things that last. Cash from operations minus capital spending is <b>free cash flow</b>: $1,000 − $3,000 = −$2,000.' },
      { t: 'The lesson', p: 'The truck made a $2,950 profit and still has $2,000 less cash than it started with. Profit tells you whether the business works; cash tells you whether it can pay its bills this month.' },
    ],
  };

  root.DESK = {
    app: 'finan4-u2-cash-desk', version: 1, seedVersion: 1, salt: 'rize-finan4-u2-cash:5b81e3', points: 20,
    storageKey: 'rize-finan4-u2-cash-v1', filePrefix: 'CashDesk',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-cash-desk/verify.html',
    story: { title: 'The Cash Desk', kicker: 'Corporate Finance, Unit 2', company: 'Loudhouse Live', team: 'Finance Team',
      from: 'Kirsten Sandoval', fromTitle: 'Controller',
      dek: 'You have joined the finance team at Loudhouse Live, a regional concert promoter. The business is profitable, but the owners keep asking why the bank balance does not match the profit. Kirsten Sandoval, the controller, wants you to find out.',
      whatBox: '<b>Profit and cash are not the same thing.</b> Profit counts a sale when it is earned and an expense when it is used up. Cash counts money only when it actually moves. A promoter that sells tickets months before a show can be flush with cash and not yet have earned a dollar of it.',
      stepsLine: 'There are ten steps: a worked example, five problems with three one-question checks between them, and a short note to Kirsten.' },
    steps: STEPS, quiz: QUIZ, walk: WALK, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the owners', label: 'Your note to Kirsten', minWords: 30, receiptHeading: 'Note to the controller',
      prompt: 'Kirsten asks you to explain, for the owners, why a profitable promoter can have a bank balance that does not match its profit. Use at least two of the things you worked on today in your explanation.' },
    calcPlaceholder: '1200*65',
    calcHint: 'Type or tap. For example, 1200*65 is 1,200 tickets at \$65, and 90000/5 spreads a \$90,000 cost over five years.',
  };
})(typeof window !== 'undefined' ? window : globalThis);
