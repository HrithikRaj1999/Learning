// =============================================================================
// WHAT IS WRONG — missing Abstract Factory pattern
// =============================================================================
// PATTERN IDEA: an Abstract Factory creates a family of matching themed widgets
// (all-dark or all-light), selected once, so a screen is visually coherent.
//
// WHAT'S WRONG HERE: buildScreen() chooses the button by theme but hardcodes a
// LightInput. The button and input themes are decided independently, so they
// mismatch.
//
// REAL SCENARIO: a dark-mode user gets a dark button next to a light input — a
// jarring, visible theming bug. Every new widget adds another theme check that can
// be forgotten or hardcoded wrong, multiplying inconsistencies.
//
// WHY BAD: theme consistency is unenforced; the theme decision is duplicated per
// widget and drifts; broken-looking screens ship.
//
// HOW TO FIX (no code): define a ThemeFactory interface (createButton(),
// createInput()); DarkThemeFactory and LightThemeFactory return matching widgets.
// buildScreen() picks ONE factory; all widgets share the theme. New theme = a new
// factory.
// =============================================================================
// ❌ NO ABSTRACT FACTORY — themed widgets built per-widget with theme checks.
// Real bug: a dark button next to a light input on the same screen.
class LightButton { css() { return "bg:white"; } }
class DarkButton { css() { return "bg:black"; } }
class LightInput { css() { return "border:gray"; } }
class DarkInput { css() { return "border:white"; } }

export function buildScreen(theme: string) {
  const button = theme === "dark" ? new DarkButton() : new LightButton();
  const input = new LightInput(); // 🐛 hardcoded light -> mismatched with dark button
  return button.css() + " | " + input.css();
}
console.log(buildScreen("dark"));
