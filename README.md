# kevin.mn

[My personal website ✌️](https://kevin.mn)

## Local Development

The site is plain HTML and CSS with a small Cloudflare Worker for redirects.
There is no client-side JavaScript or front-end framework.

Install Node.js 22.13 or newer, then:

```bash
npm ci
npm run dev
```

Open the local URL printed in the terminal. Edit `index.html` and `styles.css`;
changes reload automatically.

Before publishing, run:

```bash
npm run typecheck
npm run build
```

The `/call` redirect and the `kevin.mn` → `www.kevin.mn` redirect are defined
in `worker/index.ts`.

## License

[MIT](LICENSE)
