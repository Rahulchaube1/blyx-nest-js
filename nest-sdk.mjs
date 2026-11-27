/** Client for the public Blyx Nest registry. Runs in browsers and Node.js 20+. */
export class NestClient {
    constructor(base = "https://nest.blyx-lang.space/") {
        this.base = new URL(base.endsWith("/") ? base : base + "/");
    }

    async response(path) {
        const url = new URL(path, this.base);
        if (url.origin !== this.base.origin || !url.pathname.startsWith(this.base.pathname)) {
            throw new Error("File is outside the registry");
        }
        const result = await fetch(url);
        if (!result.ok) throw new Error("Nest returned HTTP " + result.status + " for " + url.pathname);
        return result;
    }

    async catalog() {
        return (await this.response("api/v1/discovery.json")).json();
    }

    async manifest(id, version) {
        if (!/^[a-z][a-z0-9_]{0,47}$/.test(id) || !/^(0|[1-9]\d{0,8})(\.(0|[1-9]\d{0,8})){2}$/.test(version)) {
            throw new TypeError("Use a Nest package ID and an exact X.Y.Z version");
        }
        const result = await (await this.response("api/v1/files/" + id + "/" + version + ".json")).json();
        if (result.schema !== 1 || result.package !== id || result.version !== version || !Array.isArray(result.files)) {
            throw new Error("Unexpected release manifest");
        }
        return result;
    }

    async readFile(manifest, path) {
        const file = manifest.files.find(f => f.path === path);
        if (!file) throw new Error("File is absent from the release: " + path);
        if (!/^[a-f0-9]{64}$/.test(file.sha256) ||
            ![".txt",".bin",".png"].some(ext => file.url === "content/" + file.sha256.slice(0,2) + "/" + file.sha256 + ext)) {
            throw new Error("Invalid file record");
        }
        const bytes = new Uint8Array(await (await this.response(file.url)).arrayBuffer());
        const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
        const hex = Array.from(hash, b => b.toString(16).padStart(2, "0")).join("");
        if (bytes.length !== file.size || hex !== file.sha256) throw new Error("File integrity check failed");
        return bytes;
    }
}
