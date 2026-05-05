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

      <div class="reference-creator-suggestions">
        ${
          suggestions.length
            ? suggestions.map(renderReferenceCreatorSuggestion).join("")
            : renderReferenceCreatorEmptyState()
        }
      </div>

      <div class="selected-reference-creators">
        ${
          selected.length
            ? selected.map(renderSelectedReferenceCreator).join("")
            : `<div class="reference-empty">No reference creators selected</div>`
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
  return `
    <article class="selected-reference-creator">
      <div class="creator-result-avatar ${creator.avatarTone}">${escapeHtml(creator.avatarInitials)}</div>
      <div class="selected-reference-copy">
        <strong>${escapeHtml(creator.handle)}</strong>
        <span>${escapeHtml(platformLabel(creator.platform))} · ${escapeHtml(creator.name)}</span>
        <p>${escapeHtml(creator.category || creator.shortBio)}</p>
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
  const available = customTrendReferenceCreators.filter(
    (creator) => !selected.has(creator.id),
  );
  const matches = query
    ? available.filter((creator) =>
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
      )
    : available;
  return matches.slice(0, 4);
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
