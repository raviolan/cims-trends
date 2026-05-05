import { creatorResultPlatformOptions } from "./data/creatorResults.js";
import { customTrendReferenceCreators } from "./data/customTrendSet.js";
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

export function selectTrendBoard(boardId) {
  if (
    boardId === "main" ||
    state.customTrendBoards.some((board) => board.id === boardId)
  ) {
    state.activeTrendBoardId = boardId;
  }
  clearActiveTopic("trend");
}

export function createCustomTrendBoard() {
  if (state.customTrendBoards.length >= 5) return;
  const nextNumber = nextCustomTrendBoardNumber();
  const board = {
    id: `custom-${Date.now()}-${nextNumber}`,
    name: `Custom Trend Set ${nextNumber}`,
    keywords: [],
    referenceCreatorIds: [],
    creatorSearch: "",
  };
  state.customTrendBoards = [...state.customTrendBoards, board];
  state.activeTrendBoardId = board.id;
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

export function addCustomTrendKeyword(boardId, rawLabel) {
  const board = customTrendBoardById(boardId);
  if (!board) return;
  const label = normalizeTopicLabel(rawLabel);
  if (!label) return;

  const lower = label.toLowerCase();
  if (board.keywords.some((keyword) => keyword.toLowerCase() === lower)) {
    return;
  }

  board.keywords = [...board.keywords, label].slice(-10);
  const edit = topicCloudEditForKey(customTrendContextKey(board.id));
  edit.removed = edit.removed.filter((item) => item.toLowerCase() !== lower);
}

export function removeCustomTrendKeyword(boardId, rawLabel) {
  const board = customTrendBoardById(boardId);
  if (!board) return;
  const label = normalizeTopicLabel(rawLabel);
  if (!label) return;

  board.keywords = board.keywords.filter(
    (keyword) => keyword.toLowerCase() !== label.toLowerCase(),
  );
  clearActiveTopicIfMatches("trend", label);
}

export function setCustomTrendCreatorSearch(boardId, query) {
  const board = customTrendBoardById(boardId);
  if (!board) return;
  board.creatorSearch = String(query || "").trim();
}

export function addCustomTrendReferenceCreator(boardId, creatorId) {
  const board = customTrendBoardById(boardId);
  if (!board) return;
  const exists = customTrendReferenceCreators.some(
    (creator) => creator.id === creatorId,
  );
  if (!exists || board.referenceCreatorIds.includes(creatorId)) {
    return;
  }

  board.referenceCreatorIds = [...board.referenceCreatorIds, creatorId].slice(
    -6,
  );
  board.creatorSearch = "";
}

export function removeCustomTrendReferenceCreator(boardId, creatorId) {
  const board = customTrendBoardById(boardId);
  if (!board) return;
  board.referenceCreatorIds = board.referenceCreatorIds.filter(
    (id) => id !== creatorId,
  );
}

export function clearCustomTrendBoard(boardId) {
  const board = customTrendBoardById(boardId);
  if (!board) return;
  board.keywords = [];
  board.referenceCreatorIds = [];
  board.creatorSearch = "";
  state.topicCloudEdits = Object.fromEntries(
    Object.entries(state.topicCloudEdits).filter(
      ([key]) => !key.startsWith(`custom:${board.id}:`),
    ),
  );
  clearActiveTopic("trend");
}

export function addTrendTopic(contextKey, rawLabel) {
  const activeBoard = activeCustomTrendBoard();
  if (activeBoard) {
    addCustomTrendKeyword(activeBoard.id, rawLabel);
    return;
  }

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

  const activeBoard = activeCustomTrendBoard();
  if (
    activeBoard &&
    activeBoard.keywords.some(
      (keyword) => keyword.toLowerCase() === label.toLowerCase(),
    )
  ) {
    removeCustomTrendKeyword(activeBoard.id, label);
    return;
  }

  const edit = topicCloudEditForKey(contextKey);
  const lower = label.toLowerCase();
  if (activeBoard) {
    if (!edit.removed.some((item) => item.toLowerCase() === lower)) {
      edit.removed = [...edit.removed, label];
    }
    clearActiveTopicIfMatches("trend", label);
    return;
  }

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

function customTrendContextKey(boardId) {
  const searched = state.trendSearch.trim().toLowerCase();
  const base =
    state.trendMode === "search" && searched
      ? `search:${searched}`
      : `genre:${state.selectedGenre.toLowerCase()}`;
  return `custom:${boardId}:${base}`;
}

function activeCustomTrendBoard() {
  return customTrendBoardById(state.activeTrendBoardId);
}

function customTrendBoardById(boardId) {
  return state.customTrendBoards.find((board) => board.id === boardId);
}

function nextCustomTrendBoardNumber() {
  const used = new Set(
    state.customTrendBoards
      .map((board) => Number(board.name.match(/(\d+)$/)?.[1]))
      .filter(Number.isFinite),
  );
  for (let index = 1; index <= 5; index += 1) {
    if (!used.has(index)) return index;
  }
  return state.customTrendBoards.length + 1;
}
