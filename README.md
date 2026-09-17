# AWS Student Community Day — UX/UI Redesign

## Overview

This repository is a student-first UX/UI redesign of the existing **AWS Student
Community Day** website for the AWS Cloud Club, IGDTUW. The event is a free
one-day student conference on cloud computing. The redesign keeps the original
event content and assets, but rebuilds the single-page experience around what a
student actually needs to decide whether to attend — and what to do next.

The previous build is preserved in spirit (same event, speakers, sponsors, team
and social links), but the page structure, design system and interactions were
rebuilt.

Live site: https://payalnarwal.github.io/AWS-Student-Community-Day/

## Design Goal

The redesign is organised around one question at a time, in the order a student
would ask it:

**What is this?** → **Is it for me?** → **What can I attend?** →
**How do I register?** → **What happens next?** → **What do I do on the day?**

The page order follows that journey: hero → event facts → who it's for /
outcomes → schedule → speakers → register → venue → sponsors → team → FAQ →
footer ("what's next"). Registration is placed before venue logistics because
deciding to attend comes before planning the day.

## Problems Identified

The original experience had several issues that got in the way of that journey:

- **No usable schedule** — talks existed as a flat list with no times, levels or
  way to shortlist what to attend.
- **Event purpose/audience unclear** — copy didn't quickly answer who the event
  was for, or what a student would get out of it.
- **Registration handoff unclear** — the flow to registration and what happens
  after wasn't explained.
- **Stale countdown** — a hardcoded countdown to a past date, with no fallback.
- **Weak skill-level/audience framing** — nothing helped a beginner tell whether
  a session was aimed at them.
- **No learning outcomes** — the page didn't state what attendees would take away.
- **Speakers disconnected from sessions** — speaker cards and talks had no link
  between them.
- **Poor mobile navigation** — navigation and dense sections did not adapt to
  small screens.
- **Event logistics unclear** — venue, arrival and what to bring were not
  presented as practical answers.
- **FAQ focused on the wrong questions** — general questions rather than
  event-specific ones students actually ask.

## Redesign Decisions

The redesign is a **single-page, progressive-disclosure** experience — no fake
multi-day tabs and no new pages. Each problem is addressed directly:

- The schedule became the visual spine of the page, with a timeline, search,
  level filters and shortlisting.
- The hero and an "Is this event for you?" section state the purpose, audience
  and skill levels up front.
- Registration is a clear external handoff with a four-step "what happens next"
  explainer.
- The dead countdown and forced preloader were removed.
- Session levels are shown as badges (Beginner / Intermediate / All levels).
- A "You'll leave able to…" panel lists learning outcomes drawn from real talk
  topics.
- Speaker cards link straight to their session in the schedule.
- Navigation collapses to an accessible mobile menu with scroll-spy.
- Venue is broken into Where / When to arrive / What to bring / Need help?
- FAQs were rewritten to be event-scoped (free, who can attend, experience
  needed, check-in, recordings, venue, contact).

**Content honesty:** no event data was invented. Unconfirmed values (session
times, rooms, durations, end time) are stored as empty strings in `data.js` and
render as clearly-marked TBA / "to be confirmed" placeholders so organisers can
fill them in without touching markup or styles.

## Key UX Improvements

- **Student-first landing experience** — hero communicates what, when, where,
  cost and who it's for; primary "Register free" action dominates, with a
  secondary "View schedule".
- **Schedule timeline** — a fixed 9:00 AM "Doors open & check-in" block plus nine
  talks, each showing level, speaker and room (when known). Includes search by
  topic or speaker and level filters (All / Beginner / Intermediate / All levels),
  with empty and error states.
- **Session progressive disclosure** — each session expands in place (accessible
  `aria-expanded` / `aria-controls`) to reveal details. Only fields with real data
  render; unknown details collapse into a single "published closer to the event"
  line.
- **Speaker/session connection** — every speaker card has a "View session" button
  that scrolls to and highlights the matching session in the schedule.
- **My Schedule** — sessions can be added/removed; the shortlist persists in
  `localStorage` (key `scd-my-schedule-v1`) and shows in a side panel with a count
  badge. Conflict detection flags saved sessions that share the same time
  (currently inactive while times are TBA).
- **Registration handoff** — registration is handled externally on **Konfhub**.
  The site explains the four steps (get ticket → receive confirmation → add to
  calendar → show ticket at check-in) and never fakes a confirmation on-site.
- **Calendar actions** — an Apple/Outlook `.ics` download and a Google Calendar
  link, generated from the event date with an IST→UTC conversion. Because the end
  time is not yet confirmed, calendar entries fall back to a 5:00 PM end.
- **Venue/day-of information** — Where, When to arrive, What to bring (checklist)
  and Need help?, plus a contained Google Maps embed.
- **Event-focused FAQ** — a lightweight single-open accordion of nine
  event-specific questions.
