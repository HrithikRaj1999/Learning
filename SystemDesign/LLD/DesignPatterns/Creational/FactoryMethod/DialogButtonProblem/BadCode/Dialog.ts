// =============================================================================
// WHAT IS WRONG — missing Factory Method pattern
// =============================================================================
// PATTERN IDEA: a base class defers object creation to a createX() method that
// subclasses override. The base's logic uses the product without knowing its
// concrete type.
//
// WHAT'S WRONG HERE: Dialog.render() if/else-news up the concrete button per
// platform. Creation (which button) is tangled with the rendering logic.
//
// REAL SCENARIO: add a LinuxButton or a MobileButton — you edit Dialog's if/else,
// and any other method that builds a button repeats the same branching. The
// dialog can't be reused for a new platform without modifying it (OCP break).
//
// WHY BAD: creation logic is fused into business logic and duplicated; every new
// platform edits the Dialog.
//
// HOW TO FIX (no code): give Dialog an abstract createButton() factory method;
// WindowsDialog/HtmlDialog subclasses override it to return their button.
// render() calls createButton() and uses the result. New platform = a new Dialog
// subclass; render() never changes.
// =============================================================================
// ❌ NO FACTORY METHOD — Dialog hardcodes which Button to build per platform.
// Rendering logic and creation logic are tangled; new platform edits Dialog.
class WindowsButton { render() { return "[Win]"; } }
class HtmlButton { render() { return "<button>"; } }

export class Dialog {
  render(platform: string): string {
    let button: WindowsButton | HtmlButton;
    if (platform === "windows") button = new WindowsButton(); // tangled
    else button = new HtmlButton();
    return "Dialog with " + button.render();
  }
}
console.log(new Dialog().render("windows"));
