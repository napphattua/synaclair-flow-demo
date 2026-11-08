/* case-rules-map02.js · MAP-02 (Clinical Matching CTO handoff 7 Nov §5, decision log 7 Nov l.43).
   Four labels that v2.3 left as UNKNOWN now have a label. v2.3 is kept untouched in SC_CASE_RULES_V23; the rules stay NOT_VALIDATED. */
(function () {
  'use strict';
  const R = window.SC_CASE_RULES;
  window.SC_CASE_RULES_V23 = JSON.parse(JSON.stringify(R));
  const DIFF = [['NEURO-03', 'C08', 'Conditional'], ['NEURO-04', 'C08', 'Conditional'], ['RESP-02', 'C07', 'Conditional'], ['RESP-03', 'C07', 'Not indicated']];
  window.SC_MAP02_DIFF = DIFF.map(([id, task, to]) => {
    const c = R.cases.find(x => x.case_id === id); if (!c) return null;
    const from = (c.unclassified_main_mapping_tasks || []).includes(task) ? 'UNKNOWN' : (c.labels[task] || 'UNKNOWN');
    c.labels[task] = to;
    c.unclassified_main_mapping_tasks = (c.unclassified_main_mapping_tasks || []).filter(x => x !== task);
    return { id, task, from, to };
  }).filter(Boolean);
  R.version = 'working-draft-v2.3 + MAP-02';
})();
