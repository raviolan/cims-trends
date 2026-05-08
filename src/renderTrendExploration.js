import { topicCloudEditForKey } from "./actions.js";
import {
  creatorResultFilters,
  creatorResultPlatformOptions,
  creatorResultsByGenre,
  fallbackCreatorResults,
} from "./data/creatorResults.js";
import { customTrendReferenceCreators } from "./data/customTrendSet.js";
import {
  fallbackTrendAudience,
  normalizeDecliningTrend,
  normalizeEmergingKeyword,
  normalizedDecliningTrendSnapshots,
  normalizedEmergingKeywordSnapshots,
  relatedTopicsForSearch,
  sortDecliningTrends,
  sortEmergingKeywords,
  statsForSearch,
  trendAudienceByGenre,
  trendGenres,
  trendStatsByGenre,
  trendTopicCloudByGenre,
} from "./data/trendExploration.js";
import {
  escapeAttribute,
  escapeHtml,
  formatCompactNumber,
  formatPercent,
  segmentedButton,
} from "./helpers.js";
import {
  renderCommonTopicCloud,
  renderCreatorResultRow,
  renderStatCard,
} from "./renderShared.js";
import { state } from "./state.js";

export function renderTrendExploration() {
  const topicContextKey = currentTrendTopicContextKey();
  const topics = currentEditableTrendTopics();
  const stats = currentTrendStats();
  return `
    <section class="trend-exploration">
      <div class="trend-controls chart-card compact">
        <div class="card-toolbar">
          <div>
            <h2 class="card-title">Explore trend signals</h2>
            <div class="card-note">Select a genre or search a keyword to update topics and averages</div>
          </div>
        </div>
        <div class="trend-control-grid">
          <div>
            <div class="control-label">Genre</div>
            <div class="genre-grid">
              ${trendGenres
                .map(
                  (genre) => `
                    <button class="genre-button ${state.trendMode === "genre" && state.selectedGenre === genre ? "active" : ""}" type="button" data-genre="${escapeAttribute(
                      genre,
                    )}">${escapeHtml(genre)}</button>
                  `,
                )
                .join("")}
            </div>
          </div>
          <form class="trend-search" data-trend-search>
            <label class="control-label" for="trend-search-input">Keyword search</label>
            <div class="search-row">
              <input id="trend-search-input" name="trendSearch" type="search" placeholder="Search e.g. denim, AI tools, meal prep" value="${escapeAttribute(
                state.trendSearch,
              )}" />
              <button class="primary-button" type="submit">Search</button>
            </div>
          </form>
        </div>
      </div>
    </section>

    ${activeCustomTrendBoard() ? renderCustomTrendSetSection(topicContextKey, topics) : renderStandardTopicCloudSection(topicContextKey, topics)}

    ${renderEmergingKeywordsSection(topicContextKey)}

    <section>
      <div class="section-head">
        <div>
          <h2 class="section-title">Trend statistics</h2>
          <div class="subtle-label">Average performance across search-related content</div>
        </div>
      </div>
      <div class="metrics-grid">
        ${stats.map(([label, value, compare], index) => renderStatCard(label, value, compare, index)).join("")}
      </div>
    </section>

    ${renderTrendAudienceSection()}

    ${renderCreatorMatchesSection()}
  `;
}

function renderStandardTopicCloudSection(topicContextKey, topics) {
  return `
    <section>
      ${renderCommonTopicCloud(`${currentTrendLabel()} Topics`, topics, {
        scope: "trend",
        contextKey: topicContextKey,
        editable: true,
        removable: true,
        note:
          state.trendMode === "search"
            ? "Related terms from keyword exploration"
            : "Top keywords for the selected genre",
      })}
    </section>
  `;
}

function renderCustomTrendSetSection(topicContextKey, topics) {
  return `
    <section class="custom-trend-set-grid">
      <div class="custom-keyword-card">
        ${renderCommonTopicCloud("Keyword cloud", topics, {
          scope: "trend",
          contextKey: topicContextKey,
          editable: true,
          removable: true,
          note: "Keywords and reference creator signals shaping this board",
        })}
      </div>
      ${renderReferenceCreatorsCard()}
    </section>
  `;
}

function renderReferenceCreatorsCard() {
  const board = activeCustomTrendBoard();
  const suggestions = referenceCreatorSuggestions();
  const selected = selectedReferenceCreators();
  const hasCreatorSearch = Boolean(board.creatorSearch.trim());
  return `
    <article class="chart-card reference-creators-card">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Reference creators</h3>
          <div class="card-note">Add creator references to shape the trend context</div>
        </div>
        ${
          selected.length || board.keywords.length
            ? `<button class="secondary-button" type="button" data-custom-trend-clear data-custom-board="${escapeAttribute(board.id)}">Clear</button>`
            : ""
        }
      </div>

      <form class="reference-creator-search" data-custom-reference-search data-custom-board="${escapeAttribute(board.id)}">
        <label class="control-label" for="custom-reference-search">Creator search</label>
        <div class="search-row">
          <input id="custom-reference-search" name="customTrendCreatorSearch" type="search" placeholder="Search creator or handle" value="${escapeAttribute(
            board.creatorSearch,
          )}" />
          <button class="primary-button" type="submit">Search</button>
        </div>
      </form>

      ${
        hasCreatorSearch
          ? `<div class="reference-creator-suggestions">
              ${
                suggestions.length
                  ? suggestions.map(renderReferenceCreatorSuggestion).join("")
                  : renderReferenceCreatorEmptyState()
              }
            </div>`
          : ""
      }

      <div class="selected-reference-creators">
        ${
          selected.length
            ? selected.map(renderSelectedReferenceCreator).join("")
            : `<div class="reference-empty">Search and add creators to shape this custom set.</div>`
        }
      </div>
    </article>
  `;
}

