# Product Brief: Meal Planner

Working name: **Meal Planner** (rename later; the name lives in `src/config/site.ts` only).

## One-line pitch

Answer four questions once. The app plans your dinners, builds one combined grocery list, adjusts a single night when life changes, and gets closer to what you actually like every week.

## Who it is for

- Busy people cooking for themselves or a small household (1 to 6 people).
- People with dietary rules (vegetarian, no pork or beef, allergies, dislikes) who are tired of filtering generic recipe sites.
- People who want weeknight meals in 30 to 45 minutes and short shopping trips.

## Core promise (what must feel magical)

1. **Answer once.** Preferences are asked at onboarding and never asked again unless the user changes them.
2. **Plans share ingredients.** The week reuses rice, vegetables, a protein, etc., so the grocery list stays short.
3. **Swap one night, not the whole week.** Any change touches only the affected night.
4. **The grocery list is correct.** Duplicates combined, quantities scaled to household size, leftovers and pantry items already subtracted.
5. **It learns.** Loved meals come back; disliked meals do not.

## User journey

```
Sign up  ->  Onboarding (4 questions)  ->  Draft plan  ->  Swap a night (optional)
   ->  Lock in plan  ->  Grocery list  ->  During the week (tonight view, swaps, leftovers)
   ->  Feedback  ->  Next week's draft starts from what worked
```

### 1. Sign up / sign in
- Email (magic link or one-time code) and Google sign-in via Supabase Auth.
- After first sign-in with no saved preferences, route to onboarding. Otherwise route to the current week.

### 2. Onboarding: the four questions
One question per screen on mobile, all on one page on desktop is acceptable. Each has sensible defaults so the user can move fast.

| # | Question | Input | Stored as |
|---|----------|-------|-----------|
| 1 | How many days do you want planned? | 3, 5, or 7 days (default 5); start date defaults to today | `plan_days`, `week_start_day` |
| 2 | Who are you cooking for? | Number of people (1 to 6), optional "kids" toggle | `household_size` |
| 3 | Any dietary rules? | Diet presets (vegetarian, vegan, pescatarian, no pork, no beef, halal-style, none), allergies (peanut, tree nut, dairy, egg, gluten, shellfish, fish, soy, sesame), free-text dislikes | `diet_flags[]`, `allergies[]`, `dislikes[]` |
| 4 | Quick weeknight meals or longer cooking? | Under 30 min, 30 to 45 min, up to 60 min, weekends can be longer | `max_minutes_weekday`, `max_minutes_weekend` |

Finish screen confirms back in plain words, for example:
> Got it: cooking for 2, no pork, no beef, no allergies, about 30 to 45 minutes.

### 3. Draft plan
- Generated for the chosen number of days starting from the chosen date, dinner only for v1.
- Each night shows: day and date, meal title, one-line description, total minutes, and which ingredients it shares with other nights.
- Some meals offer a protein choice ("chicken, tofu, or paneer, you pick one"). The user's pick is saved on that night.
- A summary line lists the shared ingredients that keep shopping short.
- Primary actions: **Lock in this plan** and **Swap a night**.

### 4. Swap a night
- User picks a night and a reason: "I don't like this", "Missing an ingredient", "Need something quicker", "Plans changed (skip)", or free text.
- Only that night changes. The replacement prefers ingredients already used elsewhere in the week.
- If the reason reveals a lasting preference (for example "I don't eat mushrooms"), offer: "Add mushrooms to your dislikes?"

### 5. Lock in and grocery list
- Locking in turns the plan into a grocery list grouped by store section (Produce, Protein, Dairy and eggs, Pantry, Bakery, Frozen, Other).
- Quantities are combined and scaled to household size; items the user marked as already at home are subtracted; planned leftovers (for example extra rice cooked Monday for Thursday's fried rice) are accounted for.
- User can check items off, add their own items, remove items, mark "already have it", and copy or share the list as text.

### 6. During the week
- **Tonight view** (home screen during an active week): what's for dinner tonight, quick prep steps, ingredients, time.
- **Swap tonight** if plans change or an ingredient is missing. The grocery list updates if the list is still open.
- **Leftover help:** suggest what to do with leftovers ("You have half a cabbage left: add it to Friday's soup").
- **Reminders:** optional daily reminder of tonight's dinner (email first, push notification once the app is installable).

### 7. Feedback and learning
- After a meal's date passes, ask a one-tap question: Loved it / It was fine / Not again.
- Loved meals are favored in future plans; "Not again" meals are excluded.
- Users can view and edit everything the app remembers in Settings (preferences, favorites, excluded meals).

### 8. Recurring plans
- "Draft next week" builds a new plan from saved preferences and feedback. The user approves or swaps a night.
- Optional auto-draft: every week on the user's chosen day, the next plan is drafted and the user is notified.

## Example output (target quality)

> **Week of Monday, Oct 26: dinners for 2, 30 to 45 minutes, no pork or beef**
> - Mon: Chicken stir-fry. Rice + mixed vegetables + chicken, with soy sauce, garlic and ginger
> - Tue: Bean tacos. Black beans, tortillas, salsa, cabbage slaw, and cheese
> - Wed: Chickpea pasta. Pasta + tomato sauce + chickpeas + spinach
> - Thu: Fried rice. Leftover rice + mixed vegetables + egg
> - Fri: Lentil soup. Lentils, carrots, onion and broth, with bread
>
> Shared across nights: rice, mixed vegetables, chicken, canned tomatoes, cabbage, spinach.
>
> Grocery list for 2: Produce (mixed vegetables, cabbage, spinach, onions, garlic, ginger, carrots), Protein (chicken thighs about 1 lb, eggs, canned black beans, canned chickpeas, dried lentils), Pantry (rice, tortillas, pasta, canned tomatoes, salsa, soy sauce, broth, bread, shredded cheese).

## Scope

### v1 (MVP, ship this first)
- Auth, onboarding, draft plan, swap a night, lock in, grocery list, tonight view, feedback, draft next week, settings.
- Dinner only.
- Responsive web app that works well on phone and desktop browsers.

### v1.1
- Installable app (PWA) on desktop and phone, reminders, offline grocery list.
- Google Play listing.

### Later (not now)
- Breakfast and lunch, nutrition info, budget estimates, recipe photos uploaded by users, sharing a household between two accounts, grocery delivery integrations, iOS App Store.

## Non-negotiables

- **Allergies are safety-critical.** An allergen must never appear in a plan. AI output is always checked by code, and the UI reminds users to check product labels.
- **Users own their data.** Every row is protected by Row Level Security; users can export and delete their account and data.
- **Fast.** Plan generation shows progress and completes in under ~15 seconds; everything else feels instant.
- **Plain language.** No jargon in the interface.

## Success metrics (track from launch)

- Onboarding completion rate.
- Percent of drafts locked in (target: most drafts locked with 0 or 1 swaps).
- Weekly retention: users who draft a second and third week.
- Grocery list usage: items checked off per week.
- Feedback rate and share of "Loved it".
