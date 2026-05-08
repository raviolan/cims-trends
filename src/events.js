import {
  addTrendTopic,
  addCustomTrendReferenceCreator,
  applyCreatorSuggestion,
  clearCustomTrendBoard,
  clearCreatorResultControls,
  clearDecliningTrendFilters,
  clearEmergingKeywordFilters,
  createCustomTrendBoard,
  renameCustomTrendBoard,
  removeCustomTrendReferenceCreator,
  removeCreatorResultFilter,
  removeTrendTopic,
  setActiveTopic,
  setCreatorResultSearch,
  setCreatorResultSort,
  setCreatorView,
  setCustomTrendCreatorSearch,
  setDecliningTrendPlatform,
  setDecliningTrendSearch,
  setDecliningTrendSource,
  setEmergingKeywordPlatform,
  setEmergingKeywordSearch,
  setEmergingKeywordSource,
  setGlobalView,
  setSegmentValue,
  selectTrendBoard,
  setTrendGenre,
  setTrendSearch,
  toggleAddedCreator,
  toggleCreatorResultFilter,
  toggleCreatorResultPlatform,
  toggleSavedCreator,
} from "./actions.js";
import { currentTrendTopicContextKey } from "./renderTrendExploration.js";

let rerender = () => {};

export function bindEvents(appRoot, render) {
  rerender = render;
  appRoot.addEventListener("click", handleClick);
  appRoot.addEventListener("submit", handleSubmit);
}

function handleClick(event) {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.globalView)
    return update(() => setGlobalView(target.dataset.globalView));
  if (target.dataset.view)
    return update(() => setCreatorView(target.dataset.view));
  if (target.dataset.genre)
    return update(() => setTrendGenre(target.dataset.genre));
  if (target.dataset.trendBoard)
    return update(() => selectTrendBoard(target.dataset.trendBoard));
  if (target.dataset.createTrendBoard !== undefined)
    return update(createCustomTrendBoard);
  if (target.dataset.topic)
    return update(() =>
      setActiveTopic(
        target.dataset.topicScope || "default",
        target.dataset.topic,
      ),
    );
  if (target.dataset.removeTopic) {
    event.stopPropagation();
    return update(() =>
      removeTrendTopic(
        target.dataset.topicContext || currentTrendTopicContextKey(),
        target.dataset.removeTopic,
      ),
    );
  }
  if (target.dataset.creatorPlatform)
    return update(() =>
      toggleCreatorResultPlatform(target.dataset.creatorPlatform),
    );
  if (target.dataset.creatorFilter)
    return update(() =>
      toggleCreatorResultFilter(target.dataset.creatorFilter),
    );
  if (target.dataset.creatorFilterRemove)
    return update(() =>
      removeCreatorResultFilter(target.dataset.creatorFilterRemove),
    );
  if (target.dataset.creatorResultsClear !== undefined)
    return update(clearCreatorResultControls);
  if (target.dataset.creatorSuggestion)
    return update(() =>
      applyCreatorSuggestion(target.dataset.creatorSuggestion),
    );
  if (target.dataset.creatorSave)
    return update(() => toggleSavedCreator(target.dataset.creatorSave));
  if (target.dataset.creatorAdd)
    return update(() => toggleAddedCreator(target.dataset.creatorAdd));
  if (target.dataset.customReferenceAdd)
    return update(() =>
      addCustomTrendReferenceCreator(
        target.dataset.customBoard,
        target.dataset.customReferenceAdd,
      ),
    );
  if (target.dataset.customReferenceRemove) {
    event.stopPropagation();
    return update(() =>
      removeCustomTrendReferenceCreator(
        target.dataset.customBoard,
        target.dataset.customReferenceRemove,
      ),
    );
  }
  if (target.dataset.customTrendClear !== undefined)
    return update(() => clearCustomTrendBoard(target.dataset.customBoard));
  if (target.dataset.emergingKeywordSource)
    return update(() =>
      setEmergingKeywordSource(target.dataset.emergingKeywordSource),
    );
  if (target.dataset.emergingKeywordPlatform)
    return update(() =>
      setEmergingKeywordPlatform(target.dataset.emergingKeywordPlatform),
    );
  if (target.dataset.emergingKeywordClear !== undefined)
    return update(clearEmergingKeywordFilters);
  if (target.dataset.decliningTrendSource)
    return update(() =>
      setDecliningTrendSource(target.dataset.decliningTrendSource),
    );
  if (target.dataset.decliningTrendPlatform)
    return update(() =>
      setDecliningTrendPlatform(target.dataset.decliningTrendPlatform),
    );
  if (target.dataset.decliningTrendClear !== undefined)
    return update(clearDecliningTrendFilters);
  if (target.dataset.emergingKeywordAdd)
    return update(() =>
      addTrendTopic(
        target.dataset.topicContext || currentTrendTopicContextKey(),
        target.dataset.emergingKeywordAdd,
      ),
    );

  const segmentItem = target.closest("[data-segment] [data-value]");
  if (segmentItem) {
    const segment = segmentItem.closest("[data-segment]");
    const key = segment.dataset.segment;
    const value = segmentItem.dataset.value;
    return update(() => {
      if (key === "creatorResultSort") setCreatorResultSort(value);
      else setSegmentValue(key, value);
    });
  }
}

function handleSubmit(event) {
  const form = event.target;
  if (form.matches("[data-trend-search]")) {
    event.preventDefault();
    return update(() => setTrendSearch(new FormData(form).get("trendSearch")));
  }

  if (form.matches("[data-emerging-keyword-search]")) {
    event.preventDefault();
    return update(() =>
      setEmergingKeywordSearch(
        new FormData(form).get("emergingKeywordSearch"),
      ),
    );
  }

  if (form.matches("[data-declining-trend-search]")) {
    event.preventDefault();
    return update(() =>
      setDecliningTrendSearch(new FormData(form).get("decliningTrendSearch")),
    );
  }

  if (form.matches("[data-topic-add-form]")) {
    event.preventDefault();
    return update(() =>
      addTrendTopic(
        form.dataset.topicContext || currentTrendTopicContextKey(),
        new FormData(form).get("topicCloudWord"),
      ),
    );
  }

  if (form.matches("[data-creator-result-search]")) {
    event.preventDefault();
    return update(() =>
      setCreatorResultSearch(new FormData(form).get("creatorResultSearch")),
    );
  }

  if (form.matches("[data-custom-board-rename]")) {
    event.preventDefault();
    return update(() =>
      renameCustomTrendBoard(
        form.dataset.customBoard,
        new FormData(form).get("customTrendBoardName"),
      ),
    );
  }

  if (form.matches("[data-custom-reference-search]")) {
    event.preventDefault();
    return update(() =>
      setCustomTrendCreatorSearch(
        form.dataset.customBoard,
        new FormData(form).get("customTrendCreatorSearch"),
      ),
    );
  }
}

function update(action) {
  action();
  rerender();
}
