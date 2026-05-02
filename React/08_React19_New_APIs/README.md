# 08 — React 19 New APIs

## What You'll Master
- `use()` hook for promises and context
- Server Components (RSC)
- Server Actions and form actions
- useFormStatus, useFormState
- useOptimistic for optimistic updates
- ref as prop (no more forwardRef)
- Document metadata in components

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Explain Server Components vs Client Components | Vercel, Meta, Netflix | Medium |
| 2 | Build a form with useFormStatus showing pending state | Shopify, Stripe | Medium |
| 3 | Implement optimistic UI with useOptimistic | Meta, Google | Hard |
| 4 | How does `use()` differ from useEffect for data fetching? | Vercel, Amazon | Hard |
| 5 | When should you use "use server" vs "use client"? | All companies | Medium |
| 6 | Build a like button with optimistic update + server action | Meta, Netflix | Hard |

## Key Concepts
- **Server Components**: Render on server, zero client JS, can access DB directly
- **`use()`**: Read promises/context in render — replaces many useEffect patterns
- **Actions**: Functions that run on server, can be passed to form `action` prop
- **useOptimistic**: Show expected result immediately, revert on failure
- **ref as prop**: No more `forwardRef` wrapper needed in React 19

## use() Hook
```jsx
// React 19 — read a promise during render
function UserProfile({ userPromise }) {
  const user = use(userPromise); // suspends until resolved
  return <h1>{user.name}</h1>;
}
```

## useOptimistic Pattern
```jsx
function LikeButton({ initialLikes, postId }) {
  const [likes, setLikes] = useState(initialLikes);
  const [optimisticLikes, addOptimistic] = useOptimistic(
    likes,
    (current, newLike) => current + newLike
  );
  
  async function handleLike() {
    addOptimistic(1); // show +1 immediately
    const updated = await likePost(postId); // server call
    setLikes(updated.likes); // sync with server
  }
  
  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>;
}
```

## Form Actions
```jsx
async function submitForm(formData) {
  'use server';
  const name = formData.get('name');
  await db.users.create({ name });
}

function SignupForm() {
  return (
    <form action={submitForm}>
      <input name="name" />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Submit'}</button>;
}
```
