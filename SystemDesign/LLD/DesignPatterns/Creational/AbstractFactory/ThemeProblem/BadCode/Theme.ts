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
