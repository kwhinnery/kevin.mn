# kevin.mn

[My personal website ✌️](https://kevin.mn)

## Local Development

The site uses React, Tailwind CSS, and the Sites-compatible vinext runtime.
Install Node.js 22.13 or newer, then:

```bash
npm ci
npm run dev
```

Open the local URL printed in the terminal. Changes under `app/` reload
automatically.

Before publishing, run:

```bash
npm run build
```

The `/call` redirect and the `kevin.mn` → `www.kevin.mn` redirect are defined
in `worker/index.ts`.

## License

[MIT](LICENSE)
