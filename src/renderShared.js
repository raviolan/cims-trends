function renderStatCard(label, value, compare, index) {
  return `
    <article class="stat-card">
      <div class="stat-head">
        <div class="metric-icon" aria-hidden="true">${metricIconFor(label, index)}</div>
        <div class="metric-label">${label}</div>
      </div>
      <div class="metric-value">${value}</div>
      <div class="metric-compare">${compare}</div>
    </article>
  `;
}

function renderCreatorMetricBox(label, value) {
  return `
    <div class="creator-metric-box">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderCreatorResultRow(profile, index) {
  const platform = creatorResultPlatformOptions.find((item) => item.id === profile.platform);
  return `
    <article class="creator-result-row">
      <div class="creator-result-rank">${index + 1}</div>
      <div class="creator-platform-icon">${platform ? platform.icon : "CH"}</div>
      <div class="creator-result-avatar ${profile.avatarTone || "neutral"}">${escapeHtml(profile.avatarInitials || profile.name.slice(0, 2))}</div>
      <div class="creator-result-identity">
        <div class="creator-result-handle">
          <strong>${escapeHtml(profile.handle)}</strong>
          <button class="external-link mini" type="button" aria-label="Open ${escapeAttribute(profile.handle)}">↗</button>
        </div>
        <div class="creator-result-name">${escapeHtml(profile.name)}</div>
        <div class="creator-result-bio">${escapeHtml(profile.bio)}</div>
        <div class="creator-result-meta">
          <span>${escapeHtml(profile.gender || "-")}</span>
          <span>${escapeHtml(profile.contact || "-")}</span>
          <span>Lookalike: ${escapeHtml(profile.lookalike || "-")}</span>
          <span>Last post: ${escapeHtml(profile.lastPost || "-")}</span>
        </div>
      </div>
      <div class="creator-result-metrics">
        ${renderCreatorMetricBox("Followers", formatCompactNumber(profile.followers))}
        ${renderCreatorMetricBox("Avg. Views", formatCompactNumber(profile.avgViews))}
        ${renderCreatorMetricBox("Eng.", formatCompactNumber(profile.engagements))}
        ${renderCreatorMetricBox("ER", formatPercent(profile.engagementRate))}
        ${renderCreatorMetricBox("Growth", formatPercent(profile.followersGrowth))}
      </div>
      <div class="creator-result-actions">
        <button class="creator-save-button ${profile.saved ? "active" : ""}" type="button" data-creator-save="${escapeAttribute(profile.id)}" aria-label="Save ${escapeAttribute(profile.handle)}">
          ${profile.saved ? "★" : "☆"}
        </button>
        <button class="primary-button creator-add-button" type="button" data-creator-add="${escapeAttribute(profile.id)}">Add</button>
      </div>
    </article>
  `;
}

function renderCampaignCard(campaign) {
  return `
    <article class="campaign-card">
      <div class="campaign-top">
        <div>
          <div class="campaign-id">${campaign.id}</div>
          <div class="campaign-title">${campaign.title}</div>
        </div>
        <div class="campaign-date">${campaign.range}</div>
      </div>
      <div class="chip-row">
        ${campaign.placements.map((chip) => `<span class="chip">${chip}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderFeeCard() {
  return `
    <article class="chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Fee estimations</h3>
          <div class="card-note">Indicative pricing by placement</div>
        </div>
      </div>
      <div class="fee-grid">
        <div class="fee-row"><span>Reel</span><strong>32 000 SEK</strong></div>
        <div class="fee-row"><span>Post</span><strong>18 500 SEK</strong></div>
        <div class="fee-row"><span>Story set</span><strong>12 400 SEK</strong></div>
      </div>
    </article>
  `;
}

function renderDonutCard(title, centerValue, items) {
  return `
    <article class="chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">${title}</h3>
          <div class="card-note">Estimated audience composition</div>
        </div>
      </div>
      <div class="donut-wrap">
        <div class="donut" style="--c1:${items[0][2]}; --c2:${items[1][2]}; --c3:${items[2][2]}; --c4:${items[3][2]};">
          <div class="donut-center">${centerValue}</div>
        </div>
        <div class="legend">
          ${items
            .map(
              ([label, value, color]) => `
                <div class="legend-item">
                  <span><span class="legend-mark" style="background:${color}"></span> ${label}</span>
                  <strong>${value}</strong>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </article>
  `;
}

function renderAgeBarsCard() {
  const labels = ["13-17", "18-24", "25-34", "35-44", "45+"];
  const followers = [18, 72, 104, 64, 28];
  const likes = [10, 48, 86, 40, 16];
  return `
    <article class="chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Gender split by age groups</h3>
          <div class="card-note">${state.audienceMetric === "followers" ? "Followers" : "Likes"} distribution</div>
        </div>
      </div>
      <div class="bar-visual">
        ${labels
          .map(
            (label, index) => `
              <div class="bar-group">
                <div class="bar-stack">
                  <div class="bar purple" style="height:${followers[index]}px"></div>
                  <div class="bar blue" style="height:${likes[index]}px"></div>
                </div>
                <div class="bar-label">${label}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderRankCard(title, rows) {
  return `
    <article class="chart-card">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">${title}</h3>
          <div class="card-note">Top ranked audience segments</div>
        </div>
        <button class="show-more" type="button">Show more</button>
      </div>
      <div class="rank-list">
        ${rows
          .map(
            ([label, value, width]) => `
              <div class="rank-row">
                <div class="rank-head">
                  <strong>${label}</strong>
                  <span class="muted">${value}</span>
                </div>
                <div class="rank-track">
                  <div class="rank-fill" style="width:${Math.min(width, 100)}%"></div>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderEngagementCurveCard() {
  return `
    <article class="chart-card">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Engagement rate comparison</h3>
          <div class="card-note">Benchmark curve across creator scale</div>
        </div>
      </div>
      <div class="curve-card-body">
        <svg class="curve-svg" viewBox="0 0 320 190" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="curveStroke" x1="10" y1="20" x2="300" y2="160" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8A60DB"/>
              <stop offset="1" stop-color="#6F3CC3"/>
            </linearGradient>
          </defs>
          <line x1="28" y1="22" x2="28" y2="164" stroke="#E5DFF0" stroke-width="2"/>
          <line x1="28" y1="164" x2="300" y2="164" stroke="#E5DFF0" stroke-width="2"/>
          <path d="M32 142C72 64 124 54 162 86C198 118 240 122 292 64" stroke="url(#curveStroke)" stroke-width="5" stroke-linecap="round"/>
          <line x1="212" y1="42" x2="212" y2="164" stroke="#CFC4E5" stroke-width="2" stroke-dasharray="5 7"/>
          <circle cx="212" cy="112" r="13" fill="#fff" stroke="#6F3CC3" stroke-width="4"/>
          <circle cx="212" cy="112" r="5" fill="#6F3CC3"/>
          <rect x="182" y="22" width="63" height="26" rx="13" fill="#F1ECFA"/>
          <text x="193" y="39" fill="#6F3CC3" font-family="Inter, sans-serif" font-size="12" font-weight="700">Andrea</text>
          <text x="24" y="182" fill="#8C859B" font-family="Inter, sans-serif" font-size="11">0.5%</text>
          <text x="122" y="182" fill="#8C859B" font-family="Inter, sans-serif" font-size="11">2.0%</text>
          <text x="235" y="182" fill="#8C859B" font-family="Inter, sans-serif" font-size="11">4.0%</text>
        </svg>
      </div>
    </article>
  `;
}

function renderAffinityCard(title, rows) {
  return `
    <article class="chart-card">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">${title}</h3>
          <div class="card-note">Observed audience overlap</div>
        </div>
        <button class="show-more" type="button">Show more</button>
      </div>
      <div class="rank-list">
        ${rows
          .map(
            ([label, value], index) => `
              <div class="rank-row">
                <div class="rank-head">
                  <strong>${label}</strong>
                  <span class="muted">${value}</span>
                </div>
                <div class="rank-track">
                  <div class="rank-fill" style="width:${78 - index * 12}%"></div>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderLookalikeCard() {
  return `
    <article class="chart-card">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Followers lookalike</h3>
          <div class="card-note">Adjacent creators with similar audience shape</div>
        </div>
      </div>
      <div class="lookalike-list">
        ${lookalikes
          .map(
            ([name, handle, followers, rate, engagements]) => `
              <div class="lookalike-row">
                <div class="lookalike-person">
                  <div class="mini-avatar"></div>
                  <div class="person-text">
                    <div class="person-name">${name}</div>
                    <div class="person-handle">${handle}</div>
                  </div>
                </div>
                <div><span class="muted">Followers</span><br /><strong>${followers}</strong></div>
                <div><span class="muted">ER</span><br /><strong>${rate}</strong></div>
                <div><span class="muted">Eng.</span><br /><strong>${engagements}</strong></div>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderTrendSnapshotCard() {
  return `
    <article class="chart-card">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">Audience health</h3>
          <div class="card-note">Blend of retention and affinity signals</div>
        </div>
      </div>
      <div class="fee-grid">
        <div class="fee-row"><span>Real audience</span><strong>71%</strong></div>
        <div class="fee-row"><span>Avg. story completion</span><strong>61%</strong></div>
        <div class="fee-row"><span>Brand fit score</span><strong>8.4 / 10</strong></div>
      </div>
    </article>
  `;
}

function renderTrendCard(card) {
  const points = sparkLine(card.points);
  return `
    <article class="chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">${card.title}</h3>
          <div class="trend-note">${card.note}</div>
        </div>
      </div>
      <div class="trend-value">${card.value}</div>
      <div style="height:96px">
        <svg class="spark-svg" viewBox="0 0 240 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${points.area}" fill="${card.color}18"/>
          <path d="${points.line}" stroke="${card.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </article>
  `;
}

function renderTagCard(title, items) {
  return `
    <article class="chart-card compact">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">${title}</h3>
          <div class="card-note">Signal clusters and labels</div>
        </div>
      </div>
      <div class="tag-cloud">
        ${items.map((item) => `<span class="tag">${item}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderCommonTopicCloud(title, topics, options = {}) {
  const scope = options.scope || "default";
  const note = options.note || "Common topic signals";
  const editable = Boolean(options.editable);
  const removable = Boolean(options.removable);
  const contextKey = options.contextKey || "";
  return `
    <article class="chart-card topic-cloud-card ${editable ? "editable" : ""}">
      <div class="card-toolbar">
        <div>
          <h3 class="card-title">${escapeHtml(title)}</h3>
          <div class="card-note">${escapeHtml(note)}</div>
        </div>
        ${
          editable
            ? `
              <form class="topic-cloud-editor" data-topic-add-form data-topic-context="${escapeAttribute(contextKey)}">
                <input class="topic-cloud-input" name="topicCloudWord" type="text" placeholder="Add keyword" />
                <button class="primary-button topic-cloud-add" type="submit">Add</button>
              </form>
            `
            : ""
        }
      </div>
      <div class="topic-cloud" aria-label="${escapeAttribute(title)}">
        ${topics
          .map((topic) => {
            const scale = topicScale(topic.weight);
            const active = state.activeTopic.scope === scope && state.activeTopic.label === topic.label;
            const wordButton = `
              <button
                class="topic-word ${active ? "active" : ""}"
                type="button"
                data-topic-scope="${escapeAttribute(scope)}"
                data-topic="${escapeAttribute(topic.label)}"
                style="--topic-scale:${scale};"
              >${escapeHtml(topic.label)}</button>
            `;
            if (!removable) return wordButton;
            return `
              <span class="topic-word-wrap" style="--topic-scale:${scale};">
                ${wordButton}
                <button class="topic-word-remove" type="button" data-remove-topic="${escapeAttribute(topic.label)}" data-topic-context="${escapeAttribute(contextKey)}" aria-label="Remove ${escapeAttribute(topic.label)}">x</button>
              </span>
            `;
          })
          .join("")}
      </div>
    </article>
  `;
}
