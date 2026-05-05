function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <aside class="global-nav">${renderGlobalNav()}</aside>
    <aside class="entity-rail">${renderContextRail()}</aside>
    <main class="main-content">
      ${renderContextTopBar()}
      <div class="content-stack">${renderView()}</div>
    </main>
  `;

  bindEvents();
}

function renderView() {
  if (state.globalView === "trend-exploration") return renderTrendExploration();
  if (state.view === "overview") return renderOverview();
  if (state.view === "content") return renderContent();
  return renderStatistics();
}

render();
