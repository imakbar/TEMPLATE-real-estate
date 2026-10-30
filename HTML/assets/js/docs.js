/*!
 * Components page helper (documentation only, not needed on real pages).
 * For every element with class "demo", builds a "View code" panel that shows
 * the exact markup, with a copy button.
 */
(function () {
  function dedent(text) {
    var lines = text.replace(/\t/g, '  ').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    var min = Infinity;
    lines.forEach(function (l) {
      if (l.trim()) min = Math.min(min, l.match(/^ */)[0].length);
    });
    if (!isFinite(min)) min = 0;
    return lines.map(function (l) { return l.slice(min); }).join('\n');
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  document.querySelectorAll('.demo').forEach(function (demo) {
    var source = demo.getAttribute('data-code') || demo.innerHTML;
    var code = dedent(source);

    var details = document.createElement('details');
    details.className = 'demo-code';
    details.innerHTML =
      '<summary>View code</summary>' +
      '<div class="demo-code-body">' +
      '<button type="button" class="demo-copy" aria-label="Copy code">Copy</button>' +
      '<pre><code>' + escapeHtml(code) + '</code></pre>' +
      '</div>';
    demo.insertAdjacentElement('afterend', details);

    details.querySelector('.demo-copy').addEventListener('click', function (e) {
      var btn = e.currentTarget;
      var done = function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) { /* ignore */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });
})();
