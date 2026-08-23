// =============================================================================
// WHAT IS WRONG — missing Flyweight pattern
// =============================================================================
// PATTERN IDEA: Flyweight shares INTRINSIC state (identical across many objects)
// in one place, leaving only EXTRINSIC per-instance state on each object.
//
// WHAT'S WRONG HERE: every Marker stores its own copy of the icon bytes, which are
// identical for all markers of a category. The heavy icon is duplicated per marker.
//
// REAL SCENARIO: a map rendering 50k "restaurant" markers holds 50k copies of the
// same icon image — wasted memory that hurts pan/zoom performance on the client.
// Only lat/lng differ per marker; the category icon is shared.
//
// WHY BAD: identical icon data is duplicated across thousands of markers; memory
// scales with marker count instead of category count.
//
// HOW TO FIX (no code): a MarkerIcon flyweight holds the icon bytes per category,
// created once via a factory keyed by category. Each Marker stores only lat, lng
// and a reference to its shared MarkerIcon. 50k markers, a few icons.
// =============================================================================
// ❌ NO FLYWEIGHT — each map marker stores its own icon image bytes. Rendering
// 50k "restaurant" markers duplicates the same icon 50k times.
export class Marker {
  constructor(
    public lat: number, public lng: number,
    public iconBytes: number[], // intrinsic heavy, same per category
    public category: string,    // intrinsic
  ) {}
}
const icon = new Array(512).fill(7);
const markers: Marker[] = [];
for (let i = 0; i < 5; i++) markers.push(new Marker(i, i, [...icon], "restaurant"));
console.log("markers:", markers.length);
