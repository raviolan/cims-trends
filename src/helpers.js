function metricIconFor(label, index) {
  const name = label.toLowerCase();
  const icon = (body) => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      ${body}
    </svg>
  `;
  const stroke = `stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"`;
  const fill = `fill="currentColor"`;

  if (name.includes("followers")) {
    return icon(`<path ${stroke} d="M8.5 11.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path ${stroke} d="M3.5 19c.5-3.1 2.3-4.8 5-4.8s4.5 1.7 5 4.8"/><path ${stroke} d="M16.5 10.7a2.3 2.3 0 1 0 0-4.6"/><path ${stroke} d="M15.5 14.2c2.5.1 4.1 1.7 4.6 4.3"/>`);
  }

  if (name.includes("view")) {
    return icon(`<path ${stroke} d="M2.8 12s3.4-6 9.2-6 9.2 6 9.2 6-3.4 6-9.2 6-9.2-6-9.2-6Z"/><circle ${stroke} cx="12" cy="12" r="2.8"/>`);
  }

  if (name.includes("rate")) {
    return icon(`<path ${stroke} d="M19 5 5 19"/><circle ${fill} cx="7" cy="7" r="2.4"/><circle ${fill} cx="17" cy="17" r="2.4"/>`);
  }

  if (name.includes("engagement")) {
    return icon(`<path ${fill} d="M8.2 4.8c-2.7 0-4.9 2-4.9 4.8 0 5 8.7 9.6 8.7 9.6s8.7-4.6 8.7-9.6c0-2.8-2.2-4.8-4.9-4.8-1.6 0-3 1-3.8 2.2-.8-1.2-2.2-2.2-3.8-2.2Z"/>`);
  }

  if (name.includes("likes")) {
    return icon(`<path ${fill} d="M7.9 21H5a2 2 0 0 1-2-2v-7.1a2 2 0 0 1 2-2h2.3l3.3-6.4c.4-.7 1.4-.7 1.9-.1.7.9.8 2.1.4 3.2L12 9.1h5.9c1.8 0 3.1 1.7 2.6 3.5l-1.4 5.2A4.3 4.3 0 0 1 15 21H7.9Z"/>`);
  }

  if (name.includes("comm")) {
    return icon(`<path ${fill} d="M12 4C6.9 4 3 7.3 3 11.4c0 2.5 1.5 4.7 3.8 6L6 21l4-2.3c.6.1 1.3.2 2 .2 5.1 0 9-3.3 9-7.5S17.1 4 12 4Z"/>`);
  }

  if (name.includes("share")) {
    return icon(`<path ${fill} d="M21 3.7 3.9 10.4c-1.2.5-1.2 2.1.1 2.4l6.1 1.5 1.5 6.1c.3 1.3 2 1.4 2.5.2L21 3.7Z"/><path stroke="#fff" stroke-width="1.6" stroke-linecap="round" d="m10.3 14 5.2-5.3"/>`);
  }

  if (name.includes("save")) {
    return icon(`<path ${fill} d="M6.4 3.5h11.2c.8 0 1.4.6 1.4 1.4v15c0 .9-1 1.4-1.8.9L12 17.4l-5.2 3.4c-.8.5-1.8 0-1.8-.9v-15c0-.8.6-1.4 1.4-1.4Z"/>`);
  }

  if (name.includes("activation")) {
    return icon(`<path ${stroke} d="M5 12.5 10 17 19.5 7"/><path ${stroke} d="M12 3.5h7.5V11"/>`);
  }

  if (name.includes("cpm")) {
    return icon(`<path ${stroke} d="M7.5 7.8h8.8M7.5 12h7.2M7.5 16.2h8.8"/><path ${stroke} d="M4.5 4.5h15v15h-15z"/>`);
  }

  const fallbackIcons = ["followers", "activation", "cpm", "view"];
  return metricIconFor(fallbackIcons[index % fallbackIcons.length], 0);
}

function topicScale(weight) {
  return Math.max(0.8, Math.min(1.9, 0.75 + weight / 85)).toFixed(2);
}

function segmentedButton(value, label, activeValue) {
  return `<button class="segmented-item ${value === activeValue ? "active" : ""}" type="button" data-value="${value}">${label}</button>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function parseK(value) {
  if (value.endsWith("K")) return parseFloat(value) * 1000;
  if (value.endsWith("M")) return parseFloat(value) * 1000000;
  return parseFloat(value);
}

function formatCompactNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 100000 ? 0 : 1)}K`;
  return String(Math.round(number));
}

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${number.toFixed(number % 1 === 0 ? 0 : 1)}%`;
}

function normalizeTopicLabel(value) {
  return String(value).trim().replace(/\s+/g, " ");
}

function sparkLine(values) {
  const width = 240;
  const height = 96;
  const padding = 8;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = (width - padding * 2) / (values.length - 1);
  const coords = values.map((value, index) => {
    const x = padding + index * step;
    const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
    return [x, y];
  });
  const line = coords.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1][0]} ${height - padding} L ${coords[0][0]} ${height - padding} Z`;
  return { line, area };
}
