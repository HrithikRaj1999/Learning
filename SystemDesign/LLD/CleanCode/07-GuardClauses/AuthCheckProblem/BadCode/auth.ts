// ❌ DEEP NESTING — permission check pyramid; the grant is buried, errors far away.
export function canEdit(user: any, doc: any): string {
  if (user) {
    if (user.isVerified) {
      if (doc) {
        if (doc.ownerId === user.id || user.role === "admin") {
          if (!doc.locked) {
            return "can edit";
          } else { return "doc locked"; }
        } else { return "not owner"; }
      } else { return "no doc"; }
    } else { return "not verified"; }
  } else { return "no user"; }
}
