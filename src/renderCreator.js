import {
  brandAffinity,
  campaigns,
  contentItems,
  creatorTopicCloud,
  hashtags,
  interestAffinity,
  mentions,
  rankedCity,
  rankedCountry,
  rankedLanguage,
  statCards,
  trendCards,
} from "./data/creatorProfile.js";
import { parseK, segmentedButton } from "./helpers.js";
import {
  renderAffinityCard,
  renderAgeBarsCard,
  renderCampaignCard,
  renderCommonTopicCloud,
  renderDonutCard,
  renderEngagementCurveCard,
  renderFeeCard,
  renderRankCard,
  renderLookalikeCard,
  renderStatCard,
  renderTagCard,
  renderTrendCard,
  renderTrendSnapshotCard,
} from "./renderShared.js";
import { state } from "./state.js";

export function renderStatistics() {
  return `
    <section class="metrics-section">
      <div class="metrics-grid">
        ${statCards.map(([label, value, compare], index) => renderStatCard(label, value, compare, index)).join("")}
      </div>
    </section>

    <section class="audience-section">
      <div class="section-head audience-topbar">
        <div>
          <h2 class="section-title">Audience</h2>
          <div class="subtle-label">Detailed composition and benchmark context</div>
        </div>
        <div class="segmented" data-segment="audienceMetric">
          ${segmentedButton("followers", "Followers", state.audienceMetric)}
          ${segmentedButton("likes", "Likes", state.audienceMetric)}
        </div>
      </div>
      <div class="chart-grid">
        ${renderFeeCard()}
        ${renderDonutCard("Gender split", "62%", [
          ["Women", "62%", "#6f3cc3"],
          ["Men", "24%", "#3b82f6"],
          ["Other", "8%", "#1ca67a"],
          ["Unknown", "6%", "#f0b13f"],
        ])}
        ${renderDonutCard("Audience type", "71%", [
          ["Real audience", "71%", "#6f3cc3"],
          ["Mass followers", "16%", "#3b82f6"],
          ["Suspicious", "8%", "#1ca67a"],
          ["Influencers", "5%", "#f0b13f"],
        ])}
        ${renderAgeBarsCard()}
      </div>
    </section>

    <section>
      <div class="chart-grid">
        ${renderRankCard("Location by country", rankedCountry)}
        ${renderRankCard("Location by city", rankedCity)}
        ${renderRankCard("Language", rankedLanguage)}
        ${renderEngagementCurveCard()}
      </div>
    </section>

    <section>
      <div class="section-head">
        <h2 class="section-title">Collaborations</h2>
        <div class="segmented" data-segment="collaborations">
          ${segmentedButton("previous", "Previous", state.collaborations)}
          ${segmentedButton("ongoing", "Ongoing", state.collaborations)}
          ${segmentedButton("suggested", "Suggested", state.collaborations)}
        </div>
      </div>
      <div class="campaign-grid">
        ${campaigns[state.collaborations].map(renderCampaignCard).join("")}
      </div>
    </section>

    <section>
      <div class="chart-grid">
        ${renderAffinityCard("Audience brand affinity", brandAffinity)}
        ${renderRankCard(
          "Audience interest",
          interestAffinity.map(([name, value]) => [
            name,
            value,
            parseFloat(value),
          ]),
        )}
        ${renderLookalikeCard()}
        ${renderTrendSnapshotCard()}
      </div>
    </section>

    <section>
      <div class="section-head">
        <div>
          <h2 class="section-title">Influencer descriptive statistics</h2>
          <div class="subtle-label">Month-over-month movement across key profile signals</div>
        </div>
      </div>
      <div class="trend-grid">
        ${trendCards.map(renderTrendCard).join("")}
      </div>
    </section>

    <section>
      <div class="mini-card-grid">
        ${renderTagCard("Brand affinity", ["Adoore", "Caia Cosmetics", "Kicks", "NA-KD", "Arla Protein"])}
        ${renderTagCard("Interests", ["Fashion", "Skincare", "Interior", "Travel", "Nutrition"])}
        ${renderTagCard("Hashtags", hashtags)}
      </div>
    </section>

    <section>
      <div class="mini-card-grid">
        ${renderTagCard("Mentions", mentions)}
        ${renderTagCard("Recent themes", ["Morning routines", "Soft glam", "Office fits", "Cafe guides", "Beauty empties"])}
        ${renderTagCard("Placements", ["Reels", "Stories", "Posts", "Giveaway edits", "Brand link-outs"])}
      </div>
    </section>
  `;
}

