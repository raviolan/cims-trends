import { entityItems, globalNav } from "./data/nav.js";
import { customTrendReferenceCreators } from "./data/customTrendSet.js";
import { escapeAttribute, escapeHtml, segmentedButton } from "./helpers.js";
import { currentTrendLabel } from "./renderTrendExploration.js";
import { state } from "./state.js";

export function renderGlobalNav() {
  return `
    <div class="logo-lockup">
      <div class="logo-icon">C</div>
      <div class="logo-text">CIMS<br />Creator Intelligence</div>
    </div>
    <div class="company-badge">
      <div class="company-mark"></div>
      <div class="company-copy">
        <div class="company-name">Acne Studios</div>
        <div class="company-sub">Nordics Team</div>
      </div>
    </div>
    <div class="nav-group">
      ${globalNav
        .map(
          (item) => `
            <button class="nav-item ${isGlobalNavActive(item) ? "active" : ""}" type="button" data-global-view="${
              item.id === "trend-exploration"
                ? "trend-exploration"
                : "creator-profile"
            }" data-global-id="${item.id}">
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label">${item.label}</span>
            </button>
          `,
        )
        .join("")}
    </div>
    <div class="nav-footer">
      <div class="profile-chip">VA</div>
    </div>
  `;
}

function isGlobalNavActive(item) {
  if (state.globalView === "trend-exploration")
    return item.id === "trend-exploration";
  return item.id === "creator-scouting";
}

export function renderContextRail() {
  if (state.globalView === "trend-exploration") return renderTrendRail();
  return renderEntityRail();
}

function renderEntityRail() {
  return `
    <div class="creator-summary">
      <div class="creator-avatar"></div>
      <div class="creator-name">Andrea Norrman</div>
      <div class="creator-meta">Sweden · Lifestyle / Beauty</div>
    </div>
    <div class="entity-group-title">Channels</div>
    <div class="entity-list">
      ${entityItems
        .map(
          (item) => `
            <button class="entity-item ${state.view === item.id ? "active" : ""}" type="button" data-view="${item.id}">
              <div>${item.label}</div>
              <small>${item.meta.replace("\n", "<br />")}</small>
            </button>
          `,
        )
        .join("")}
    </div>
    <div class="entity-bottom">
      Internal notes synced
      <div class="muted">Updated 2 hours ago</div>
    </div>
  `;
}

function renderTrendRail() {
  return `
    <div class="creator-summary trend-summary">
      <div class="creator-avatar trend-avatar"></div>
      <div class="creator-name">Trend Exploration</div>
      <div class="creator-meta">Social intelligence workspace</div>
    </div>
    <div class="entity-group-title">Focus</div>
    ${renderFocusBoardList()}
    <div class="entity-bottom">
      Curated intelligence view
      <div class="muted">Trend and creator signals</div>
    </div>
  `;
}

function renderFocusBoardList() {
  return `
    <div class="focus-board-list">
      <button class="focus-board-item ${state.activeTrendBoardId === "main" ? "active" : ""}" type="button" data-trend-board="main">
        <span>Main board</span>
        <strong>Genre benchmark</strong>
        <small>${escapeHtml(currentTrendLabel())}</small>
      </button>
      ${state.customTrendBoards.map(renderFocusCustomBoard).join("")}
      ${
        state.customTrendBoards.length < 5
          ? `<button class="focus-board-create" type="button" data-create-trend-board>New custom set</button>`
          : `<div class="focus-board-limit">5 custom sets active</div>`
      }
    </div>
  `;
}

function renderFocusCustomBoard(board) {
  const selectedReferences = customTrendReferenceCreators.filter((creator) =>
    board.referenceCreatorIds.includes(creator.id),
  );
  return `
    <button class="focus-board-item ${state.activeTrendBoardId === board.id ? "active" : ""}" type="button" data-trend-board="${escapeAttribute(board.id)}">
      <span>Custom board</span>
      <strong>${escapeHtml(board.name)}</strong>
      <small>${board.keywords.length} keywords · ${selectedReferences.length} creators</small>
    </button>
  `;
}

export function renderContextTopBar() {
  if (state.globalView === "trend-exploration") return renderTrendTopBar();
  return renderTopBar();
}

function renderTopBar() {
  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="icon-button" type="button" aria-label="Back">←</button>
        <div class="platform-lockup">
          <div class="platform-badge">IG</div>
          <span>Instagram</span>
        </div>
        <div class="handle-block">
          <h1>@andreanorrman</h1>
          <button class="external-link" type="button" aria-label="Open profile">↗</button>
        </div>
      </div>
      <div class="topbar-right">
        <button class="primary-button" type="button">Add to campaign</button>
        <button class="secondary-button" type="button">Save</button>
        <div class="segmented" data-segment="view">
          ${segmentedButton("overview", "Overview", state.view)}
          ${segmentedButton("statistics", "Statistics", state.view)}
          ${segmentedButton("content", "Content", state.view)}
        </div>
      </div>
    </header>
  `;
}

function renderTrendTopBar() {
  return `
    <header class="topbar trend-topbar">
      <div class="topbar-left">
        <div class="platform-lockup">
          <div class="platform-badge">TE</div>
          <span>Trend dashboard</span>
        </div>
        <div class="handle-block">
          <h1>Trend Exploration</h1>
        </div>
      </div>
      <div class="topbar-right">
        <button class="secondary-button" type="button">Export</button>
        <button class="primary-button" type="button">Create report</button>
      </div>
    </header>
  `;
}
