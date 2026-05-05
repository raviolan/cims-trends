import {
  addTrendTopic,
  applyCreatorSuggestion,
  clearCreatorResultControls,
  removeCreatorResultFilter,
  removeTrendTopic,
  setActiveTopic,
  setCreatorResultSearch,
  setCreatorResultSort,
  setCreatorView,
  setGlobalView,
  setSegmentValue,
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
}

function update(action) {
  action();
  rerender();
}
