# Dupedia

Thinking of buying a perfume? Tell Dupedia which one, plus up to five perfumes you already love. It tells you how close it is to your taste, what it shares with your favorites, and what's new to you.

## How it works

1. **Pick the perfume you're considering.** Search by name, house or note.
2. **Add up to five you love.**
3. **See your match.** A percentage, the favorite it's closest to, the notes you'll recognize, the notes that are new, and up to two alternatives that fit you even better.

Everything runs in the browser. There are no accounts and no server: the site is plain static files.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev      # start the dev server, then open the address it prints
npm run build    # production build in dist/
npm run preview  # preview the production build
```

## Deploy

The repo publishes itself to GitHub Pages. The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to the main branch.

First-time setup: in the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

Netlify and Vercel also work: build command `npm run build`, output folder `dist`.

## How matching works

Content-based matching, the standard approach in perfume recommenders:

1. **Notes:** TF-IDF over each perfume's notes, so rare notes count more than common ones. Heart and base notes weigh more than top notes.
2. **Related notes:** note embeddings learned from which notes appear together across the database (PPMI + SVD), so a lemon perfume partly matches a bergamot one.
3. **Families:** smoothed along the fragrance wheel, so neighboring families earn partial credit.
4. **Character:** tags such as warm, fresh or sensual.

Each perfume is scored against the average of your favorites and against your single closest favorite (50/50), then ranked against every perfume in the database. The match percentage is that rank. Weights: notes 45%, families 35%, character 20% (renormalized when a perfume has no family or character data).

The result text comes from rule-based templates, not AI (see `buildText` in `src/app.js`).

## Project layout

```
index.html              page shell, loading screen and main scene
src/main.js             startup: loads data, preloads photos, plays the loading animation
src/app.js              the app: floating scene, search, matching and results
src/style.css           shared styles
public/data/dupedia.json  compact perfume data the app loads (1,774 perfumes)
public/favicon.svg      Sniff, the mascot
scripts/build-data.py   rebuilds public/data/dupedia.json from the source database
```

## Data

The app loads `public/data/dupedia.json`, which is public: anyone visiting the site can download it.

The full source database (`data/perfume-database.json`) is not in this repo. To rebuild the app data after editing it, put the file in `data/` and run (needs Python 3 and numpy):

```bash
npm run data
```

Perfume photos load from the image links in the data. Make sure you have the rights to show them before promoting the site.

## Credits

Part of the perfume data comes from the Kaggle dataset **Indonesian Parfume**, licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Data derived from it is shared under the same license.
