// ❌ DEEP NESTING — arrow/pyramid code. Happy path buried 5 levels deep.
export function process(user: any): string {
  if (user) {
    if (user.isActive) {
      if (user.subscription) {
        if (user.subscription.isPaid) {
          if (user.permissions && user.permissions.length > 0) {
            return "access granted to " + user.name; // the only real work
          } else {
            return "no permissions";
          }
        } else {
          return "not paid";
        }
      } else {
        return "no subscription";
      }
    } else {
      return "inactive";
    }
  } else {
    return "no user";
  }
}
