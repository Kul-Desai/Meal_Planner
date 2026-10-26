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

### 2. Onboarding: eight quick questions
One question per screen (mobile and desktop), styled as a tap-through quiz: big heading, emoji tiles, progress bar, back arrow, and a full-width Continue button that stays disabled until the answer is valid. Sensible defaults so the user can move fast. Visual references: `docs/design/REFERENCES.md`.

| # | Question | Input | Stored as |
|---|----------|-------|-----------|
| 1 | What are you in the mood for? | Pick up to 3 mood tags: Speedy, Lighter, Family favorites, Healthy comfort, Fakeaway (takeout-style at home), Gut friendly, Protein packed | `mood_tags[]` |
| 2 | Which days will you be cooking? | Day toggles M to S (default Mon to Fri); plan starts from the next selected day | `cooking_days[]` (0 = Sun ... 6 = Sat) |
| 3 | How many people are you cooking for? | Stepper 1 to 6 (default 2), optional "includes kids" toggle | `household_size`, `has_kids` |
| 4 | Any dietary needs? | Pick one: None, Vegetarian, Vegan, Pescatarian | `diet` |
| 5 | Any allergies? | Pick all: None, Gluten, Dairy, Nuts (peanut and tree nut), Egg, Shellfish, Fish, Sesame, Soy | `allergies[]` |
| 6 | Which proteins do you like? | Pick all: Chicken, Beef, Pork, Fish, Shellfish, Tofu, Paneer, Eggs, Beans and lentils. Proteins not picked are never used (this is how "no pork, no beef" is expressed). Options that conflict with the diet are hidden | `protein_likes[]` |
| 7 | Any dislikes? | Text input with add button, plus common-pick chips (mushrooms, olives, coriander, chilli, onions, cream, ...) | `dislikes[]` |
| 8 | Quick weeknight meals or longer cooking? | Under 30 min, 30 to 45 min, up to 60 min; weekends can be longer | `max_minutes_weekday`, `max_minutes_weekend` |

Finish screen ("Your plan is ready to build") confirms back in plain words, for example:
> Got it: cooking Mon to Fri for 2, healthy comfort and speedy meals, chicken, fish and beans (no pork or beef), no allergies, about 30 to 45 minutes.

Reminders are not asked during onboarding; they are opt-in from Settings (Phase 09).

### 3. Draft plan
- Generated for the chosen number of days starting from the chosen date, dinner only for v1.
- Each night is a card: day pill, **photo slot** (colored placeholder now; AI food photo in Later 1), meal title, one-line description, a colored **mood tag** (from the user's picks), total minutes, servings, and which ingredients it shares with other nights.
- Plan home header: greeting with first name ("Good morning, Chef KD"), plan date range, and two summary cards side by side: **Tonight** (what's for dinner) and **Grocery list** (items bought / total).
- Some meals offer a protein choice ("chicken, tofu, or paneer, you pick one"). The user's pick is saved on that night.
- A summary line lists the shared ingredients that keep shopping short.
- Primary actions: **Lock in this plan** and **Swap a night**.

### 4. Swap a night
- User picks a night and a reason: "I don't like this", "Missing an ingredient", "Need something quicker", "Plans changed (skip)", or free text.
- Only that night changes. The replacement prefers ingredients already used elsewhere in the week.
- If the reason reveals a lasting preference (for example "I don't eat mushrooms"), offer: "Add mushrooms to your dislikes?"

### 5. Lock in and grocery list
- Locking in turns the plan into a grocery list grouped by store section (Produce, Protein, Dairy and eggs, Pantry, Bakery, Frozen, Other).
- Quantities are combined and scaled to household size, with the chosen protein applied.
- User can check items off, add their own items, remove items, and copy or share the list as text.
- *Deferred (lean plan):* subtracting planned leftovers, pantry staples, and "already have it".

### 6. During the week
- **Tonight card** at the top of the Plan home; tapping it opens the **Tonight view** (`/today`): what's for dinner tonight, quick prep steps, ingredients, time, cook mode.
- **Swap tonight** if plans change or an ingredient is missing. The grocery list updates if the list is still open.
- *Deferred (lean plan):* leftover suggestions, cook mode, and daily dinner reminders (Later 2).

### 7. Feedback and learning
- After a meal's date passes, ask a one-tap question: Loved it / It was fine / Not again.
- Loved meals are favored in future plans; "Not again" meals are excluded.
- Users can view and edit everything the app remembers in Settings (preferences) and on the Meals tab (loved meals, excluded meals).

### 8. Recurring plans
- "Draft next week" builds a new plan from saved preferences and feedback. The user approves or swaps a night.
- *Deferred (lean plan):* automatic weekly drafting.

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

### v1 (MVP, lean plan: Phases 03 to 05)
- Auth, onboarding, draft plan, swap a night, lock in, grocery list, tonight view, feedback, Meals tab, draft next week, settings.
- Dinner only.
- Responsive web app that works well on phone and desktop browsers.

### v1.1
- Installable app (PWA) on desktop and phone, reminders, offline grocery list.

### Not planned
- Paid plans or free trials (app is free for now; decided 2026-10-26).
- Health tracking (calories, weight, activity, medical goals).
- Google Play listing (dropped 2026-10-26; Android users install the PWA from the website instead).

### Later (not now)
- Breakfast and lunch, nutrition info, weekly budget and cost per meal (deferred 2026-10-26), recipe photos uploaded by users, sharing a household between two accounts, grocery delivery integrations, iOS App Store.

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
