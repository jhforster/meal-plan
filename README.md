# Meal Plan

A tiny, mobile-first weekly meal plan published with GitHub Pages.

## Update the current week

1. Copy the current week's full recipe content into an archive page before replacing it.
2. Update `index.html` with the new dates, overview, recipes, and `data-date` values.
3. Add the archived week to the Past Weeks section.
4. Open `index.html` locally or run a static server to check the page.
5. Commit and push to `main`.

## Local preview

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

Publish the `main` branch from the repository root with GitHub Pages. Because the `jhforster.github.io` user site uses `jhforster.me`, this project site will be available at:

```text
https://jhforster.me/meal-plan/
```
