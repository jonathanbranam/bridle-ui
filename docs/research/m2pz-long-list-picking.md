# m2pz: picking one item from a long, growing list

Researcher: picker-research2, 2026-10-06. Task ui-m2pz, research step only.
ASCII only. Each claim has its source URL. "Verified" means I fetched the page and
the quote came from its body; "search snippet" means it came only from a WebSearch
result summary; "unverified" means the fetch returned no body.

Our case: hundreds to thousands of documents in folders, growing; often the user
pastes a 4-char ticket ID and expects it to open with no further step; mobile with
44px targets; long path names wrap badly.

## 1. What the sources say

### 1.1 Long lists are not dropdowns (supports the human's rule)

- NN/g: long scrolling dropdowns make it impossible to see all choices at once; typing
  is faster for familiar data (states, countries); alternatives are plain link lists and
  free-form input with validation. Verified.
  https://www.nngroup.com/articles/drop-down-menus/
- Baymard: "Long country drop-downs, which often include over two hundred options, can
  be very difficult for users to get an overview of"; scrolling them causes errors
  (users scroll the page instead); a country autocomplete "solves the issue of having a
  massive drop-down" and handles typos, synonyms and abbreviations. Verified.
  https://baymard.com/blog/drop-down-usability
- GOV.UK: select "should only be used as a last resort in public-facing services";
  first try asking questions that leave fewer options. Verified. Note the page does not
  itself name autocomplete.
  https://design-system.service.gov.uk/components/select/
- GOV.UK accessible-autocomplete: built for choosing from a large list when the user
  knows what they want (country of birth); it recommends rendering a server `<select>`
  as the no-JS fallback for lists of "a few hundred". Search snippet plus README quote.
  https://github.com/alphagov/accessible-autocomplete
  https://docs.publishing.service.gov.uk/repos/govuk-design-guide/components/search-autocomplete.html
- Material (Android docs): exposed dropdown menus are an AutoCompleteTextView in a
  text field and "can accept user-entered input"; Material's own guidance (m2 menus
  page, search snippet only) says to support type-ahead on long menus and keep menu
  items to one line. https://m2.material.io/go/design-menus
- Apple pickers page (fetch returned a summary I cannot trust to be from the body;
  UNVERIFIED): searchable input over scrolling for hundreds of items.
  https://developer.apple.com/design/human-interface-guidelines/pickers

Takeaway: autocomplete/search with a scrollable result list is the established
replacement. Nobody recommends a plain select past a few dozen items.

### 1.2 Autocomplete and suggestion design

- Baymard: show no more than 10 suggestions on desktop, 4-8 on mobile; on mobile,
  crowding elements (ads, chat, sticky buttons) make users skip suggestions; small
  fonts and tight spacing make suggestions hard to hit; emphasize the predicted part,
  not the typed part; arrows move through suggestions, Return submits the focused one.
  Verified. https://baymard.com/research-articles/autocomplete-design
- NN/g mobile input checklist: offer suggestions/autocomplete from the first letters;
  support copy and paste into the field; make the field big enough to show typical
  values; choose the right keyboard. Verified.
  https://www.nngroup.com/articles/mobile-input-checklist/
- NN/g search box: a real text box (not a link) raised search use by 91% in one case;
  make it wide enough for the typical query. Verified.
  https://www.nngroup.com/articles/search-visible-and-simple/
- WAI-ARIA APG combobox: defines four autocomplete modes (none, list, list with
  inline, ...); focus stays in the input, the listbox option is tracked with
  aria-activedescendant; Down Arrow enters the list, Enter accepts, Escape closes.
  Verified. https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Recents when empty and grouped results: seen in design-system pages on typeahead and
  command palettes (search snippet only, vendor guidance, weak evidence).
  https://designsystem.maersk.com/components/typeahead/index.html
  https://www.sap.com/design-system/btp/components/components/command-palette/usage

### 1.3 Mobile: full-screen search and target size

- Material search: a search bar is the persistent field; a search view is a "full-screen
  modal typically opened by selecting a search icon"; the view holds history when first
  expanded, suggestions while typing, results after submit, and nests a scrolling list.
  Verified. https://github.com/material-components/material-components-android/blob/master/docs/components/Search.md
