// ❌ NO ADAPTER — new code wants JSON objects but a legacy service returns XML
// strings. Parsing is duplicated inline wherever the legacy service is used.
class LegacyUserService {
  getUser(id: string): string {
    return `<user><id>${id}</id><name>Ada</name></user>`; // XML string
  }
}
export class Dashboard {
  show(id: string) {
    const xml = new LegacyUserService().getUser(id);
    // brittle inline parsing repeated everywhere the legacy svc is touched
    const name = xml.match(/<name>(.*?)<\/name>/)?.[1];
    return "Welcome " + name;
  }
}
console.log(new Dashboard().show("1"));
