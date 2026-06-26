// ❌ DEEP NESTING — defensive null checks pyramid over optional chains.
export function city(user: any): string {
  if (user) {
    if (user.profile) {
      if (user.profile.address) {
        if (user.profile.address.city) {
          return user.profile.address.city;
        } else { return "no city"; }
      } else { return "no address"; }
    } else { return "no profile"; }
  } else { return "no user"; }
}
