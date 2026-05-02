# 12 — Testing React Applications

## What You'll Master
- React Testing Library philosophy
- User-event based testing
- Mocking APIs with MSW
- Testing custom hooks
- Integration vs unit test strategies
- Async testing patterns

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Test a form submission with validation errors | All companies | Medium |
| 2 | Test async data fetching with loading/error states | Google, Meta | Medium |
| 3 | Mock an API call and verify correct rendering | Amazon, Microsoft | Medium |
| 4 | Test a custom hook with renderHook | Atlassian, Stripe | Medium |
| 5 | Write integration test for a multi-step wizard | Flipkart, Netflix | Hard |
| 6 | Test accessibility: screen reader, keyboard nav | Shopify, Vercel | Hard |

## Key Concepts
- **Test behavior, not implementation**: Query by role/label, not class/id
- **User-event over fireEvent**: Simulates real user interactions
- **MSW**: Intercepts network at service worker level — no mocking fetch
- **Arrange-Act-Assert**: Setup → interact → verify

## Testing Pattern
```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  
  render(<ContactForm onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText(/name/i), 'John');
  await user.type(screen.getByLabelText(/email/i), 'john@test.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@test.com',
  });
});

test('shows error for invalid email', async () => {
  const user = userEvent.setup();
  render(<ContactForm onSubmit={vi.fn()} />);
  
  await user.type(screen.getByLabelText(/email/i), 'invalid');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText(/valid email/i)).toBeInTheDocument();
});
```

## MSW Setup
```jsx
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```
