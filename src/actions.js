import { creatorResultPlatformOptions } from "./data/creatorResults.js";
import {
  relatedTopicsForSearch,
  trendGenres,
  trendTopicCloudByGenre,
} from "./data/trendExploration.js";
import { normalizeTopicLabel } from "./helpers.js";
import { state } from "./state.js";

export function setGlobalView(view) {
  state.globalView = view;
}

export function setCreatorView(view) {
  state.view = view;
}

export function setSegmentValue(key, value) {
  state[key] = value;
}

export function setTrendGenre(genre) {
  state.trendMode = "genre";
  state.selectedGenre = genre;
  clearActiveTopic("trend");
}

export function setTrendSearch(query) {
  state.trendSearch = String(query || "").trim();
  state.trendMode = state.trendSearch ? "search" : "genre";
  clearActiveTopic("trend");
}

export function setActiveTopic(scope, label) {
  state.activeTopic = { scope: scope || "default", label: label || "" };
}

export function clearActiveTopic(scope) {
  state.activeTopic = { scope, label: "" };
}

export function clearActiveTopicIfMatches(scope, label) {
  if (
    state.activeTopic.scope === scope &&
    state.activeTopic.label.toLowerCase() === String(label).toLowerCase()
  ) {
    clearActiveTopic(scope);
  }
}

export function setCreatorResultSearch(query) {
  state.creatorResultSearch = String(query || "").trim();
}

export function toggleCreatorResultPlatform(platform) {
  state.creatorResultPlatforms = state.creatorResultPlatforms.includes(platform)
    ? state.creatorResultPlatforms.filter((item) => item !== platform)
    : [...state.creatorResultPlatforms, platform];
}

export function setCreatorResultSort(sortKey) {
  state.creatorResultSort = sortKey;
}

export function toggleCreatorResultFilter(filterName) {
  state.creatorResultFilters = state.creatorResultFilters.includes(filterName)
    ? state.creatorResultFilters.filter((item) => item !== filterName)
    : [...state.creatorResultFilters, filterName];
}

export function removeCreatorResultFilter(filterName) {
  state.creatorResultFilters = state.creatorResultFilters.filter(
    (item) => item !== filterName,
  );
}

export function clearCreatorResultControls() {
  state.creatorResultSearch = "";
  state.creatorResultFilters = [];
  state.creatorResultPlatforms = creatorResultPlatformOptions.map(
    (platform) => platform.id,
  );
  state.creatorResultSort = "engagements";
}

export function applyCreatorSuggestion(suggestion) {
  setCreatorResultSearch(suggestion);
}

export function toggleSavedCreator(id) {
  state.savedCreatorIds = state.savedCreatorIds.includes(id)
    ? state.savedCreatorIds.filter((item) => item !== id)
    : [...state.savedCreatorIds, id];
}

export function toggleAddedCreator(id) {
  state.addedCreatorIds = state.addedCreatorIds.includes(id)
    ? state.addedCreatorIds.filter((item) => item !== id)
    : [...state.addedCreatorIds, id];
}

export function addTrendTopic(contextKey, rawLabel) {
  const label = normalizeTopicLabel(rawLabel);
  if (!label) return;

  const edit = topicCloudEditForKey(contextKey);
  const lower = label.toLowerCase();
  const baseMatch = baseTrendTopicsForCurrentContext().find(
    (topic) => topic.label.toLowerCase() === lower,
  );

  edit.removed = edit.removed.filter((item) => item.toLowerCase() !== lower);
  if (!baseMatch && !edit.added.some((item) => item.toLowerCase() === lower)) {
    edit.added = [...edit.added, label].slice(-6);
  }
}

export function removeTrendTopic(contextKey, rawLabel) {
  const label = normalizeTopicLabel(rawLabel);
  if (!label) return;

  const edit = topicCloudEditForKey(contextKey);
  const lower = label.toLowerCase();
  const baseMatch = baseTrendTopicsForCurrentContext().some(
    (topic) => topic.label.toLowerCase() === lower,
  );

  edit.added = edit.added.filter((item) => item.toLowerCase() !== lower);
  if (baseMatch && !edit.removed.some((item) => item.toLowerCase() === lower)) {
    edit.removed = [...edit.removed, label];
  }

  clearActiveTopicIfMatches("trend", label);
}

export function topicCloudEditForKey(key) {
  if (!state.topicCloudEdits[key]) {
    state.topicCloudEdits[key] = { added: [], removed: [] };
  }
  return state.topicCloudEdits[key];
}

function baseTrendTopicsForCurrentContext() {
  const searched = state.trendSearch.trim();
  if (state.trendMode === "search" && searched)
    return relatedTopicsForSearch(searched);
  return (
    trendTopicCloudByGenre[state.selectedGenre] ||
    trendTopicCloudByGenre[trendGenres[0]]
  );
}
