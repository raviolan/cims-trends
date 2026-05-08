import {
  addCustomTrendReferenceCreator,
  addTrendTopic,
  clearCustomTrendBoard,
  clearDecliningTrendFilters,
  clearEmergingKeywordFilters,
  createCustomTrendBoard,
  renameCustomTrendBoard,
  removeTrendTopic,
  selectTrendBoard,
  setActiveTopic,
  setCreatorView,
  setCustomTrendCreatorSearch,
  setDecliningTrendPlatform,
  setDecliningTrendSearch,
  setDecliningTrendSource,
  setEmergingKeywordSearch,
  setGlobalView,
  setTrendGenre,
  setTrendSearch,
} from "../src/actions.js";
import { readFileSync } from "node:fs";
import {
  renderContent,
  renderOverview,
  renderStatistics,
} from "../src/renderCreator.js";
import { renderContextRail, renderContextTopBar } from "../src/renderShell.js";
import { renderTrendExploration } from "../src/renderTrendExploration.js";
import { state } from "../src/state.js";

const assertions = [];
const trendExplorationCss = readFileSync(
  new URL("../styles/trend-exploration.css", import.meta.url),
  "utf8",
);

function assert(name, condition) {
  assertions.push([name, Boolean(condition)]);
}

setGlobalView("trend-exploration");
const demoBoard = state.customTrendBoards.find(
  (board) => board.id === "demo-breakfast",
);
assert("Initial state includes demo board", Boolean(demoBoard));
assert("Demo board is active initially", state.activeTrendBoardId === "demo-breakfast");
assert("Demo board uses breakfast keywords", demoBoard?.keywords.includes("protein breakfast"));
assert(
  "Demo board uses selected reference creators",
  demoBoard?.referenceCreatorIds.includes("ref-leanne") &&
    demoBoard?.referenceCreatorIds.includes("ref-mayafood"),
);
const demoTrend = renderTrendExploration();
const demoRail = renderContextRail();
const demoTopBar = renderContextTopBar();
assert("Demo board renders in Focus rail", demoRail.includes("Breakfast"));
assert(
  "Demo board name renders as editable title",
  demoTopBar.includes("custom-board-title-input") &&
    demoTopBar.includes('value="Breakfast"'),
);
assert("Demo breakfast keyword renders", demoTrend.includes("protein breakfast"));
assert(
  "Demo reference creators render",
  demoTrend.includes("@leannefitness") || demoTrend.includes("@mayaskitchen"),
);
assert(
  "Demo selected creators render",
  demoTrend.includes("@leannefitness") && demoTrend.includes("@mayaskitchen"),
);
assert(
  "Default unselected reference suggestions are hidden",
  !demoTrend.includes("@nikkietutorials"),
);
assert("Selected creator rows include Avg. ER", demoTrend.includes("Avg. ER"));
assert(
  "Selected creator rows include Avg. view rate",
  demoTrend.includes("Avg. view rate"),
);
assert(
  "Newly trending keywords section renders",
  demoTrend.includes("Newly trending keywords"),
);
assert(
  "Keyword insight wrapper renders",
  demoTrend.includes("trend-keyword-insights"),
);
assert(
  "Both keyword insight lists render",
  (demoTrend.match(/data-keyword-insight-list=/g) || []).length === 2,
);
assert(
  "Keyword insight lists use internal scroll styling",
  trendExplorationCss.includes(".keyword-insight-list") &&
    trendExplorationCss.includes("overflow-y: auto") &&
    trendExplorationCss.includes("max-height: 380px"),
);
assert("Declining trends renders", demoTrend.includes("Declining trends"));
assert(
  "Declining controls render",
  demoTrend.includes("data-declining-trend-search") &&
    demoTrend.includes('data-declining-trend-source="reference"') &&
    demoTrend.includes('data-declining-trend-platform="tiktok"'),
);
assert(
  "Breakfast demo renders food emerging keyword",
  demoTrend.includes("freezer breakfast prep"),
);
assert(
  "Breakfast demo renders declining food trend",
  demoTrend.includes("whipped coffee"),
);
assert(
  "Emerging source filters render",
  demoTrend.includes('data-emerging-keyword-source="reference"'),
);
assert(
  "Reference emerging keywords render for breakfast custom board",
  demoTrend.includes("grocery haul breakfast"),
);
setDecliningTrendSearch("whipped");
const searchedDecliningTrends = renderTrendExploration();
assert(
  "Declining trend search filters results",
  searchedDecliningTrends.includes("whipped coffee") &&
    !searchedDecliningTrends.includes("overnight oats jar"),
);
clearDecliningTrendFilters();
setDecliningTrendSource("reference");
const referenceDecliningTrends = renderTrendExploration();
assert(
  "Declining source filter shows reference trends",
  referenceDecliningTrends.includes("cold brew breakfast") &&
    !referenceDecliningTrends.includes("whipped coffee"),
);
setDecliningTrendPlatform("tiktok");
const tiktokDecliningTrends = renderTrendExploration();
assert(
  "Declining platform filter applies",
  tiktokDecliningTrends.includes("cold brew breakfast") &&
    !tiktokDecliningTrends.includes("meal prep containers"),
);
clearDecliningTrendFilters();
setEmergingKeywordSearch("pancakes");
const searchedEmergingKeywords = renderTrendExploration();
assert(
  "Emerging keyword search filters results",
  searchedEmergingKeywords.includes("protein pancakes") &&
    !searchedEmergingKeywords.includes("coffee protein shake"),
);
clearEmergingKeywordFilters();
addTrendTopic("custom:demo-breakfast:genre:food", "protein pancakes");
assert(
  "Adding emerging keyword uses custom keyword state",
  demoBoard?.keywords.includes("protein pancakes"),
);
renameCustomTrendBoard("demo-breakfast", "Morning Meals");
assert(
  "Renaming demo board updates state",
  demoBoard?.name === "Morning Meals",
);
assert("Focus rail renders renamed board", renderContextRail().includes("Morning Meals"));
assert(
  "Topbar renders renamed board title",
  renderContextTopBar().includes('value="Morning Meals"'),
);
assert(
  "Custom context uses renamed board",
  renderTrendExploration().includes("Morning Meals:"),
);
renameCustomTrendBoard("demo-breakfast", "   ");
assert(
  "Whitespace-only rename does not blank board name",
  demoBoard?.name === "Morning Meals",
);
clearCustomTrendBoard("demo-breakfast");
assert(
  "Clearing selected creators shows helper text",
  renderTrendExploration().includes(
    "Search and add creators to shape this custom set.",
  ),
);
setCustomTrendCreatorSearch("demo-breakfast", "nikkie");
const searchedReferenceCreators = renderTrendExploration();
assert(
  "Reference creator search shows addable result",
  searchedReferenceCreators.includes("@nikkietutorials") &&
    searchedReferenceCreators.includes('data-custom-reference-add="ref-nikkie"'),
);

selectTrendBoard("main");
setTrendGenre("Food");
clearEmergingKeywordFilters();
assert(
  "Main board does not show reference-only emerging entries",
  !renderTrendExploration().includes("protein breakfast bowl"),
);
assert(
  "Main board does not show reference-only declining entries",
  !renderTrendExploration().includes("cold brew breakfast"),
);
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
const firstBoard = state.customTrendBoards.find(
  (board) => board.id === firstBoardId,
);
assert(
  "Custom Trend Set clears board inputs",
  firstBoard?.keywords.length === 0 &&
    firstBoard?.referenceCreatorIds.length === 0,
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