function renderReferenceCreatorSuggestion(creator) {
  const board = activeCustomTrendBoard();
  return `
    <article class="reference-creator-suggestion">
      <div class="creator-result-avatar ${creator.avatarTone}">${escapeHtml(creator.avatarInitials)}</div>
      <div>
        <strong>${escapeHtml(creator.handle)}</strong>
        <span>${escapeHtml(creator.name)} · ${escapeHtml(creator.category)}</span>
      </div>
      <button class="secondary-button" type="button" data-custom-reference-add="${escapeAttribute(creator.id)}" data-custom-board="${escapeAttribute(board.id)}">Add</button>
    </article>
  `;
}

function renderSelectedReferenceCreator(creator) {
  const board = activeCustomTrendBoard();
  const metrics = referenceCreatorPreviewMetrics(creator);
  return `
    <article class="selected-reference-creator">
      <div class="creator-result-avatar ${creator.avatarTone}">${escapeHtml(creator.avatarInitials)}</div>
      <div class="selected-reference-copy">
        <strong>${escapeHtml(creator.handle)}</strong>
        <span>${escapeHtml(platformLabel(creator.platform))} · ${escapeHtml(creator.name)}</span>
        <p>${escapeHtml(creator.category || creator.shortBio)}</p>
      </div>
      <div class="reference-preview-metrics">
        <div class="reference-preview-metric">
          <span>Avg. ER</span>
          <strong>${escapeHtml(metrics.engagementRate)}</strong>
        </div>
        <div class="reference-preview-metric">
          <span>Avg. view rate</span>
          <strong>${escapeHtml(metrics.viewRate)}</strong>
        </div>
      </div>
      <button class="topic-word-remove selected-reference-remove" type="button" data-custom-reference-remove="${escapeAttribute(creator.id)}" data-custom-board="${escapeAttribute(board.id)}" aria-label="Remove ${escapeAttribute(creator.handle)}">x</button>
    </article>
  `;
}

function renderReferenceCreatorEmptyState() {
  return `
    <div class="reference-creator-empty">
      <strong>No matching creator references</strong>
      <span>Try another creator name, handle, platform, or category.</span>
    </div>
  `;
}

function renderEmergingKeywordsSection(topicContextKey) {
  const keywords = currentEmergingKeywords();
  const decliningTrends = currentDecliningTrends();
  const activeBoard = activeCustomTrendBoard();
  return `
    <section class="trend-keyword-insights">
      ${renderEmergingKeywordsCard(keywords, topicContextKey, activeBoard)}
      ${renderDecliningTrendsCard(decliningTrends)}
    </section>
  `;
}