- **Responsive mobile experience** — layout and components adapt rather than
  simply stack (speaker cards become compact horizontal rows; the register card
  moves above the step list).
- **Accessibility states** — consistent default, hover, active, focus-visible,
  disabled, loading (skeleton), success (added) and error states.

## Design System

Defined with CSS custom properties in `style.css`.

- **Typography** — Poppins (600) for headings and buttons; Inter (400/600) for
  body. A deliberate scale separates display, section, card, body, metadata and
  label sizes. Only two weights are loaded.
- **Colors** — AWS navy `#232f3e` and navy-deep `#1c2733` for dark surfaces,
  AWS orange `#ff9900` used only as an accent, neutral surfaces (`#ffffff`,
  `#f6f8fa`, `#eff2f5`), muted text (`#5f6b78`) and an accent text tone
  (`#9a5c13`). Semantic tokens exist for beginner/intermediate/advanced level
  badges and danger/error states.
- **Spacing** — an 8px scale (`--space-1` = 8px through `--space-7` = 96px) with
  clamped section padding for consistent vertical rhythm.
- **Buttons** — variants `accent` (primary action), `primary`, `ghost`,
  `outline`, `soft` and `link`; sizes `sm` / default / `lg` with consistent
  min-heights (36 / 42 / 50) and a `block` modifier.
- **Cards** — one card radius (`14px`) and one border treatment for audience,
  session and speaker cards; a `10px` control radius for inputs and sub-cards.
  Shadows are reserved for elevated surfaces (register card, overlays).
- **Badges** — a single pill system: level badges (Beginner / Intermediate /
  Advanced / All levels) plus a count badge, and muted chips for room metadata.
- **Interaction states** — one `:focus-visible` outline, subtle transitions, and
  explicit expanded / saved / conflict states for schedule elements.

## Accessibility

- Skip link to `#main`, semantic landmarks and a single `<h1>` with a consistent
  heading hierarchy.
- Every interactive control is keyboard reachable with a visible focus outline;
  session and FAQ toggles expose state via `aria-expanded` / `aria-controls`
  (FAQ answers also toggle `aria-hidden`).
- The schedule search input is labelled; the mobile menu toggle has
  `aria-expanded` and an accessible name; the nav marks the active section with
  `aria-current`.
- The team list is a modal dialog with `role="dialog"`, `aria-modal`, Escape to
  close, backdrop-click to close, body scroll lock and focus return.
- The map iframe has a descriptive `title`; all images have `alt` text.
- Live regions / status where appropriate (`aria-live` on the timeline).
- Respects `prefers-reduced-motion` (transitions collapse and smooth scrolling
  is disabled).
- Colour contrast was checked against WCAG AA for text and UI tokens.

## Tech

Plain, dependency-free front end — no framework, no build step, no package
manager.

- **HTML5** — a single semantic `index.html`.
- **CSS3** — custom properties, Grid, Flexbox, `clamp()` responsive type, logical
  properties, media queries at 960 / 720 / 560 / 420px.
- **Vanilla JavaScript (ES5)** — a single IIFE in `app.js` that renders content
  and wires up interactions. No libraries.
- **`data.js`** — the single source of truth, exposing global `EVENT`,
  `SPEAKERS`, `SESSIONS`, `AGENDA_FIXED`, `TEAM` and `FAQS`.
- **Inline SVG** icons (no icon font/CDN).
- **Google Fonts** for Poppins and Inter, and a **Google Maps** embed for the
  venue — the only external requests.
- **Web APIs** — `localStorage` for My Schedule, `IntersectionObserver` for
  scroll-spy, `Blob`/`URL.createObjectURL` for the `.ics` download, and
  `window.open` for the Google Calendar link.

## Running Locally

There is nothing to install and no build step. Serve the folder with any static
server and open it in a browser.

Using Python (built in on most systems):

```bash
python -m http.server 8000
```

Then open http://localhost:8000/

Or, if you have Node.js:

```bash
npx serve .
```

Because the page loads its scripts as plain files, opening `index.html` directly
in a browser also works; a local server is recommended so `localStorage` behaves
consistently. Fonts and the map embed require an internet connection.

To update event content, edit `data.js` — leave any unconfirmed value as `""` and
it will render as TBA.

## Credits

- **Event:** AWS Student Community Day, hosted at IGDTUW, Delhi by the AWS Cloud
  Club, IGDTUW.
- **Design & development:** [Payal Narwal](https://www.linkedin.com/in/payalnarwal/)
- **Club website:** https://aceta-minophen.github.io/aws-cloud-club-igdtuw/
- **Instagram:** https://www.instagram.com/awscloudclubigdtuw
- **LinkedIn:** https://www.linkedin.com/company/aws-cloud-club-igdtuw/
- **X (Twitter):** https://x.com/AWSClubIGDTUW
- **Ticketing partner:** Konfhub — https://konfhub.com/awsstudentcommunityigdtuw
- **Title sponsor:** Amazon Web Services
