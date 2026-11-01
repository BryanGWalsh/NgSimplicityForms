# Contributing to the docs

This site is an Angular application in the same Nx workspace as the library (`apps/docs`). The demos import the library from source, so they always show the current code, and the API reference is generated from the source on every build.

## Run it locally

```bash
npm install
npx nx serve docs
```

Open http://localhost:4200. The `serve` and `build` targets first run `docs:api`, which regenerates the API data with TypeDoc.

## Where things live

| Path | What |
| --- | --- |
| `apps/docs/src/content/**.md` | Guide, tutorial and reference pages (Markdown). |
| `apps/docs/src/app/nav.ts` | The sidebar: page titles, URLs and Markdown files. |
| `apps/docs/src/app/demos/` | Live demos. Each is a standalone component; its source is shown in the demo's code tabs. |
| `apps/docs/src/app/demos/demo-registry.ts` | The list of demos that pages can embed. |
| `apps/docs/scripts/generate-api.mjs` | Turns TypeDoc output into `src/generated/api.json` (git-ignored). |
| `.github/workflows/docs.yml` | Builds the site and deploys it to GitHub Pages. |

## Writing a page

1. Add a Markdown file under `src/content`.
2. Add an entry to `NAV` in `nav.ts`.
3. Link to other pages with absolute paths, for example `[Layout](/guides/layout)` or `[an anchor](/guides/layout#rows)`.

Markdown extras:

- `> **Tip**`, `> **Note**`, `> **Warning**` and `> **Important**` blockquotes become callouts.
- A code fence can have a title: <code>```ts title=app.config.ts</code>.
- `::: demo <id>` on its own line embeds a live demo.

## Adding a demo

1. Create `src/app/demos/<id>/<id>.demo.ts` with a standalone component that provides `NgsFormsService`, registers its components in the constructor, and renders `<ngs-form>`.
2. Register it in `demo-registry.ts` with a title, its theme and the files to show.
3. Embed it in a page with `::: demo <id>`.

Keep demos of different themes (Bootstrap, Material, Tailwind) on separate pages: the component registry is shared by the whole page. Tailwind demos can use any Tailwind class: the docs build scans `src/app/demos` and the Tailwind package. Tailwind's preflight reset is not loaded, so the rest of the site keeps its Bootstrap styles.

## API reference

The reference comes from TSDoc comments in `libs/*/src`. To improve it, edit the comments next to the code. Supported tags include `@remarks`, `@example`, `@defaultValue`, `@deprecated` and the custom `@notImplemented` modifier, which shows the "not implemented" badge.

## Deployment

Every push to `main` that touches the docs or the libraries runs `.github/workflows/docs.yml`, which builds the site and publishes it to GitHub Pages. Pull requests run the build without deploying. The workflow copies `index.html` to `404.html` so deep links work.

The site is built for the root of a domain (`<base href="/">`), which is what a custom domain gives you. One-time setup in the repository:

1. **Settings → Pages → Build and deployment**: set the source to **GitHub Actions**.
2. **Settings → Pages → Custom domain**: enter the domain and save. With Actions deployments the domain lives in this setting, not in a `CNAME` file.
3. At your DNS provider, add a `CNAME` record from the subdomain to `bryangwalsh.github.io` (or `A`/`AAAA` records to GitHub's Pages addresses for an apex domain), then tick **Enforce HTTPS** once the certificate is issued.

To serve the site from `https://<user>.github.io/<repo>/` instead, build with `npx nx build docs --base-href /NgSimplicityForms/`.
