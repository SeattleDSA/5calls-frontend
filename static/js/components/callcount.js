const html = require('choo/html');

module.exports = (state, prev, send) => {
  return html`
  <div></div>
  `;
  // temporarily turned this off until we have a more impressive number
  // return html`
  // <h2 class="callcount" onload=${(e) => send('getTotals')}>
  //   Together we've made ${state.totalCalls.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} calls
  // </h2>
  // `;
}