function renderEmergingKeywordsCard(keywords, topicContextKey, activeBoard) {
  return `
    <article class="keyword-insight-card emerging-keywords chart-card">
      <div class="section-head">
        <div>
          <h2 class="section-title">Newly trending keywords</h2>
          <div class="subtle-label">${escapeHtml(emergingKeywordsNote())}</div>
        </div>
      </div>

      <div class="emerging-keyword-controls">
        <form class="emerging-keyword-search" data-emerging-keyword-search>
          <label class="control-label" for="emerging-keyword-search">Keyword search</label>
          <div class="search-row">
            <input id="emerging-keyword-search" name="emergingKeywordSearch" type="search" placeholder="Filter rising keywords" value="${escapeAttribute(
              state.emergingKeywordSearch,
            )}" />
            <button class="primary-button" type="submit">Search</button>
          </div>
        </form>

        <div>
          <div class="control-label">Source</div>
          <div class="creator-filter-grid">
            ${emergingSourceOptions()
              .map(
                (option) => `
                  <button class="creator-filter-button ${state.emergingKeywordSource === option.id ? "active" : ""}" type="button" data-emerging-keyword-source="${escapeAttribute(
                    option.id,
                  )}">${escapeHtml(option.label)}</button>
                `,
              )
              .join("")}
          </div>
        </div>

        <div>
          <div class="control-label">Platform</div>
          <div class="creator-platform-toggle">
            ${emergingPlatformOptions()
              .map(
                (option) => `
                  <button class="creator-platform-button ${state.emergingKeywordPlatform === option.id ? "active" : ""}" type="button" data-emerging-keyword-platform="${escapeAttribute(
                    option.id,
                  )}">
                    <span>${escapeHtml(option.icon)}</span>${escapeHtml(option.label)}
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>

      ${renderEmergingActiveFilters()}

      <div class="keyword-insight-list" data-keyword-insight-list="emerging">
        ${
          keywords.length
            ? keywords
                .map((keyword) =>
                  renderEmergingKeywordRow(keyword, topicContextKey, activeBoard),
                )
                .join("")
            : renderKeywordInsightEmptyState(
                "No newly trending keywords match these filters.",
              )
        }
      </div>
    </article>
  `;
}

function renderDecliningTrendsCard(trends) {
  return `
    <article class="keyword-insight-card declining-trends chart-card">
      <div class="section-head">
        <div>
          <h2 class="section-title">Declining trends</h2>
          <div class="subtle-label">${escapeHtml(decliningTrendsNote())}</div>
        </div>
      </div>

      <div class="declining-trend-controls">
        <form class="declining-trend-search" data-declining-trend-search>
          <label class="control-label" for="declining-trend-search">Trend search</label>
          <div class="search-row">
            <input id="declining-trend-search" name="decliningTrendSearch" type="search" placeholder="Filter declining trends" value="${escapeAttribute(
              state.decliningTrendSearch,
            )}" />
            <button class="primary-button" type="submit">Search</button>
          </div>
        </form>

        <div>
          <div class="control-label">Source</div>
          <div class="creator-filter-grid">
            ${emergingSourceOptions()
              .map(
                (option) => `
                  <button class="creator-filter-button ${state.decliningTrendSource === option.id ? "active" : ""}" type="button" data-declining-trend-source="${escapeAttribute(
                    option.id,
                  )}">${escapeHtml(option.label)}</button>
                `,
              )
              .join("")}
          </div>
        </div>

        <div>
          <div class="control-label">Platform</div>
          <div class="creator-platform-toggle">
            ${emergingPlatformOptions()
              .map(
                (option) => `
                  <button class="creator-platform-button ${state.decliningTrendPlatform === option.id ? "active" : ""}" type="button" data-declining-trend-platform="${escapeAttribute(
                    option.id,
                  )}">
                    <span>${escapeHtml(option.icon)}</span>${escapeHtml(option.label)}
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>

      ${renderDecliningActiveFilters()}

      <div class="keyword-insight-list" data-keyword-insight-list="declining">
        ${
          trends.length
            ? trends.map(renderDecliningTrendRow).join("")
            : renderKeywordInsightEmptyState(
                "No declining trends match this context.",
              )
        }
      </div>
    </article>
  `;
}

function renderDecliningActiveFilters() {
  const chips = [];
  if (state.decliningTrendSearch) {
    chips.push(`Search: ${state.decliningTrendSearch}`);
  }
  if (state.decliningTrendSource !== "all") {
    chips.push(`Source: ${emergingSourceLabel(state.decliningTrendSource)}`);
  }
  if (state.decliningTrendPlatform !== "all") {
    chips.push(`Platform: ${platformLabel(state.decliningTrendPlatform)}`);
  }
  if (!chips.length) return "";
  return `
    <div class="creator-active-filters declining-active-filters">
      ${chips
        .map(
          (chip) => `
            <span class="context-pill">${escapeHtml(chip)}</span>
          `,
        )
        .join("")}
      <button class="active-filter-chip" type="button" data-declining-trend-clear>Clear</button>
    </div>
  `;
}

function renderEmergingActiveFilters() {
  const chips = [];
  if (state.emergingKeywordSearch) {
    chips.push(`Search: ${state.emergingKeywordSearch}`);
  }
  if (state.emergingKeywordSource !== "all") {
    chips.push(`Source: ${emergingSourceLabel(state.emergingKeywordSource)}`);
  }
  if (state.emergingKeywordPlatform !== "all") {
    chips.push(`Platform: ${platformLabel(state.emergingKeywordPlatform)}`);
  }
  if (!chips.length) return "";
  return `
    <div class="creator-active-filters emerging-active-filters">
      ${chips
        .map(
          (chip) => `
            <span class="context-pill">${escapeHtml(chip)}</span>
          `,
        )
        .join("")}
      <button class="active-filter-chip" type="button" data-emerging-keyword-clear>Clear</button>
    </div>
  `;
}

function renderEmergingKeywordRow(keyword, topicContextKey, activeBoard) {
  return `
    <article class="keyword-insight-row emerging-keyword-row">
      <div class="keyword-insight-main">
        <div class="keyword-insight-title">
          <strong>${escapeHtml(keyword.label)}</strong>
          ${keyword.new ? `<span class="emerging-new-badge">New</span>` : ""}
        </div>
        <div class="keyword-insight-meta">
          <span class="context-pill">${escapeHtml(emergingSourceLabel(keyword.source))}</span>
          <span class="context-pill">${escapeHtml(platformLabel(keyword.platform))}</span>
          ${
            keyword.sampleCreators?.length
              ? `<span>${escapeHtml(keyword.sampleCreators.slice(0, 3).join(", "))}</span>`
              : ""
          }
        </div>
      </div>
      <div class="keyword-insight-stats">
        <div>
          <span>Growth</span>
          <strong>+${formatPercent(keyword.growth)}</strong>
        </div>
        <div>
          <span>Mentions</span>
          <strong>${formatCompactNumber(keyword.currentMentions)}</strong>
        </div>
      </div>
      ${
        activeBoard
          ? `<button class="secondary-button" type="button" data-emerging-keyword-add="${escapeAttribute(keyword.label)}" data-topic-context="${escapeAttribute(topicContextKey)}">Add</button>`
          : ""
      }
    </article>
  `;
}

function renderDecliningTrendRow(trend) {
  return `
    <article class="keyword-insight-row declining-trend-row">
      <div class="keyword-insight-main">
        <div class="keyword-insight-title">
          <strong>${escapeHtml(trend.label)}</strong>
        </div>
        <div class="keyword-insight-meta">
          <span class="context-pill">${escapeHtml(emergingSourceLabel(trend.source))}</span>
          <span class="context-pill">${escapeHtml(platformLabel(trend.platform))}</span>
          ${
            trend.sampleCreators?.length
              ? `<span>${escapeHtml(trend.sampleCreators.slice(0, 3).join(", "))}</span>`
              : ""
          }
        </div>
      </div>
      <div class="keyword-insight-stats declining-trend-stats">
        <div>
          <span>Decline</span>
          <strong>-${formatPercent(trend.decline)}</strong>
        </div>
        <div>
          <span>Mentions</span>
          <strong>${formatCompactNumber(trend.currentMentions)}</strong>
        </div>
      </div>
    </article>
  `;
}

function renderKeywordInsightEmptyState(message) {
  return `
    <div class="keyword-insight-empty">
      ${escapeHtml(message)}
    </div>
  `;
}

function renderTrendAudienceSection() {
  const audience = currentTrendAudience();
  return `
    <section class="trend-audience">
      <div class="section-head">
        <div>
          <h2 class="section-title">Audience behind this trend</h2>
          <div class="subtle-label">Interaction geography and audience composition for ${escapeHtml(currentCreatorMatchContext().label)}</div>
        </div>
      </div>
      <div class="trend-audience-grid">
        ${renderTrendLocationCard(audience.locations)}
        ${renderTrendGenderSplitCard(audience.genderSplit)}
        ${renderTrendGenderByAgeCard(audience.genderByAge)}
      </div>
    </section>
  `;
}

function renderTrendLocationCard(locations) {
  const max = Math.max(...locations.map(([, value]) => value), 1);
  return `
    <article class="trend-audience-card chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Top locations</h3>
          <div class="card-note">Where interaction around this trend is strongest</div>
        </div>
      </div>
      <div class="trend-location-list">
        ${locations
          .map(
            ([country, value]) => `
              <div class="trend-location-row">
                <div class="trend-location-head">
                  <strong>${escapeHtml(country)}</strong>
                  <span>${formatPercent(value)}</span>
                </div>
                <div class="trend-location-track">
                  <div class="trend-location-bar" style="width:${Math.round((value / max) * 100)}%"></div>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderTrendGenderSplitCard(genderSplit) {
  const entries = Object.entries(genderSplit);
  const female = Number(genderSplit.Female) || 0;
  const male = Number(genderSplit.Male) || 0;
  const other = Math.max(0, 100 - female - male);
  return `
    <article class="trend-audience-card chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Gender split</h3>
          <div class="card-note">People interacting with this content</div>
        </div>
      </div>
      <div class="trend-gender-split">
        <div class="trend-gender-donut" style="--female:${female}%; --male:${male}%; --other:${other}%">
          <div>${formatPercent(female)}</div>
        </div>
        <div class="trend-gender-legend">
          ${entries
            .map(
              ([label, value]) => `
                <div class="trend-gender-legend-row ${label.toLowerCase()}">
                  <span><i></i>${escapeHtml(label)}</span>
                  <strong>${formatPercent(value)}</strong>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    </article>
  `;
}

function renderTrendGenderByAgeCard(rows) {
  const max = Math.max(...rows.flatMap((row) => [row.female, row.male]), 1);
  return `
    <article class="trend-audience-card chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Gender split by age</h3>
          <div class="card-note">Interaction audience by age group</div>
        </div>
      </div>
      <div class="trend-age-bars">
        ${rows
          .map(
            (row) => `
              <div class="trend-age-group">
                <div class="trend-age-stack">
                  <div class="trend-age-bar female" style="height:${Math.max(4, Math.round((row.female / max) * 92))}px" title="Female ${formatPercent(row.female)}"></div>
                  <div class="trend-age-bar male" style="height:${Math.max(4, Math.round((row.male / max) * 92))}px" title="Male ${formatPercent(row.male)}"></div>
                </div>
                <div class="trend-age-label">${escapeHtml(row.group)}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderCreatorMatchesSection() {
  const context = currentCreatorMatchContext();
  const results = currentCreatorMatches();
  return `
    <section class="creator-matches">
      <div class="section-head">
        <div>
          <h2 class="section-title">Creator matches</h2>
          <div class="subtle-label">Creators aligned with the current trend context</div>
        </div>
        <div class="segmented" data-segment="creatorResultSort">
          ${segmentedButton("followers", "Followers", state.creatorResultSort)}
          ${segmentedButton("avgViews", "Avg. Views", state.creatorResultSort)}
          ${segmentedButton("engagements", "Engagements", state.creatorResultSort)}
        </div>
      </div>

      <div class="creator-search-panel chart-card">
        <div class="creator-search-toolbar">
          <form class="creator-match-search" data-creator-result-search>
            <label class="control-label" for="creator-result-search">Search matches</label>
            <div class="search-row">
              <input
                id="creator-result-search"
                name="creatorResultSearch"
                type="search"
                placeholder="@profile #hashtag or keywords"
                value="${escapeAttribute(state.creatorResultSearch)}"
              />
              <button class="primary-button" type="submit">Search</button>
              <button class="secondary-button" type="button" data-creator-results-clear>Clear</button>
            </div>
          </form>

          <div>
            <div class="control-label">Channels</div>
            <div class="creator-platform-toggle">
              ${creatorResultPlatformOptions
                .map(
                  (platform) => `
                    <button class="creator-platform-button ${state.creatorResultPlatforms.includes(platform.id) ? "active" : ""}" type="button" data-creator-platform="${escapeAttribute(
                      platform.id,
                    )}">
                      <span>${escapeHtml(platform.icon)}</span>${escapeHtml(platform.label)}
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="creator-context-row">
          <span class="context-pill">Context: ${escapeHtml(context.label)}</span>
          ${state.creatorResultSearch ? `<span class="context-pill muted-pill">Local search: ${escapeHtml(state.creatorResultSearch)}</span>` : ""}
          ${shouldShowDidYouMean(context) ? `<span class="did-you-mean">Did you mean: <button type="button" data-creator-suggestion="${escapeAttribute(context.suggestion)}">${escapeHtml(context.suggestion)}</button></span>` : ""}
        </div>

        <div class="creator-filter-grid">
          ${creatorResultFilters
            .map(
              (filter) => `
                <button class="creator-filter-button ${state.creatorResultFilters.includes(filter) ? "active" : ""}" type="button" data-creator-filter="${escapeAttribute(
                  filter,
                )}">${escapeHtml(filter)}</button>
              `,
            )
            .join("")}
        </div>

        <div class="creator-active-filters">
          ${
            state.creatorResultFilters.length
              ? state.creatorResultFilters
                  .map(
                    (filter) => `
                    <button class="active-filter-chip" type="button" data-creator-filter-remove="${escapeAttribute(filter)}">
                      ${escapeHtml(filter)} <span>x</span>
                    </button>
                  `,
                  )
                  .join("")
              : `<span class="filter-empty">No active filters</span>`
          }
        </div>
      </div>

      <div class="creator-results-list">
        ${results.length ? results.map(renderCreatorResultRow).join("") : renderCreatorEmptyState()}
      </div>
    </section>
  `;
}

function currentCreatorMatchContext() {
  if (state.activeTopic.scope === "trend" && state.activeTopic.label) {
    return {
      type: "topic",
      label: state.activeTopic.label,
      suggestion: state.activeTopic.label.replace(/\s+trend$/i, ""),
    };
  }

  const activeBoard = activeCustomTrendBoard();
  if (activeBoard && hasCustomTrendInputs()) {
    const customLabels = [
      ...activeBoard.keywords,
      ...selectedReferenceCreators().map((creator) => creator.handle),
    ];
    return {
      type: "custom",
      label: customLabels.length
        ? `${activeBoard.name}: ${customLabels.slice(0, 3).join(", ")}`
        : activeBoard.name,
      suggestion: activeBoard.keywords[0] || "",
    };
  }

  if (state.trendMode === "search" && state.trendSearch.trim()) {
    return {
      type: "search",
      label: state.trendSearch.trim(),
      suggestion: `${state.trendSearch.trim()} creators`,
    };
  }

  return { type: "genre", label: state.selectedGenre, suggestion: "" };
}

function currentCreatorMatches() {
  const context = currentCreatorMatchContext();
  const pool = creatorPoolForContext(context);
  const platformSet = new Set(state.creatorResultPlatforms);
  const localSearch = state.creatorResultSearch.trim().toLowerCase();
  const filtered = pool
    .filter((creator) => platformSet.has(creator.platform))
    .filter((creator) => {
      if (!localSearch) return true;
      const haystack = [
        creator.handle,
        creator.name,
        creator.bio,
        creator.gender,
        creator.contact,
        creator.lookalike,
        ...(creator.matchTopics || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(localSearch);
    });

  const sorted = [...filtered].sort(
    (a, b) =>
      creatorSortValue(b, state.creatorResultSort) -
      creatorSortValue(a, state.creatorResultSort),
  );
  const fallback = fallbackCreatorResults
    .filter((creator) => platformSet.has(creator.platform))
    .sort(
      (a, b) =>
        creatorSortValue(b, state.creatorResultSort) -
        creatorSortValue(a, state.creatorResultSort),
    );
  return (sorted.length ? sorted : fallback).slice(0, 10);
}

function creatorPoolForContext(context) {
  if (context.type === "custom") {
    const references = selectedReferenceCreators();
    const lookalikeIds = references.flatMap(
      (creator) => creator.lookalikeCreatorIds || [],
    );
    const customTopics = customTrendSignals().map((label) =>
      label.toLowerCase(),
    );
    const lookalikes = fallbackCreatorResults.filter((creator) =>
      lookalikeIds.includes(creator.id),
    );
    const topicMatches = fallbackCreatorResults.filter((creator) =>
      (creator.matchTopics || []).some((topic) => {
        const normalized = topic.toLowerCase();
        return customTopics.some(
          (signal) =>
            normalized.includes(signal) || signal.includes(normalized),
        );
      }),
    );
    return prioritizeCreatorPool(
      mergeCreators([...lookalikes, ...topicMatches]).length
        ? mergeCreators([...lookalikes, ...topicMatches])
        : fallbackCreatorResults,
    );
  }

  if (context.type === "genre") {
    const genrePool = creatorResultsByGenre[context.label];
    return prioritizeCreatorPool(
      genrePool && genrePool.length ? genrePool : fallbackCreatorResults,
    );
  }

  const needle = context.label.toLowerCase();
  const topicMatches = fallbackCreatorResults.filter((creator) =>
    creator.matchTopics.some(
      (topic) =>
        topic.toLowerCase().includes(needle) ||
        needle.includes(topic.toLowerCase()),
    ),
  );
  return prioritizeCreatorPool(
    topicMatches.length ? topicMatches : fallbackCreatorResults,
  );
}

function prioritizeCreatorPool(primary) {
  const seen = new Set(primary.map((creator) => creator.id));
  return [
    ...primary,
    ...fallbackCreatorResults.filter((creator) => !seen.has(creator.id)),
  ];
}

function creatorSortValue(profile, sortKey) {
  if (sortKey === "followers") return Number(profile.followers) || 0;
  if (sortKey === "avgViews") return Number(profile.avgViews) || 0;
  return Number(profile.engagements) || 0;
}

function shouldShowDidYouMean(context) {
  return (
    context.type !== "genre" &&
    context.suggestion &&
    context.suggestion !== context.label
  );
}

function renderCreatorEmptyState() {
  return `
    <div class="creator-result-empty chart-card">
      <strong>No exact matches</strong>
      <span>Try another platform or clear the local creator-result search.</span>
    </div>
  `;
}

function currentTrendAudience() {
  const context = currentCreatorMatchContext();
  if (activeCustomTrendBoard() && hasCustomTrendInputs()) {
    return blendCustomAudience(audienceForSearchOrTopic(currentTrendLabel()));
  }
  if (context.type === "genre")
    return trendAudienceByGenre[context.label] || fallbackTrendAudience;
  return audienceForSearchOrTopic(context.label);
}

function audienceForSearchOrTopic(label) {
  const normalized = label.toLowerCase();
  const genre = trendGenres.find((item) =>
    normalized.includes(item.toLowerCase()),
  );
  if (genre) return trendAudienceByGenre[genre] || fallbackTrendAudience;

  const topicGenre = trendGenres.find((item) =>
    (trendTopicCloudByGenre[item] || []).some(
      (topic) =>
        normalized.includes(topic.label.toLowerCase()) ||
        topic.label.toLowerCase().includes(normalized),
    ),
  );

  const base = topicGenre
    ? trendAudienceByGenre[topicGenre]
    : fallbackTrendAudience;
  const shift = Math.min(4, normalized.length % 5);
  return {
    locations: base.locations.map(([country, value], index) => [
      country,
      Math.max(
        2,
        Number((value + (index === 0 ? shift : -shift / 2)).toFixed(1)),
      ),
    ]),
    genderSplit: base.genderSplit,
    genderByAge: base.genderByAge,
  };
}

export function currentTrendLabel() {
  const searched = state.trendSearch.trim();
  if (state.trendMode === "search" && searched) return searched;
  return state.selectedGenre;
}

export function currentTrendTopicContextKey() {
  const searched = state.trendSearch.trim().toLowerCase();
  const base =
    state.trendMode === "search" && searched
      ? `search:${searched}`
      : `genre:${state.selectedGenre.toLowerCase()}`;
  const activeBoard = activeCustomTrendBoard();
  return activeBoard ? `custom:${activeBoard.id}:${base}` : base;
}

function currentEditableTrendTopics() {
  return applyTopicCloudEdits(
    currentTrendTopics(),
    topicCloudEditForKey(currentTrendTopicContextKey()),
  );
}

function applyTopicCloudEdits(baseTopics, edits) {
  const removed = new Set(
    (edits.removed || []).map((label) => label.toLowerCase()),
  );
  const visible = baseTopics.filter(
    (topic) => !removed.has(topic.label.toLowerCase()),
  );
  const existing = new Set(visible.map((topic) => topic.label.toLowerCase()));
  const added = (edits.added || [])
    .filter((label) => !existing.has(label.toLowerCase()))
    .map((label, index) => ({ label, weight: Math.max(42, 72 - index * 4) }));
  return [...visible, ...added].slice(0, 14);
}

function currentTrendTopics() {
  const searched = state.trendSearch.trim();
  const base =
    state.trendMode === "search" && searched
      ? relatedTopicsForSearch(searched)
      : trendTopicCloudByGenre[state.selectedGenre] ||
        trendTopicCloudByGenre[trendGenres[0]];
  if (!activeCustomTrendBoard()) return base;
  return enrichCustomTrendTopics(base);
}

function currentTrendStats() {
  const searched = state.trendSearch.trim();
  const base =
    state.trendMode === "search" && searched
      ? statsForSearch(searched)
      : trendStatsByGenre[state.selectedGenre] ||
        trendStatsByGenre[trendGenres[0]];
  if (!activeCustomTrendBoard() || !hasCustomTrendInputs()) return base;
  return applyCustomStatInfluence(base);
}

function currentEmergingKeywords() {
  const activeBoard = activeCustomTrendBoard();
  const selectedReferences = selectedReferenceCreators();
  const canShowReference = Boolean(activeBoard && selectedReferences.length);
  const entries = [
    ...sphereEmergingKeywords(),
    ...(canShowReference ? referenceEmergingKeywords(selectedReferences) : []),
  ];
  const sourceFiltered =
    state.emergingKeywordSource === "all"
      ? entries
      : entries.filter((entry) => entry.source === state.emergingKeywordSource);
  const platformFiltered =
    state.emergingKeywordPlatform === "all"
      ? sourceFiltered
      : sourceFiltered.filter(
          (entry) => entry.platform === state.emergingKeywordPlatform,
        );
  const query = state.emergingKeywordSearch.trim().toLowerCase();
  const searched = query
    ? platformFiltered.filter((entry) =>
        [
          entry.label,
          entry.source,
          entry.platform,
          ...(entry.sampleCreators || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : platformFiltered;
  return sortEmergingKeywords(dedupeEmergingKeywords(searched)).slice(0, 8);
}

function currentDecliningTrends() {
  const selectedReferences = selectedReferenceCreators();
  const canShowReference = Boolean(
    activeCustomTrendBoard() && selectedReferences.length,
  );
  const entries = [
    ...sphereDecliningTrends(),
    ...(canShowReference ? referenceDecliningTrends(selectedReferences) : []),
  ];
  const sourceFiltered =
    state.decliningTrendSource === "all"
      ? entries
      : entries.filter((entry) => entry.source === state.decliningTrendSource);
  const platformFiltered =
    state.decliningTrendPlatform === "all"
      ? sourceFiltered
      : sourceFiltered.filter(
          (entry) => entry.platform === state.decliningTrendPlatform,
        );
  const query = state.decliningTrendSearch.trim().toLowerCase();
  const searched = query
    ? platformFiltered.filter((entry) =>
        [
          entry.label,
          entry.source,
          entry.platform,
          ...(entry.sampleCreators || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : platformFiltered;
  return sortDecliningTrends(dedupeKeywordInsights(searched)).slice(0, 8);
}

function sphereEmergingKeywords() {
  const context = currentTrendLabel().toLowerCase();
  return normalizedEmergingKeywordSnapshots().filter((entry) => {
    if (entry.source !== "sphere") return false;
    return matchesCurrentTrendContext(entry, context);
  });
}

function sphereDecliningTrends() {
  const context = currentTrendLabel().toLowerCase();
  return normalizedDecliningTrendSnapshots().filter((entry) => {
    if (entry.source !== "sphere") return false;
    return matchesCurrentTrendContext(entry, context);
  });
}

function referenceEmergingKeywords(references) {
  const selectedIds = new Set(references.map((creator) => creator.id));
  const snapshotEntries = normalizedEmergingKeywordSnapshots().filter(
    (entry) =>
      entry.source === "reference" &&
      (entry.referenceCreatorIds || []).some((id) => selectedIds.has(id)),
  );
  return sortEmergingKeywords([
    ...snapshotEntries,
    ...derivedReferenceEmergingKeywords(references),
  ]);
}

function referenceDecliningTrends(references) {
  const selectedIds = new Set(references.map((creator) => creator.id));
  const snapshotEntries = normalizedDecliningTrendSnapshots().filter(
    (entry) =>
      entry.source === "reference" &&
      (entry.referenceCreatorIds || []).some((id) => selectedIds.has(id)),
  );
  return sortDecliningTrends([
    ...snapshotEntries,
    ...derivedReferenceDecliningTrends(references),
  ]);
}

function derivedReferenceEmergingKeywords(references) {
  const rows = [];
  const seen = new Set();
  references.forEach((creator, creatorIndex) => {
    const lookalikes = fallbackCreatorResults.filter((profile) =>
      (creator.lookalikeCreatorIds || []).includes(profile.id),
    );
    const labels = [
      ...(creator.topics || []),
      ...lookalikes.flatMap((profile) => profile.matchTopics || []),
    ].filter((label) => !trendGenres.includes(label));

    labels.forEach((label, labelIndex) => {
      const key = label.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const matchedLookalikes = lookalikes.filter((profile) =>
        (profile.matchTopics || []).some(
          (topic) => topic.toLowerCase() === key,
        ),
      );
      rows.push(
        normalizeEmergingKeyword({
          label,
          source: "reference",
          platform: creator.platform,
          currentMentions: 420 + key.length * 18 + labelIndex * 34,
          previousMentions:
            (labelIndex + creatorIndex) % 4 === 0
              ? 0
              : 95 + labelIndex * 24,
          sampleCreators: [
            creator.handle,
            ...matchedLookalikes.map((profile) => profile.handle),
          ].slice(0, 3),
        }),
      );
    });
  });
  return rows;
}

function derivedReferenceDecliningTrends(references) {
  const rows = [];
  const seen = new Set();
  references.forEach((creator, creatorIndex) => {
    const lookalikes = fallbackCreatorResults.filter((profile) =>
      (creator.lookalikeCreatorIds || []).includes(profile.id),
    );
    const labels = [
      ...(creator.topics || []),
      ...lookalikes.flatMap((profile) => profile.matchTopics || []),
    ].filter((label) => !trendGenres.includes(label));

    labels.slice().reverse().forEach((label, labelIndex) => {
      const key = label.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const matchedLookalikes = lookalikes.filter((profile) =>
        (profile.matchTopics || []).some(
          (topic) => topic.toLowerCase() === key,
        ),
      );
      const previousMentions = 620 + key.length * 16 + labelIndex * 28;
      rows.push(
        normalizeDecliningTrend({
          label,
          source: "reference",
          platform: creator.platform,
          currentMentions: Math.max(
            80,
            Math.round(previousMentions * (0.38 + ((labelIndex + creatorIndex) % 3) * 0.08)),
          ),
          previousMentions,
          sampleCreators: [
            creator.handle,
            ...matchedLookalikes.map((profile) => profile.handle),
          ].slice(0, 3),
        }),
      );
    });
  });
  return rows;
}

function matchesCurrentTrendContext(entry, context) {
  const tags = (entry.sphereTags || []).map((tag) => tag.toLowerCase());
  if (state.trendMode === "genre") return tags.includes(context);
  const haystack = [entry.label, ...tags, ...(entry.sampleCreators || [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(context) || context.includes(entry.label);
}

function dedupeEmergingKeywords(entries) {
  return dedupeKeywordInsights(entries);
}

function dedupeKeywordInsights(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const key = `${entry.source}:${entry.platform}:${entry.label.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function emergingKeywordsNote() {
  const activeBoard = activeCustomTrendBoard();
  if (activeBoard && selectedReferenceCreators().length) {
    return "Rising terms from this sphere and selected reference creators";
  }
  return "Rising terms in the selected sphere";
}

function decliningTrendsNote() {
  if (activeCustomTrendBoard() && selectedReferenceCreators().length) {
    return "Terms losing momentum in this sphere and selected references";
  }
  return "Terms losing momentum in this sphere";
}

function emergingSourceOptions() {
  return [
    { id: "all", label: "All" },
    { id: "sphere", label: "Sphere" },
    { id: "reference", label: "Reference profiles" },
  ];
}

function emergingPlatformOptions() {
  return [
    { id: "all", label: "All", icon: "A" },
    { id: "instagram", label: "Instagram", icon: "IG" },
    { id: "tiktok", label: "TikTok", icon: "TT" },
    { id: "youtube", label: "YouTube", icon: "YT" },
  ];
}

function emergingSourceLabel(source) {
  if (source === "reference") return "Reference profiles";
  if (source === "sphere") return "Sphere";
  return "All";
}

function selectedReferenceCreators() {
  const activeBoard = activeCustomTrendBoard();
  const selected = new Set(activeBoard?.referenceCreatorIds || []);
  return customTrendReferenceCreators.filter((creator) =>
    selected.has(creator.id),
  );
}

function referenceCreatorSuggestions() {
  const activeBoard = activeCustomTrendBoard();
  const selected = new Set(activeBoard?.referenceCreatorIds || []);
  const query = (activeBoard?.creatorSearch || "").trim().toLowerCase();
  if (!query) return [];
  const available = customTrendReferenceCreators.filter(
    (creator) => !selected.has(creator.id),
  );
  const matches = available.filter((creator) =>
    [
      creator.handle,
      creator.name,
      creator.platform,
      creator.category,
      creator.shortBio,
      ...(creator.topics || []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
  return matches.slice(0, 4);
}

function referenceCreatorPreviewMetrics(creator) {
  const lookalikeIds = new Set(creator.lookalikeCreatorIds || []);
  const profiles = fallbackCreatorResults.filter((profile) =>
    lookalikeIds.has(profile.id),
  );
  return {
    engagementRate: formattedAverage(
      profiles.map((profile) => profile.engagementRate),
    ),
    viewRate: formattedAverage(
      profiles.map((profile) => {
        const followers = Number(profile.followers);
        const avgViews = Number(profile.avgViews);
        if (!Number.isFinite(followers) || followers <= 0) return null;
        if (!Number.isFinite(avgViews)) return null;
        return (avgViews / followers) * 100;
      }),
    ),
  };
}

function formattedAverage(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return "-";
  const average =
    valid.reduce((total, value) => total + value, 0) / valid.length;
  return formatPercent(average);
}

function enrichCustomTrendTopics(baseTopics) {
  const seen = new Set();
  const topics = [];
  const pushTopic = (label, weight) => {
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    topics.push({ label, weight });
  };

  baseTopics.forEach((topic) => pushTopic(topic.label, topic.weight));
  const activeBoard = activeCustomTrendBoard();
  (activeBoard?.keywords || []).forEach((label, index) =>
    pushTopic(label, Math.max(50, 86 - index * 5)),
  );
  selectedReferenceCreators()
    .flatMap((creator) => creator.topics || [])
    .forEach((label, index) => pushTopic(label, Math.max(42, 78 - index * 4)));

  return topics.slice(0, 18);
}

function applyCustomStatInfluence(baseStats) {
  const references = selectedReferenceCreators();
  const activeBoard = activeCustomTrendBoard();
  const influence = references.reduce(
    (total, creator) => ({
      followers: total.followers + (creator.statInfluence.followers || 0),
      views: total.views + (creator.statInfluence.views || 0),
      engagement: total.engagement + (creator.statInfluence.engagement || 0),
    }),
    {
      followers: (activeBoard?.keywords.length || 0) * 1.5,
      views: 0,
      engagement: 0,
    },
  );
  const divisor = Math.max(1, references.length);
  const keywordLift = (activeBoard?.keywords.length || 0) * 0.4;

  return baseStats.map(([label, value, compare]) => {
    const lower = label.toLowerCase();
    if (lower.includes("follower")) {
      return [
        label,
        shiftCompactValue(value, (influence.followers / divisor) * 0.01),
        "custom set blend",
      ];
    }
    if (lower.includes("view")) {
      return [
        label,
        shiftCompactValue(
          value,
          (influence.views / divisor + keywordLift) * 0.01,
        ),
        "reference-weighted avg.",
      ];
    }
    if (lower.includes("rate")) {
      return [
        label,
        shiftPercentValue(
          value,
          influence.engagement / divisor + keywordLift / 10,
        ),
        "custom context",
      ];
    }
    if (lower.includes("engagement") || lower.includes("likes")) {
      return [
        label,
        shiftCompactValue(
          value,
          (influence.engagement / divisor + keywordLift) * 0.04,
        ),
        "custom context",
      ];
    }
    return [label, value, compare];
  });
}

function blendCustomAudience(baseAudience) {
  const references = selectedReferenceCreators();
  if (!references.length)
    return audienceForSearchOrTopic(
      customTrendSignals()[0] || currentTrendLabel(),
    );

  const audiences = [
    baseAudience,
    ...references.map((creator) => creator.audienceSkew),
  ];
  return {
    locations: blendLocations(audiences.map((audience) => audience.locations)),
    genderSplit: blendGenderSplit(
      audiences.map((audience) => audience.genderSplit),
    ),
    genderByAge: blendGenderByAge(
      audiences.map((audience) => audience.genderByAge),
    ),
  };
}

function blendLocations(locationSets) {
  const totals = new Map();
  locationSets.forEach((locations) => {
    locations.forEach(([country, value]) => {
      totals.set(
        country,
        (totals.get(country) || 0) + value / locationSets.length,
      );
    });
  });
  return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function blendGenderSplit(splits) {
  return ["Female", "Male", "Other"].reduce((result, key) => {
    result[key] = Number(
      (
        splits.reduce((sum, split) => sum + (Number(split[key]) || 0), 0) /
        splits.length
      ).toFixed(1),
    );
    return result;
  }, {});
}

function blendGenderByAge(groups) {
  const first = groups[0] || [];
  return first.map((row, index) => ({
    group: row.group,
    female: Number(
      (
        groups.reduce(
          (sum, group) => sum + (Number(group[index]?.female) || 0),
          0,
        ) / groups.length
      ).toFixed(1),
    ),
    male: Number(
      (
        groups.reduce(
          (sum, group) => sum + (Number(group[index]?.male) || 0),
          0,
        ) / groups.length
      ).toFixed(1),
    ),
  }));
}

function customTrendSignals() {
  const activeBoard = activeCustomTrendBoard();
  return [
    ...(activeBoard?.keywords || []),
    ...selectedReferenceCreators().flatMap((creator) => creator.topics || []),
  ];
}

function hasCustomTrendInputs() {
  const activeBoard = activeCustomTrendBoard();
  return Boolean(
    activeBoard &&
    (activeBoard.keywords.length || activeBoard.referenceCreatorIds.length),
  );
}

function activeCustomTrendBoard() {
  return state.customTrendBoards.find(
    (board) => board.id === state.activeTrendBoardId,
  );
}

function mergeCreators(creators) {
  const seen = new Set();
  return creators.filter((creator) => {
    if (seen.has(creator.id)) return false;
    seen.add(creator.id);
    return true;
  });
}

function platformLabel(platform) {
  const option = creatorResultPlatformOptions.find(
    (item) => item.id === platform,
  );
  return option ? option.label : platform;
}

function shiftCompactValue(value, ratio) {
  const number = compactValueToNumber(value);
  if (!Number.isFinite(number)) return value;
  return formatCompactNumber(number * (1 + ratio));
}

function shiftPercentValue(value, lift) {
  const number = Number(String(value).replace("%", ""));
  if (!Number.isFinite(number)) return value;
  return `${Math.max(0, number + lift).toFixed(1)}%`;
}

function compactValueToNumber(value) {
  const normalized = String(value).replace(",", "").trim();
  const number = parseFloat(normalized);
  if (!Number.isFinite(number)) return NaN;
  if (normalized.endsWith("M")) return number * 1000000;
  if (normalized.endsWith("K")) return number * 1000;
  return number;
}
