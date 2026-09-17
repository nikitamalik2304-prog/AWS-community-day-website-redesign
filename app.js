/*
 * AWS Student Community Day · IGDTUW — app logic
 * Renders data.js into the page, wires up the schedule experience,
 * navigation, dialogs and calendar handoff.
 */
(function () {
  "use strict";

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var STORAGE_KEY = "scd-my-schedule-v1";

  var state = { filter: "all", query: "" };
  var saved = loadSaved();

  var LEVELS = {
    beginner: { label: "Beginner", cls: "badge--beginner" },
    intermediate: { label: "Intermediate", cls: "badge--intermediate" },
    advanced: { label: "Advanced", cls: "badge--advanced" },
    all: { label: "All levels", cls: "badge--all" },
  };

  var speakerById = {};
  SPEAKERS.forEach(function (s) {
    speakerById[s.id] = s;
  });
  var sessionById = {};
  SESSIONS.forEach(function (s) {
    sessionById[s.id] = s;
  });

  /* ----------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------- */
  function levelMeta(l) {
    return LEVELS[l] || LEVELS.all;
  }

  function fmtTime(t) {
    return t && String(t).trim() ? String(t).trim() : "Time TBA";
  }

  function fmtRoom(r) {
    return r && String(r).trim() ? String(r).trim() : "Room TBA";
  }

  function timeIsTba(t) {
    return !t || !String(t).trim();
  }

  function loadSaved() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return list.filter(function (id) {
        return sessionById[id];
      });
    } catch (e) {
      return [];
    }
  }

  function persistSaved() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {
      /* storage unavailable — keep in-memory only */
    }
    renderSavedCount();
  }

  function speakerName(id) {
    var sp = speakerById[id];
    return sp ? sp.name : "TBA";
  }

  function conflictMap(list) {
    var map = {};
    for (var i = 0; i < list.length; i++) {
      for (var j = i + 1; j < list.length; j++) {
        var a = sessionById[list[i]];
        var b = sessionById[list[j]];
        var ta = a && a.time ? String(a.time).trim() : "";
        var tb = b && b.time ? String(b.time).trim() : "";
        if (ta && ta === tb) {
          map[a.id] = true;
          map[b.id] = true;
        }
      }
    }
    return map;
  }

  /* ----------------------------------------------------------
   * Facts
   * ---------------------------------------------------------- */
  function renderFacts() {
    var primary = $("#facts-primary");
    var stats = $("#facts-stats");
    if (!primary || !stats) return;

    primary.innerHTML = EVENT.facts
      .filter(function (f) {
        return f.group === "primary";
      })
      .map(function (f) {
        return (
          '<li class="' +
          (f.highlight ? "fact--highlight" : "") +
          '">' +
          '<span class="fact-value">' + escapeHtml(f.value) + "</span>" +
          '<span class="fact-label">' + escapeHtml(f.label) + "</span>" +
          "</li>"
        );
      })
      .join("");

    stats.innerHTML = EVENT.facts
      .filter(function (f) {
        return f.group === "stats";
      })
      .map(function (f) {
        return (
          "<li><b>" +
          escapeHtml(f.value) +
          "</b> " +
          escapeHtml(f.label) +
          "</li>"
        );
      })
      .join("");
  }

  /* ----------------------------------------------------------
   * Audience + outcomes
   * ---------------------------------------------------------- */
  var AUDIENCE = [
    {
      title: "Curious beginner",
      copy: "Just starting out? Get hands-on and learn the basics.",
      tags: ["Beginner"],
      cls: "audience-card--blue",
      icon: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.2-2.55L4.5 16.5z"/><path d="M12 15l-3-3 7.5-7.5c1.38-1.38 3.62-1.38 5 0 1.38 1.38 1.38 3.62 0 5L14 17l-2-2z"/>',
    },
    {
      title: "Learning AWS",
      copy: "Work on real projects and get certified.",
      tags: ["Intermediate"],
      cls: "audience-card--yellow",
      icon: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    },
    {
      title: "Career focused",
      copy: "Build skills, meet industry professionals and grow.",
      tags: ["All levels"],
      cls: "audience-card--purple",
      icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    },
  ];

  // Outcomes are the existing statements, reformatted with the key phrase
  // pulled out so the list is scannable. No new claims are added.
  var OUTCOMES = [
    { pre: "Build ", strong: "cloud skills", post: " with real projects" },
    { pre: "Understand ", strong: "AWS tools & services", post: "" },
    { pre: "Network with ", strong: "industry professionals", post: "" },
    { pre: "Plan your ", strong: "next steps in tech", post: "" },
  ];

  function renderAudience() {
    var grid = $("#audience-grid");
    if (!grid) return;
    grid.innerHTML = AUDIENCE.map(function (a) {
      var lvl = levelMeta(a.tags[0].toLowerCase());
      return (
        '<li class="audience-card card-3d ' + a.cls + '">' +
        '<div class="audience-card__top">' +
        '<span class="audience-card__ico">' +
        '<svg class="ico ico--lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false">' + a.icon + "</svg></span>" +
        "</div>" +
        '<h3 class="audience-card__title">' + escapeHtml(a.title) + "</h3>" +
        '<p class="audience-card__copy">' + escapeHtml(a.copy) + "</p>" +
        '<span class="badge ' + lvl.cls + '">' + lvl.label + "</span>" +
        "</li>"
      );
    }).join("");
  }

  function renderOutcomes() {
    var panel = $("#outcomes-panel");
    if (!panel) return;
    panel.innerHTML =
      '<h3 class="outcomes__title">You’ll leave able to…</h3><ul>' +
      OUTCOMES.map(function (o) {
        return (
          "<li><svg class='ico ico--sm' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path d='m4 12.5 5 5L20 6.5' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg><span>" +
          escapeHtml(o.pre) +
          "<strong>" + escapeHtml(o.strong) + "</strong>" +
          escapeHtml(o.post) +
          "</span></li>"
        );
      }).join("") +
      "</ul>";
  }

  /* ----------------------------------------------------------
   * Speakers
   * ---------------------------------------------------------- */
  function renderSpeakers() {
    var grid = $("#speakers-grid");
    if (!grid) return;
    grid.innerHTML = SPEAKERS.map(function (sp) {
      var sessId = sessionForSpeaker(sp.id);
      return (
        '<li class="speaker-card card-3d" tabindex="0">' +
        '<div class="speaker-card__media">' +
        '<img src="' + sp.photo + '" alt="Portrait of ' + escapeHtml(sp.name) + '" loading="lazy" width="400" height="300">' +
        '<div class="speaker-card__overlay">' +
        '<div class="speaker-card__overlay-content">' +
        '<h3 class="speaker-card__overlay-name">' + escapeHtml(sp.name) + '</h3>' +
        '<p class="speaker-card__overlay-role">' + escapeHtml(sp.role) + '</p>' +
        '<p class="speaker-card__overlay-topic">"' + escapeHtml(sp.topic) + '"</p>' +
        '<div class="speaker-card__overlay-actions">' +
        '<a class="speaker-card__linkedin-btn" href="' + sp.linkedin + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile of ' + escapeHtml(sp.name) + '">' +
        '<svg class="ico ico--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 10.5V17M7.5 7v.01M11.5 17v-4a2.5 2.5 0 0 1 5 0v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
        'LinkedIn</a>' +
        (sessId ? '<button type="button" class="btn btn--accent btn--sm" data-session="' + sessId + '">View session</button>' : '') +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="speaker-card__content">' +
        '<h3 class="speaker-card__name">' + escapeHtml(sp.name) + '</h3>' +
        '<p class="speaker-card__role">' + escapeHtml(sp.role) + '</p>' +
        '<p class="speaker-card__topic">' + escapeHtml(sp.topic) + '</p>' +
        (sessId ? '<button type="button" class="btn btn--soft btn--sm speaker-card__session-btn" data-session="' + sessId + '">View session</button>' : '') +
        '</div>' +
        '</li>'
      );
    }).join("");

    $$(".speaker-card [data-session]", grid).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        openSession(btn.getAttribute("data-session"));
      });
    });
  }

  function sessionForSpeaker(speakerId) {
    var s = SESSIONS.filter(function (x) {
      return x.speakerId === speakerId;
    })[0];
    return s ? s.id : "";
  }

  /* ----------------------------------------------------------
   * Schedule
   * ---------------------------------------------------------- */
  function initSchedule() {
    $("#schedule-note").textContent =
      "Session times and rooms are with our speakers and will be confirmed closer to 3 February — the agenda below is the day’s structure.";

    buildLevelFilters();
    $("#schedule-search").addEventListener("input", function (e) {
      state.query = e.target.value.trim().toLowerCase();
      renderTimeline();
    });
    $("#schedule-clear").addEventListener("click", function () {
      state.query = "";
      state.filter = "all";
      $("#schedule-search").value = "";
      syncFilterButtons();
      renderTimeline();
    });
    $("#my-schedule-btn").addEventListener("click", openPanel);
    $("#schedule-panel-close").addEventListener("click", closePanel);

    showSkeletons();
    // Render schedule on the next frame so the skeleton state is at least
    // visible to the interaction pattern (data is local, so this resolves
    // almost instantly). A timer fallback guards against throttled pages
    // where requestAnimationFrame never fires.
    var rendered = false;
    var renderSchedule = function () {
      if (rendered) return;
      rendered = true;
      try {
        renderTimeline();
      } catch (err) {
        showScheduleError();
      }
    };
    var rafId = requestAnimationFrame(renderSchedule);
    window.setTimeout(function () {
      if (!rendered) {
        cancelAnimationFrame(rafId);
        renderSchedule();
      }
    }, 350);
  }

  function buildLevelFilters() {
    var wrap = $("#level-filters");
    var levels = ["all"].concat(
      SESSIONS.map(function (s) {
        return s.level;
      }).filter(function (v, i, a) {
        return a.indexOf(v) === i;
      })
    );
    wrap.innerHTML = levels
      .map(function (l) {
        var label = l === "all" ? "All" : levelMeta(l).label;
        return (
          '<button type="button" class="filter-pill" data-level="' + l + '" aria-pressed="' + (state.filter === l) + '">' +
          label +
          "</button>"
        );
      })
      .join("");
    $$(".filter-pill", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.filter = btn.getAttribute("data-level");
        syncFilterButtons();
        renderTimeline();
      });
    });
  }

  function syncFilterButtons() {
    $$(".filter-pill").forEach(function (btn) {
      var active = btn.getAttribute("data-level") === state.filter || (state.filter === "all" && btn.getAttribute("data-level") === "all");
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function matchesQuery(sess) {
    if (!state.query) return true;
    var sp = speakerById[sess.speakerId];
    var hay = [sess.title, sp ? sp.name : "", sp ? sp.topic : "", sp ? sp.role : ""].join(" ").toLowerCase();
    return hay.indexOf(state.query) !== -1;
  }

  function showSkeletons() {
    var list = $("#timeline-list");
    list.innerHTML = "";
    for (var i = 0; i < 4; i++) {
      var item = document.createElement("li");
      item.className = "sk-item";
      item.innerHTML =
        '<div class="sk-box sk-box--rail"></div>' +
        '<div class="sk-box"></div>';
      list.appendChild(item);
    }
    $("#schedule-empty").hidden = true;
  }

  function showScheduleError() {
    var list = $("#timeline-list");
    list.innerHTML = "";
    list.classList.remove("timeline");
    var err = document.createElement("li");
    err.className = "schedule__error";
    err.textContent = "The agenda couldn’t be loaded right now. Please refresh the page.";
    list.appendChild(err);
  }

  function renderTimeline() {
    var list = $("#timeline-list");
    list.innerHTML = "";
    list.classList.add("timeline");

    var visible = SESSIONS.filter(function (s) {
      var okFilter = state.filter === "all" || s.level === state.filter;
      return okFilter && matchesQuery(s);
    });

    if (!visible.length) {
      $("#schedule-empty").hidden = false;
      return;
    }
    $("#schedule-empty").hidden = true;

    AGENDA_FIXED.forEach(function (block) {
      list.appendChild(buildFixedBlock(block));
    });

    visible.forEach(function (sess) {
      list.appendChild(buildSessionItem(sess));
    });
  }

  function buildFixedBlock(block) {
    var li = document.createElement("li");
    li.className = "tl-item";
    li.innerHTML =
      '<div class="tl-rail">' +
      '<span class="tl-time">' + escapeHtml(block.time) + "</span>" +
      '<span class="tl-dot is-fixed"></span>' +
      "</div>" +
      '<div class="session-card"><div class="session-card__static">' +
      '<span class="session-card__title">' + escapeHtml(block.title) + "</span>" +
      '<p class="session-card__meta">' + escapeHtml(block.note) + "</p>" +
      "</div></div>";
    return li;
  }

  function buildSessionItem(sess) {
    var sp = speakerById[sess.speakerId];
    var lvl = levelMeta(sess.level);
    var tbaTime = timeIsTba(sess.time);

    var li = document.createElement("li");
    li.className = "tl-item";
    li.id = "sess-" + sess.id;

    // Only render detail rows we actually have data for. Known values
    // (speaker, level) always show; unknown ones stay hidden instead of
    // stacking a wall of "TBA" fields.
    var detailFields = [
      { label: "Speaker", value: sp ? sp.name : "To be announced" },
      { label: "Level", value: lvl.label },
    ];
    if (sess.duration) detailFields.push({ label: "Duration", value: sess.duration });
    if (sess.room) detailFields.push({ label: "Room", value: sess.room });
    if (sess.prerequisites) detailFields.push({ label: "Prerequisites", value: sess.prerequisites });
    if (sess.takeaways && sess.takeaways.length) {
      detailFields.push({ label: "Takeaways", value: sess.takeaways.join(", ") });
    }
    var hasMoreDetails = !!(sess.duration || sess.room || sess.prerequisites || (sess.takeaways && sess.takeaways.length));

    li.innerHTML =
      '<div class="tl-rail">' +
      '<span class="tl-time' + (tbaTime ? " is-tba" : "") + '">' + escapeHtml(fmtTime(sess.time)) + "</span>" +
      '<span class="tl-dot"></span>' +
      "</div>" +
      '<div class="session-card">' +
      '<button type="button" class="session-card__toggle" aria-expanded="false" aria-controls="det-' + sess.id + '">' +
      '<div class="session-card__top">' +
      '<div>' +
      '<div class="session-card__tags">' +
      '<span class="badge ' + lvl.cls + '">' + lvl.label + "</span>" +
      (sess.room ? '<span class="chip">' + escapeHtml(sess.room) + "</span>" : "") +
      "</div>" +
      '<h3 class="session-card__title">' + escapeHtml(sess.title) + "</h3>" +
      '<p class="session-card__meta">with <b>' + escapeHtml(sp ? sp.name : "TBA") + "</b>" + (sp ? " · " + escapeHtml(sp.role) : "") + "</p>" +
      "</div>" +
      '<svg class="ico session-card__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</div>" +
      "</button>" +
      '<div class="session-card__body" id="det-' + sess.id + '">' +
      '<p class="session-detail__desc">' +
      escapeHtml(sess.description || "Full session details will be shared closer to the event.") +
      "</p>" +
      '<dl class="session-detail">' +
      detailFields
        .map(function (f) {
          return (
            '<div class="session-detail__field"><dt class="session-detail__label">' + f.label + "</dt>" +
            '<dd class="session-detail__value">' + escapeHtml(f.value) + "</dd></div>"
          );
        })
        .join("") +
      "</dl>" +
      (hasMoreDetails
        ? ""
        : '<p class="session-detail__note">Timings, room and prerequisites will be published closer to 3 February.</p>') +
      '<div class="session-card__actions">' +
      '<button type="button" class="btn btn--soft btn--sm add-btn" data-id="' + sess.id + '" aria-pressed="' + isSaved(sess.id) + '">' +
      (isSaved(sess.id)
        ? '<svg class="ico ico--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m4 12.5 5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Added'
        : "+ Add to my schedule") +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>";

    var toggle = $(".session-card__toggle", li);
    toggle.addEventListener("click", function () {
      var open = li.querySelector(".session-card").classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    var addBtn = $(".add-btn", li);
    addBtn.addEventListener("click", function () {
      toggleSaved(sess.id);
      refreshAddButtons();
      renderPanel();
    });

    return li;
  }

  function refreshAddButtons() {
    $$(".add-btn").forEach(function (btn) {
      var id = btn.getAttribute("data-id");
      var on = isSaved(id);
      btn.setAttribute("aria-pressed", String(on));
      if (on) {
        btn.classList.add("is-saved");
        btn.innerHTML =
          '<svg class="ico ico--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m4 12.5 5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Added';
      } else {
        btn.classList.remove("is-saved");
        btn.innerHTML = "+ Add to my schedule";
      }
    });
  }

  function isSaved(id) {
    return saved.indexOf(id) !== -1;
  }

  function toggleSaved(id) {
    var i = saved.indexOf(id);
    if (i === -1) {
      saved.push(id);
    } else {
      saved.splice(i, 1);
    }
    persistSaved();
  }

  function openSession(sessionId) {
    state.filter = "all";
    state.query = "";
    $("#schedule-search").value = "";
    syncFilterButtons();
    renderTimeline();

    var item = document.getElementById("sess-" + sessionId);
    if (!item) return;
    var card = $(".session-card", item);
    var toggle = $(".session-card__toggle", item);
    if (!card.classList.contains("is-open")) {
      card.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }
    item.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    card.classList.add("is-flashed");
    window.setTimeout(function () {
      card.classList.remove("is-flashed");
    }, 2000);
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ----------------------------------------------------------
   * My schedule panel
   * ---------------------------------------------------------- */
  function renderSavedCount() {
    var el = $("#my-schedule-count");
    if (el) el.textContent = String(saved.length);
    var btn = $("#my-schedule-btn");
    if (btn) btn.setAttribute("aria-label", "My schedule (" + saved.length + " saved)");
  }

  function renderPanel() {
    var wrap = $("#schedule-panel-list");
    if (!wrap) return;
    if (!saved.length) {
      wrap.innerHTML =
        '<p class="schedule-panel__empty">Nothing saved yet. Tap "Add to my schedule" on any session to shortlist it here.</p>';
      return;
    }
    var conflicts = conflictMap(saved);
    wrap.innerHTML =
      saved
        .map(function (id) {
          var s = sessionById[id];
          var conflict = conflicts[id];
          var meta = fmtTime(s.time) + " · " + speakerName(s.speakerId);
          return (
            '<div class="saved-item' + (conflict ? " is-conflict" : "") + '">' +
            "<div>" +
            '<span class="saved-item__title">' + escapeHtml(s.title) + "</span>" +
            '<span class="saved-item__meta">' + (conflict ? "Clash — overlaps another saved session · " : "") + escapeHtml(meta) + "</span>" +
            "</div>" +
            '<button type="button" class="saved-item__remove" data-remove="' + id + '" aria-label="Remove ' + escapeHtml(s.title) + ' from my schedule">' +
            '<svg class="ico ico--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
            "</button>" +
            "</div>"
          );
        })
        .join("") +
      '<div class="schedule-panel__footer"><button type="button" class="btn btn--soft btn--sm btn--block" id="panel-cal">Add the whole day to your calendar</button></div>';

    var calBtn = $("#panel-cal");
    if (calBtn) calBtn.addEventListener("click", function () {
      addToCalendar();
    });

    $$("[data-remove]", wrap).forEach(function (b) {
      b.addEventListener("click", function () {
        toggleSaved(b.getAttribute("data-remove"));
        renderPanel();
      });
    });
  }

  function openPanel() {
    renderPanel();
    $("#schedule-panel").hidden = false;
    var close = $("#schedule-panel-close");
    if (close) close.focus();
  }

  function closePanel() {
    $("#schedule-panel").hidden = true;
  }

  /* ----------------------------------------------------------
   * Registration handoff + calendar
   * ---------------------------------------------------------- */
  function renderRegister() {
    var ext = $("#register-ext");
    if (ext) ext.textContent = "You’ll leave this site to complete booking on Konfhub — it’s free.";

    var cal = $("#calendar-actions");
    if (!cal) return;
    cal.innerHTML =
      '<span class="register__cal-label">Add the date to your calendar</span>' +
      '<button type="button" class="btn btn--soft" id="cal-ics">Apple / Outlook (.ics)</button>' +
      '<button type="button" class="btn btn--soft" id="cal-google">Google Calendar</button>';
    $("#cal-ics").addEventListener("click", downloadIcs);
    $("#cal-google").addEventListener("click", function () {
      window.open(googleCalUrl(), "_blank", "noopener,noreferrer");
    });
  }

  function parseLabel(label) {
    var m = String(label).trim().toLowerCase().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
    if (!m) return null;
    var h = Number(m[1]);
    var min = m[2] ? Number(m[2]) : 0;
    if (m[3] === "pm" && h !== 12) h += 12;
    if (m[3] === "am" && h === 12) h = 0;
    return { h: h, m: min };
  }

  function istToUtc(h, m) {
    var utcM = m - 30;
    var utcH = h - 5;
    if (utcM < 0) {
      utcM += 60;
      utcH -= 1;
    }
    if (utcH < 0) utcH += 24;
    if (utcH > 24) utcH -= 24;
    return { h: utcH, m: utcM };
  }

  function eventUtc() {
    var day = eventDayParts();
    if (!day) return null;
    var start = parseLabel(EVENT.startTime) || { h: 9, m: 0 };
    var end = parseLabel(EVENT.endTime) || { h: 17, m: 0 };
    var su = istToUtc(start.h, start.m);
    var eu = istToUtc(end.h, end.m);
    var pad = function (n) {
      return (n < 10 ? "0" : "") + n;
    };
    return {
      date: day.year + pad(day.month) + pad(day.day),
      start: su.h + "" + pad(su.m) + "00",
      end: eu.h + "" + pad(eu.m) + "00",
    };
  }

  function eventDayParts() {
    var m = String(EVENT.dateLabel).toLowerCase().match(/(\d{1,2})\s*([a-z]+)\s*(\d{4})/);
    if (!m) return null;
    var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    var idx = months.indexOf(m[2]);
    if (idx === -1) return null;
    return { day: Number(m[1]), month: idx + 1, year: Number(m[3]) };
  }

  function googleCalUrl() {
    var u = eventUtc();
    if (!u) return EVENT.konfhubUrl;
    var params = [
      "action=TEMPLATE",
      "text=" + encodeURIComponent("AWS Student Community Day · IGDTUW"),
      "dates=" + u.date + "T" + u.start + "Z/" + u.date + "T" + u.end + "Z",
      "details=" + encodeURIComponent("Free student conference by AWS Cloud Club, IGDTUW. Register: " + EVENT.konfhubUrl),
      "location=" + encodeURIComponent(EVENT.venue.name + ", " + EVENT.venue.address),
    ];
    return "https://calendar.google.com/calendar/render?" + params.join("&");
  }

  function downloadIcs() {
    var u = eventUtc();
    if (!u) return;
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AWS Cloud Club IGDTUW//Community Day//EN",
      "BEGIN:VEVENT",
      "UID:aws-student-community-day-2024@igdtuw",
      "DTSTAMP:20240101000000Z",
      "DTSTART:" + u.date + "T" + u.start + "Z",
      "DTEND:" + u.date + "T" + u.end + "Z",
      "SUMMARY:AWS Student Community Day · IGDTUW",
      "LOCATION:" + EVENT.venue.name + ", " + EVENT.venue.address.replace(/,\s*/g, ", "),
      "DESCRIPTION:" + "Free student conference by AWS Cloud Club, IGDTUW. Details: " + EVENT.konfhubUrl,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    var blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "aws-student-community-day.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function addToCalendar() {
    downloadIcs();
  }

  /* ----------------------------------------------------------
   * Team
   * ---------------------------------------------------------- */
  function renderTeam() {
    var grid = $("#team-grid");
    if (!grid) return;
    grid.innerHTML = TEAM.map(function (m) {
      var hasLi = m.linkedin && m.linkedin.trim() !== "";
      return (
        '<li class="team-card card-3d" tabindex="0">' +
        '<div class="team-card__avatar-wrap">' +
        '<img class="team-card__avatar" src="' + m.photo + '" alt="Portrait of ' + escapeHtml(m.name) + '" loading="lazy" width="130" height="130">' +
        (hasLi
          ? '<div class="team-card__overlay">' +
            '<a class="team-card__linkedin-btn" href="' + m.linkedin + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile of ' + escapeHtml(m.name) + '">' +
            '<svg class="ico ico--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 10.5V17M7.5 7v.01M11.5 17v-4a2.5 2.5 0 0 1 5 0v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> LinkedIn</a>' +
            '</div>'
          : '') +
        '</div>' +
        '<div class="team-card__info">' +
        '<h3 class="team-card__name">' + escapeHtml(m.name) + '</h3>' +
        '<p class="team-card__role">' + escapeHtml(m.role) + '</p>' +
        '</div>' +
        '</li>'
      );
    }).join("");
  }

  /* ----------------------------------------------------------
   * 3D Tilt Card Interaction
   * ---------------------------------------------------------- */
  function init3DCards() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest && e.target.closest(".card-3d");
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      var rotX = (-y / (rect.height / 2)) * 5;
      var rotY = (x / (rect.width / 2)) * 5;
      card.style.transform = "perspective(800px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg) translateY(-3px)";
    });

    document.addEventListener("mouseout", function (e) {
      var card = e.target.closest && e.target.closest(".card-3d");
      if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
        card.style.transform = "";
      }
    });
  }

  /* ----------------------------------------------------------
   * FAQ
   * ---------------------------------------------------------- */
  function renderFaq() {
    var wrap = $("#faq-accordion");
    if (!wrap) return;
    wrap.innerHTML = FAQS.map(function (f, i) {
      return (
        '<div class="faq-item">' +
        '<h3 class="faq__q">' +
        '<button type="button" aria-expanded="false" aria-controls="faq-a-' + i + '" id="faq-q-' + i + '">' +
        escapeHtml(f.q) +
        '<svg class="ico ico--sm faq__arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</button>" +
        "</h3>" +
        '<div class="faq__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '" aria-hidden="true">' +
        "<p>" + escapeHtml(f.a) + "</p>" +
        "</div>" +
        "</div>"
      );
    }).join("");

    $$(".faq__q button", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var body = document.getElementById(btn.getAttribute("aria-controls"));
        var open = item.classList.contains("is-open");
        // Close siblings for a tidy single-open accordion
        $$(".faq-item.is-open", wrap).forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            var ob = $(".faq__q button", other);
            if (ob) ob.setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("is-open", !open);
        btn.setAttribute("aria-expanded", String(!open));
        if (body) body.setAttribute("aria-hidden", open ? "true" : "false");
      });
    });
  }

  /* ----------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------- */
  function initNav() {
    var toggle = $(".nav__toggle");
    var header = $(".site-header");
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    $$(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Scrollspy
    var sectionIds = ["overview", "schedule", "speakers", "venue"];
    var links = {};
    $$(".nav__link").forEach(function (link) {
      links[link.getAttribute("href").slice(1)] = link;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          if (entry.isIntersecting && links[id]) {
            $$(".nav__link").forEach(function (l) {
              l.setAttribute("aria-current", l === links[id] ? "true" : "false");
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sectionIds.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* ----------------------------------------------------------
   * Team dialog
   * ---------------------------------------------------------- */
  function initDialog() {
    var dialog = $("#team-dialog");
    var openBtn = $("#team-open");
    var closeBtn = $("#team-close");
    var lastFocus = null;

    openBtn.addEventListener("click", function () {
      lastFocus = openBtn;
      dialog.hidden = false;
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    });

    function closeDialog() {
      dialog.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    closeBtn.addEventListener("click", closeDialog);
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeDialog();
    });

    document.addEventListener("keydown", function (e) {
      if (dialog.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeDialog();
      }
    });
  }

  /* ----------------------------------------------------------
   * Global Escape: mobile menu + schedule panel
   * ---------------------------------------------------------- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var panel = $("#schedule-panel");
    if (panel && !panel.hidden) {
      closePanel();
      return;
    }
    var header = $(".site-header");
    if (header.classList.contains("nav-open")) {
      header.classList.remove("nav-open");
      var toggle = $(".nav__toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", function (e) {
    var panel = $("#schedule-panel");
    if (!panel || panel.hidden) return;
    var onToggle = e.target.closest && e.target.closest("#my-schedule-btn");
    var inPanel = e.target.closest && e.target.closest("#schedule-panel");
    if (!onToggle && !inPanel) closePanel();
  });

  /* ----------------------------------------------------------
   * Escape HTML in user-provided content
   * ---------------------------------------------------------- */
  function escapeHtml(v) {
    return String(v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ----------------------------------------------------------
   * Live Countdown Timer Ticker
   * Target Date: October 30, 2026 09:00:00 AM IST
   * ---------------------------------------------------------- */
  function initCountdown() {
    // Target Date: 30 October 2026, 09:00:00 AM IST (Month index 9 = October)
    var targetDate = new Date(2026, 9, 30, 9, 0, 0).getTime();
    var daysEl = $("#count-days");
    var hoursEl = $("#count-hours");
    var minsEl = $("#count-mins");
    var secsEl = $("#count-secs");
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function tick() {
      var now = new Date().getTime();
      var diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        return;
      }

      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = pad(d);
      hoursEl.textContent = pad(h);
      minsEl.textContent = pad(m);
      secsEl.textContent = pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ----------------------------------------------------------
   * Boot
   * ---------------------------------------------------------- */
  function boot() {
    try { initCountdown(); } catch (e) { console.error("Countdown init error:", e); }
    try { renderFacts(); } catch (e) {}
    try { renderAudience(); } catch (e) {}
    try { renderOutcomes(); } catch (e) {}
    try { renderSpeakers(); } catch (e) {}
    try { renderTeam(); } catch (e) {}
    try { renderFaq(); } catch (e) {}
    try { renderRegister(); } catch (e) {}
    try { renderSavedCount(); } catch (e) {}
    try { initSchedule(); } catch (e) {}
    try { initNav(); } catch (e) {}
    try { initDialog(); } catch (e) {}
    try { init3DCards(); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();