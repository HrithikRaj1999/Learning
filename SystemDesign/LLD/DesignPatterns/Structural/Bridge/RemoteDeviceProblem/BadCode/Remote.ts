// ❌ NO BRIDGE — Remote x Device combined by inheritance => class explosion.
// {Basic,Advanced} remotes x {TV,Radio} devices = 4 classes; add a device = x2.
export class BasicTvRemote { power() { return "TV on/off"; } }
export class AdvancedTvRemote { power() { return "TV on/off"; } mute() { return "TV mute"; } }
export class BasicRadioRemote { power() { return "Radio on/off"; } }
export class AdvancedRadioRemote { power() { return "Radio on/off"; } mute() { return "Radio mute"; } }
// add Projector => BasicProjectorRemote + AdvancedProjectorRemote ...
console.log(new AdvancedTvRemote().mute());
