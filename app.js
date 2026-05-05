import { bindEvents } from "./src/events.js";
import {
  renderOverview,
  renderContent,
  renderStatistics,
} from "./src/renderCreator.js";
import {
  renderContextRail,
  renderContextTopBar,
  renderGlobalNav,
} from "./src/renderShell.js";
import { renderTrendExploration } from "./src/renderTrendExploration.js";
import { state } from "./src/state.js";

const app = document.getElementById("app");

export function render() {
  app.innerHTML = `
    <aside class="global-nav">${renderGlobalNav()}</aside>
    <aside class="entity-rail">${renderContextRail()}</aside>
    <main class="main-content">
      ${renderContextTopBar()}
      <div class="content-stack">${renderView()}</div>
    </main>
  `;
}

function renderView() {
  if (state.globalView === "trend-exploration") return renderTrendExploration();
  if (state.view === "overview") return renderOverview();
  if (state.view === "content") return renderContent();
  return renderStatistics();
}

bindEvents(app, render);
render();
