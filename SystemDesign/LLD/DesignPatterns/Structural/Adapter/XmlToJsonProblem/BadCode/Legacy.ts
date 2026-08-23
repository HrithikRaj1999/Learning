// =============================================================================
// WHAT IS WRONG — missing Adapter pattern
// =============================================================================
// PATTERN IDEA: an Adapter wraps a legacy/incompatible source and presents it in
// the shape modern code expects, centralizing the translation.
//
// WHAT'S WRONG HERE: LegacyUserService returns an XML string, but Dashboard wants
// structured data. The Dashboard parses the XML inline with a fragile regex —
// repeated wherever the legacy service is touched.
//
// REAL SCENARIO: every consumer of the legacy service re-implements brittle XML
// parsing (regex that breaks on attributes, namespaces, escaping). A format tweak
// in the legacy XML breaks all of them at once, and each parse can subtly differ.
//
// WHY BAD: parsing logic is duplicated and fragile; the legacy format leaks into
// every consumer; one upstream change breaks many places.
//
// HOW TO FIX (no code): define a UserService interface returning a typed User. A
// LegacyUserAdapter implements it by calling the legacy service and parsing the XML
// ONCE (with a real parser). Modern code depends on the clean interface; the XML
// detail is isolated.
// =============================================================================
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
