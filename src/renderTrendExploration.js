import { topicCloudEditForKey } from "./actions.js";
import {
  creatorResultFilters,
  creatorResultPlatformOptions,
  creatorResultsByGenre,
  fallbackCreatorResults,
} from "./data/creatorResults.js";
import {
  fallbackTrendAudience,
  relatedTopicsForSearch,
  statsForSearch,
  trendAudienceByGenre,
  trendGenres,
  trendStatsByGenre,
  trendTopicCloudByGenre,
} from "./data/trendExploration.js";
import {
  escapeAttribute,
  escapeHtml,
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
  if (state.trendMode === "search" && searched) return `search:${searched}`;
  return `genre:${state.selectedGenre.toLowerCase()}`;
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
  if (state.trendMode === "search" && searched)
    return relatedTopicsForSearch(searched);
  return (
    trendTopicCloudByGenre[state.selectedGenre] ||
    trendTopicCloudByGenre[trendGenres[0]]
  );
}

function currentTrendStats() {
  const searched = state.trendSearch.trim();
  if (state.trendMode === "search" && searched) return statsForSearch(searched);
  return (
    trendStatsByGenre[state.selectedGenre] || trendStatsByGenre[trendGenres[0]]
  );
}