- NN/g: touch targets at least 1cm x 1cm, with spacing; larger for primary actions,
  users on the move, and users with reduced dexterity. Verified.
  https://www.nngroup.com/articles/touch-target-size/
- Apple HIG 44 x 44 pt minimum: appears in search snippets only (the HIG pages fetch
  as a bare title, so UNVERIFIED from the source). Corroborating, via snippet:
  https://dequeuniversity.com/rules/attest-ios/1.0/touch-target-size
- WCAG 2.2 SC 2.5.8: minimum 24 x 24 CSS px; the enhanced 2.5.5 is the stricter one
  for important controls (the fetch did not quote its pixel size; 2.5.5 is 44 px per
  my own knowledge, not sourced here). Verified for the 24 px part.
  https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

### 1.4 Browsing folders vs searching

- Personal file retrieval research (Bergman and colleagues; search snippet, the PDF
  fetch failed): people retrieve by folder navigation far more than by search (about
  56-68% of retrievals vs 4-15%), use search as a last resort when they forget where a
  file is, keep folders shallow (mean depth 2.86) and small (about 12 files), and
  people over fifty search more. This is about one's own files; our users often arrive
  with an ID instead. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4589681/
  and https://www.tau.ac.il/education/muse/publications/101.pdf (binary, not read)
- No source found that gives a rule for the paste-an-ID case, nor for open-on-exact-match
  with no confirm. Closest: a vendor forum note that users pasting an exact value dislike
  a combobox that picks the first partial match
  (https://community.thinkwisesoftware.com/ideas/universal-make-combo-value-prefer-exact-match-6717,
  search snippet), and NN/g's "support copy and paste". The open-on-exact-ID behaviour is
  therefore a design decision, not established guidance; mitigate with an undo (back).

## 2. The three prototypes against the guidance

Prototypes: http://100.100.189.100:8731/ (source: branch bridle/picker-proto,
prototypes/m2pz/). A omnibox, B folder browser, C full-screen sheet.

A. Omnibox (one always-visible search field, recents when empty, results below,
filename bold with folder muted).
- Supported by: 1.1 (all: search replaces the list), Baymard's 4-8 mobile suggestions
  and finger-sized rows (1.2), NN/g visible text box and paste support (1.2), the
  paste-an-ID case (nothing in the way). Bold name over muted path fits the one-line,
  no-wrap advice (Material one-line items).
- Contradicted or weak: Bergman (1.4) says people browse before they search; A has no
  browse path. Baymard's 4-8 cap conflicts with showing a scrollable list of hundreds
  of results (the cap is for suggestions, not for results; ours is a results list).

B. Folder browser (folders beside files, drill-down with back on phone, search overrides).
- Supported by: Bergman (1.4), the only prototype that matches how people find files
  they know exist; NN/g plain link lists as the dropdown alternative.
- Contradicted or weak: Bergman also says folders stay shallow and small; thousands of
  growing documents break that. Side-by-side panes need width a phone lacks (NN/g target
  size, Baymard crowding on mobile). More taps for the ID case.

C. Full-screen sheet (header button shows the path; tap opens a full-screen picker with
search, recents, results under sticky folder headings with counts).
- Supported by: Material's search view (1.3: a full-screen modal with history first,
  suggestions while typing, scrolling results), Baymard's finding that crowding on mobile
  hurts suggestions (a full screen removes the crowd), NN/g targets.
- Contradicted or weak: one extra tap to open (against the paste case); Baymard's
  mobile suggestion cap again, since results are grouped and long.

Net: the sourced guidance supports "search with a scrollable result list" (A and C)
as the replacement for the dropdown and is neutral to weak on the folder-first design
(B), whose only support is how people retrieve their own files. It does not decide
between A and C. The picker-proto worker's lean (A, plus C's grouping if browsing
matters) is consistent with the sources; Material's search bar vs search view is a
direct precedent for using A on desktop and C on a phone.

## 3. Gaps and tool failures

- Apple HIG pages (search-fields, layout, pickers): WebFetch returned only the page
  title, so Apple guidance is unverified; the pickers summary may be model-written.
- tau.ac.il PDF: WebFetch could not read it ("corrupted or improperly formatted PDF",
  binary saved by the tool). Figures come from a WebSearch snippet.
- NN/g article on type-ahead or search suggestions: none surfaced in WebSearch.
- No source for open-on-paste-of-exact-ID; see 1.4.
