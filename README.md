# Jenil Patel — Cybersecurity Portfolio

A standalone static portfolio for GitHub Pages at https://spyderhacker.tech.

## Website files

- `index.html`: résumé-based content and page layout
- `styles.css`: responsive cybersecurity theme
- `app.js`: project dialogs and accessible profile tabs
- `Jenil-Patel-Resume.pdf`: original résumé download
- `fonts/`: self-hosted fonts and licenses
- `CNAME`: custom domain configuration
- `.nojekyll`: serve the files directly without a Jekyll build

All biographical information comes from the provided résumé. No backend,
account login, external JavaScript dependencies, or build step is required.

## Preview

Run `python -m http.server 8000` from this directory, then open
http://localhost:8000.

## Publish

In GitHub Settings → Pages, select **Deploy from a branch**, the `main` branch,
and `/(root)`. Set the custom domain to `spyderhacker.tech` before changing DNS.

## DNS

Replace the previous website A records (`162.159.143.30` and `172.66.3.26`)
with these four GitHub Pages A records for host `@`:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Keep your existing nameservers. Other mail records are unrelated to this migration.
After migration, the previous `_openai-site-verification` and
`_cf-custom-hostname` TXT records are no longer needed for this website.
Enable Enforce HTTPS in GitHub Pages when the certificate is ready.

Reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Fonts

Oxanium and IBM Plex Mono are distributed under the SIL Open Font License.
License files accompany the fonts in `fonts/`.
