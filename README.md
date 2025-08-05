# 🧾 Nestbox AI Developer Documentation

This repository contains the source code for the Nestbox AI developer documentation site, built with [Docusaurus](https://docusaurus.io/). It includes API documentation, guides, and integration instructions to help developers build with Nestbox AI.

---

## ⚙️ Configuration

Main configuration is located in `siteConfig.ts`:

| Key                | Description                          | Example                       |
| ------------------ | ------------------------------------ | ----------------------------- |
| `siteName`         | Name of the project                  | Nestbox AI                    |
| `siteLandingURL`   | Marketing site URL                   | https://nestbox.ai/           |
| `siteDashboardURL` | Product dashboard URL                | https://demo.nestbox.ai/      |
| `productionURL`    | Deployed documentation URL           | https://developers.nestbox.ai |
| `githubURL`        | GitHub organization or repository    | https://github.com/NestboxAI/ |
| `stackOverflowTag` | Stack Overflow tag for support links | nestboxai                     |

### Static assets

Update the following files in the `static` folder:

-   Favicon files: `static/favicon/`
-   Social card (used in previews): `static/img/social-card.jpg`

---

## 🧑‍💻 Development

1. Install dependencies:

    ```bash
    npm install
    ```

2. Pull API specs from external repository

    ```bash
    git clone https://github.com/NestboxAI/nestbox-ai-clients.git
    mkdir -p specs
    mv nestbox-ai-clients/specs/* specs/
    rm -rf nestbox-ai-clients
    ```

3. Generate API documentation:

    ```bash
    npm run docusaurus gen-api-docs all
    ```

4. Start the development server:

    ```bash
    npm start
    ```

## 🏗 Build for Production

To generate a static production build of the documentation site:

```bash
npm run build
```