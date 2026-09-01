# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev
& build performances. To add it, see
[this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript
with type-aware lint rules enabled. Check out the
[TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
for information on how to integrate TypeScript and
[`typescript-eslint`](https://typescript-eslint.io) in your project.

## News Letters

sales → any sale/discount campaign → old items on sale → new items launched
directly on sale → special offers / reduced prices

workshops → workshop-related news → new master class announcements sales →
discounts and sale items

# How To send

{ "type": "new-items", "skus": [ "BR-20260623-002", "BR-20260623-003" ] }

// Newly created master class { type: "new-master-class", itemId:
"intro-brooch-making-advanced" }

// Reminder about an existing master class { "type": "master-class-reminder",
"itemId": "intro-brooch-making"}
