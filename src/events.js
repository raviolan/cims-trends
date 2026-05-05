function bindEvents() {
  document.querySelectorAll("[data-global-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.globalView = button.dataset.globalView;
      render();
    });
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  document.querySelectorAll("[data-segment]").forEach((segment) => {
    segment.querySelectorAll("[data-value]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = segment.dataset.segment;
        state[target] = button.dataset.value;
        render();
      });
    });
  });

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTopic = {
        scope: button.dataset.topicScope || "default",
        label: button.dataset.topic,
      };
      render();
    });
  });

  document.querySelectorAll("[data-genre]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trendMode = "genre";
      state.selectedGenre = button.dataset.genre;
      state.activeTopic = { scope: "trend", label: "" };
      render();
    });
  });

  document.querySelectorAll("[data-trend-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      state.trendSearch = String(formData.get("trendSearch") || "").trim();
      state.trendMode = state.trendSearch ? "search" : "genre";
      state.activeTopic = { scope: "trend", label: "" };
      render();
    });
  });

  document.querySelectorAll("[data-topic-add-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      addTrendTopicWord(formData.get("topicCloudWord") || "");
      render();
    });
  });

  document.querySelectorAll("[data-remove-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      removeTrendTopicWord(button.dataset.removeTopic || "");
      render();
    });
  });

  document.querySelectorAll("[data-creator-result-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      state.creatorResultSearch = String(formData.get("creatorResultSearch") || "").trim();
      render();
    });
  });

  document.querySelectorAll("[data-creator-platform]").forEach((button) => {
    button.addEventListener("click", () => {
      const platform = button.dataset.creatorPlatform;
      state.creatorResultPlatforms = state.creatorResultPlatforms.includes(platform)
        ? state.creatorResultPlatforms.filter((item) => item !== platform)
        : [...state.creatorResultPlatforms, platform];
      render();
    });
  });

  document.querySelectorAll("[data-creator-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.creatorFilter;
      state.creatorResultFilters = state.creatorResultFilters.includes(filter)
        ? state.creatorResultFilters.filter((item) => item !== filter)
        : [...state.creatorResultFilters, filter];
      render();
    });
  });

  document.querySelectorAll("[data-creator-filter-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      state.creatorResultFilters = state.creatorResultFilters.filter((item) => item !== button.dataset.creatorFilterRemove);
      render();
    });
  });

  document.querySelectorAll("[data-creator-results-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      state.creatorResultSearch = "";
      state.creatorResultFilters = [];
      state.creatorResultPlatforms = creatorResultPlatformOptions.map((platform) => platform.id);
      state.creatorResultSort = "engagements";
      render();
    });
  });

  document.querySelectorAll("[data-creator-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      state.creatorResultSearch = button.dataset.creatorSuggestion;
      render();
    });
  });

  document.querySelectorAll("[data-creator-save]").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = fallbackCreatorResults.find((creator) => creator.id === button.dataset.creatorSave);
      if (profile) profile.saved = !profile.saved;
      render();
    });
  });

  document.querySelectorAll("[data-creator-add]").forEach((button) => {
    button.addEventListener("click", () => {
      button.dataset.added = "true";
    });
  });
}
