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
