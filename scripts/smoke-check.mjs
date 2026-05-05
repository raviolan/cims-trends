import {
  addCustomTrendReferenceCreator,
  addTrendTopic,
  clearCustomTrendBoard,
  createCustomTrendBoard,
  removeTrendTopic,
  selectTrendBoard,
  setActiveTopic,
  setCreatorView,
  setGlobalView,
  setTrendGenre,
  setTrendSearch,
} from "../src/actions.js";
import {
  renderContent,
  renderOverview,
  renderStatistics,
} from "../src/renderCreator.js";
import { renderTrendExploration } from "../src/renderTrendExploration.js";
import { state } from "../src/state.js";

const assertions = [];

function assert(name, condition) {
  assertions.push([name, Boolean(condition)]);
}

setGlobalView("trend-exploration");
setTrendGenre("Gaming");
const trend = renderTrendExploration();
assert("Trend Exploration renders", trend.includes("Trend statistics"));
assert("Creator matches renders", trend.includes("Creator matches"));
assert("Audience cards render", trend.includes("Audience behind this trend"));
assert("Topic editor renders for Trend", trend.includes("data-topic-add-form"));

addTrendTopic("genre:gaming", "lore analysis");
const editedTrend = renderTrendExploration();
assert("Added trend topic renders", editedTrend.includes("lore analysis"));

setActiveTopic("trend", "lore analysis");
removeTrendTopic("genre:gaming", "lore analysis");
assert(
  "Removing active trend topic clears active topic",
  state.activeTopic.label === "",
);

setTrendSearch("desk setup");
assert("Search mode can be set", state.trendMode === "search");
assert("Search trend renders", renderTrendExploration().includes("desk setup"));

setTrendGenre("Fashion & beauty");
createCustomTrendBoard();
const firstBoardId = state.activeTrendBoardId;
addTrendTopic(
  `custom:${firstBoardId}:genre:fashion & beauty`,
  "editorial glam",
);
addCustomTrendReferenceCreator(firstBoardId, "ref-nikkie");
const customTrend = renderTrendExploration();
assert(
  "Custom Trend Set board renders",
  customTrend.includes("Custom Trend Set"),
);
assert("Keyword cloud renders", customTrend.includes("Keyword cloud"));
assert("Reference creators render", customTrend.includes("Reference creators"));
assert("Custom keyword renders", customTrend.includes("editorial glam"));
assert("Reference creator renders", customTrend.includes("@nikkietutorials"));
setActiveTopic("trend", "editorial glam");
removeTrendTopic(
  `custom:${firstBoardId}:genre:fashion & beauty`,
  "editorial glam",
);
assert(
  "Custom keyword removal clears active topic",
  state.activeTopic.label === "",
);
clearCustomTrendBoard(firstBoardId);
assert(
  "Custom Trend Set clears board inputs",
  state.customTrendBoards[0].keywords.length === 0 &&
    state.customTrendBoards[0].referenceCreatorIds.length === 0,
);
createCustomTrendBoard();
const secondBoardId = state.activeTrendBoardId;
addTrendTopic(`custom:${secondBoardId}:genre:fashion & beauty`, "board two");
selectTrendBoard(firstBoardId);
assert(
  "First custom board keeps its own keywords",
  !renderTrendExploration().includes("board two"),
);
selectTrendBoard(secondBoardId);
assert(
  "Second custom board restores its keywords",
  renderTrendExploration().includes("board two"),
);
selectTrendBoard("main");
assert(
  "Main board uses standard layout",
  !renderTrendExploration().includes("Reference creators"),
);
createCustomTrendBoard();
createCustomTrendBoard();
createCustomTrendBoard();
createCustomTrendBoard();
assert("Custom board limit is enforced", state.customTrendBoards.length === 5);

setGlobalView("creator-profile");
setCreatorView("overview");
const overview = renderOverview();
assert("Creator overview renders", overview.includes("Andrea Norrman"));
assert(
  "Creator topic cloud is not editable",
  !overview.includes("data-topic-add-form"),
);
assert("Creator statistics renders", renderStatistics().includes("Audience"));
assert("Creator content renders", renderContent().includes("Content"));

const failures = assertions.filter(([, passed]) => !passed);
if (failures.length) {
  for (const [name] of failures) console.error(`Smoke check failed: ${name}`);
  process.exit(1);
}

console.log(`Smoke check passed (${assertions.length} assertions)`);
