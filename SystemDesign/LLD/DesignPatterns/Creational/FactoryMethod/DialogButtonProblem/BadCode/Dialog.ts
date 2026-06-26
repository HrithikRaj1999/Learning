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