export function renderOverview() {
  return `
    <section class="overview-hero">
      <div class="overview-card">
        <div class="card-toolbar">
          <div class="hero-identity">
            <div class="hero-avatar"></div>
            <div>
              <h2 class="hero-name">Andrea Norrman</h2>
              <div class="hero-country">Sweden · Stockholm</div>
              <div class="hero-badges">
                <span class="chip">Lifestyle</span>
                <span class="chip">Beauty</span>
                <span class="chip">Fashion</span>
              </div>
            </div>
          </div>
          <button class="secondary-button" type="button">Edit</button>
        </div>
      </div>
      <div class="overview-card">
        <div class="hero-side">
          <div class="meta-box"><span>Email</span><strong>andrea@creatormail.co</strong></div>
          <div class="meta-box"><span>Birth date</span><strong>1995-09-18</strong></div>
          <div class="meta-box"><span>Age</span><strong>30 years</strong></div>
          <div class="meta-box"><span>Manager</span><strong>Freelance / Direct</strong></div>
        </div>
      </div>
    </section>

    <section>
      ${renderCommonTopicCloud("Common Topic Cloud", creatorTopicCloud, {
        scope: "creator",
        note: "Recurring content themes across recent profile posts",
      })}
    </section>

    <section>
      <div class="section-head">
        <h2 class="section-title">Collaborations</h2>
        <div class="segmented" data-segment="collaborations">
          ${segmentedButton("previous", "Previous", state.collaborations)}
          ${segmentedButton("ongoing", "Ongoing", state.collaborations)}
          ${segmentedButton("suggested", "Suggested", state.collaborations)}
        </div>
      </div>
      <div class="overview-campaigns">
        ${campaigns[state.collaborations].map(renderCampaignCard).join("")}
      </div>
    </section>

    <section>
      <div class="section-head">
        <div>
          <h2 class="section-title">Social channels</h2>
          <div class="subtle-label">Connected channels and performance overview</div>
        </div>
      </div>
      ${renderChannelRow()}
    </section>
  `;
}

export function renderContent() {
  const items = filterContentItems();
  return `
    <section class="content-top">
      <div>
        <h2 class="section-title">Content</h2>
        <div class="subtle-label">Performance view across recent creator assets</div>
      </div>
      <div class="content-filters">
        <div class="segmented" data-segment="contentSort">
          ${segmentedButton("date", "Date", state.contentSort)}
          ${segmentedButton("impressions", "Impressions", state.contentSort)}
          ${segmentedButton("engagements", "Engagements", state.contentSort)}
        </div>
        <div class="segmented" data-segment="contentScope">
          ${segmentedButton("all", "All", state.contentScope)}
          ${segmentedButton("sponsored", "Sponsored", state.contentScope)}
        </div>
      </div>
    </section>
    <section>
      <div class="media-grid">
        ${items.map(renderMediaTile).join("")}
      </div>
    </section>
  `;
}

function renderChannelRow() {
  return `
    <article class="channel-row">
      <div class="channel-main">
        <div class="channel-icon">IG</div>
        <div>
          <div class="channel-name">@andreanorrman</div>
          <div class="channel-meta">
            <span class="tiny-pill">18 collaborations</span>
            <span class="tiny-pill">Primary channel</span>
          </div>
        </div>
      </div>
      <div class="channel-stat"><span>Followers</span><strong>124.7K</strong></div>
      <div class="channel-stat"><span>Avg. reel views</span><strong>63.4K</strong></div>
      <div class="channel-stat"><span>Reel view rate</span><strong>50.8%</strong></div>
      <div class="channel-stat"><span>Engagements</span><strong>7.8K</strong></div>
      <div class="channel-stat"><span>Eng. rate</span><strong>6.2%</strong></div>
      <div class="channel-stat"><span>Viewer eng. rate</span><strong>10.6%</strong></div>
      <div class="overview-mini-chart">
        <svg viewBox="0 0 160 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="18" width="20" height="42" rx="10" fill="#6F3CC3"/>
          <rect x="36" y="28" width="20" height="32" rx="10" fill="#3B82F6"/>
          <rect x="70" y="8" width="20" height="52" rx="10" fill="#6F3CC3"/>
          <rect x="98" y="20" width="20" height="40" rx="10" fill="#3B82F6"/>
          <rect x="128" y="34" width="20" height="26" rx="10" fill="#6F3CC3"/>
        </svg>
      </div>
      <div class="channel-actions">
        <button class="channel-action" type="button">☆</button>
        <button class="channel-action" type="button">⋯</button>
      </div>
    </article>
  `;
}

function renderMediaTile(item) {
  return `
    <article class="media-tile">
      <div class="media-cover" style="background:${item.gradient}">
        <div class="media-overlay"></div>
        <div class="media-topline">
          <span class="badge">${item.type}</span>
          <div style="display:flex; gap:8px;">
            ${item.brand ? `<span class="badge dark">${item.brand}</span>` : ""}
            <span class="badge">${item.date}</span>
          </div>
        </div>
        ${item.video ? `<div class="play-button"><div class="play-glyph">▶</div></div>` : ""}
        <div class="media-metrics">
          <div class="metric-chip"><span>Views</span><strong>${item.views}</strong></div>
          <div class="metric-chip"><span>Likes</span><strong>${item.likes}</strong></div>
          <div class="metric-chip"><span>Comments</span><strong>${item.comments}</strong></div>
        </div>
      </div>
      <div class="media-footer">
        <div class="media-title">${item.title}</div>
        <div class="media-subtitle">${item.subtitle}</div>
      </div>
    </article>
  `;
}

function filterContentItems() {
  let items = [...contentItems];

  if (state.contentScope === "sponsored") {
    items = items.filter((item) => item.sponsored);
  }

  if (state.contentSort === "impressions") {
    items.sort((a, b) => parseK(b.views) - parseK(a.views));
  } else if (state.contentSort === "engagements") {
    items.sort((a, b) => parseK(b.likes) - parseK(a.likes));
  }

  return items;
}
