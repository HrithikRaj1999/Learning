// =============================================================================
// WHAT IS WRONG — missing Bridge pattern
// =============================================================================
// PATTERN IDEA: Bridge separates the control abstraction (Remote) from the
// implementation (Device) so each varies independently and they combine by
// composition.
//
// WHAT'S WRONG HERE: Remote type (Basic/Advanced) is fused with Device type
// (TV/Radio) by inheritance — BasicTvRemote, AdvancedTvRemote, BasicRadioRemote,
// AdvancedRadioRemote. The remote's features are duplicated per device.
//
// REAL SCENARIO: add a Projector device and you need BasicProjectorRemote +
// AdvancedProjectorRemote; add a "Universal" remote and every device gets another
// class. Remotes(M) × Devices(N) = M*N classes. The mute()/power() logic is copied
// across device variants.
//
// WHY BAD: combinatorial class explosion; remote features duplicated per device;
// every new device or remote multiplies classes.
//
// HOW TO FIX (no code): Device is an interface (TV/Radio/Projector implementations
// with power/volume primitives); Remote is the abstraction (Basic/Advanced) holding
// a Device and calling its primitives. Remotes and devices grow independently:
// M + N classes, any pairing by composition.
// =============================================================================
// ❌ NO BRIDGE — Remote x Device combined by inheritance => class explosion.
// {Basic,Advanced} remotes x {TV,Radio} devices = 4 classes; add a device = x2.
export class BasicTvRemote { power() { return "TV on/off"; } }
export class AdvancedTvRemote { power() { return "TV on/off"; } mute() { return "TV mute"; } }
export class BasicRadioRemote { power() { return "Radio on/off"; } }
export class AdvancedRadioRemote { power() { return "Radio on/off"; } mute() { return "Radio mute"; } }
// add Projector => BasicProjectorRemote + AdvancedProjectorRemote ...
console.log(new AdvancedTvRemote().mute());
