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
