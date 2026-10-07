import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");
const read = (p: string) => readFileSync(join(root, p), "utf-8");

describe("mobile input zoom", () => {
	it("sets input, textarea and select to at least 16px in the global CSS", () => {
		const css = read("src/index.css");
		const rule = css.match(/input\s*,\s*textarea\s*,\s*select\s*\{([^}]*)\}/);
		expect(rule).not.toBeNull();
		const size = rule?.[1].match(/font-size:\s*(\d+(?:\.\d+)?)px/);
		expect(Number(size?.[1])).toBeGreaterThanOrEqual(16);
		expect(css).toMatch(/touch-action:\s*manipulation/);
	});

	it("keeps a field's own font-size from going under 16px", () => {
		// A utility or inline size on a field would lose to the global rule only
		// by accident of CSS order; forbid them so the 16px floor stays real.
		for (const f of [
			"Document",
			"Items",
			"Login",
			"SpecPage",
			"System",
			"Tasks",
			"Time",
		]) {
			const src = read(`src/${f}.tsx`);
			for (const tag of src.match(/<(input|textarea|select)\b[^>]*>/g) ?? []) {
				expect(tag, `${f}: ${tag}`).not.toMatch(
					/text-(xs|sm)\b|fontSize|font-size/,
				);
			}
		}
	});

	it("has the viewport meta that disables zoom", () => {
		const html = read("index.html");
		expect(html).toContain(
			"width=device-width, initial-scale=1.0, maximum-scale=1, viewport-fit=cover",
		);
	});
});
