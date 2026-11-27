# Blyx Nest JavaScript SDK

Inspect a specific Blyx release from a browser or Node.js 20 and later. The SDK has no runtime dependencies. Supply a registry URL to use a local mirror.

```js
import { NestClient } from "./nest-sdk.mjs";

const nest = new NestClient();
const manifest = await nest.manifest("moments", "0.1.0");
const bytes = await nest.readFile(manifest, "main.blyx");
console.log(new TextDecoder().decode(bytes));
```

Use `await nest.catalog()` to list current packages and tools. Save a manifest to reuse it for more than one read. Each read checks the size and SHA-256 of the bytes against that manifest. HTTP, missing-file, and integrity errors reject the promise. Trust the registry that serves the manifest.

[Download the ES module](https://nest.blyx-lang.space/nest-sdk.mjs) · [Registry](https://nest.blyx-lang.space/) · [Blyx Discord](https://discord.gg/ZPNWqNsvC) · [Rahul Chaube](https://github.com/Rahulchaube1) · [Sponsor](https://github.com/sponsors/Rahulchaube1)
