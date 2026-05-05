import {
  addTrendTopic,
  removeTrendTopic,
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
