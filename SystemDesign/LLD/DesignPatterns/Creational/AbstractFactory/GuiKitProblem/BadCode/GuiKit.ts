// =============================================================================
// WHAT IS WRONG — missing Abstract Factory pattern
// =============================================================================
// PATTERN IDEA: an Abstract Factory produces a whole family of matching widgets
// (all-Windows or all-Mac), chosen once, so the UI stays visually consistent.
//
// WHAT'S WRONG HERE: buildForm() picks a button and a checkbox with separate
// logic, and the demo mixes WinButton with MacCheckbox. Each widget's OS is
// decided independently, so families mix.
//
// REAL SCENARIO: users see a Windows-style button next to a Mac-style checkbox on
// the same screen — an obvious visual inconsistency. As more widgets are added
// (menus, sliders), the scattered OS checks drift and more mismatches appear.
//
// WHY BAD: no guarantee all widgets share a look; OS selection is duplicated per
// widget and can diverge; inconsistent UI ships.
//
// HOW TO FIX (no code): define a GuiFactory interface (createButton(),
// createCheckbox()); WinFactory and MacFactory return matching widgets.
// buildForm() picks ONE factory; every widget is same-OS. New platform = a new
// factory.
// =============================================================================
// ❌ NO ABSTRACT FACTORY — UI widgets created ad hoc with OS checks scattered
// everywhere. Nothing guarantees a consistent FAMILY (you can mix Win button
// with Mac checkbox by accident).

class WinButton { render() { return "[Win Button]"; } }
class MacButton { render() { return "(Mac Button)"; } }
class WinCheckbox { render() { return "[Win Check]"; } }
class MacCheckbox { render() { return "(Mac Check)"; } }

export function buildForm(os: string): string {
  let btn, chk;
  if (os === "win") { btn = new WinButton(); chk = new MacCheckbox(); } // 🐛 mismatched family!
  else { btn = new MacButton(); chk = new WinCheckbox(); }              // 🐛 mismatched again
  return btn.render() + " " + chk.render();
}
console.log(buildForm("win"));
