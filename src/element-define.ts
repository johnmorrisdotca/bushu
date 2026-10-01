/**
 * Defines the `<bushu-picker>` element on the page. Import it for its effect:
 *
 * ```html
 * <script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/bushu@1/dist/element-define.js"></script>
 * <bushu-picker></bushu-picker>
 * ```
 *
 * A tag already defined is left as it is, and on a server, where there is no page, nothing happens.
 */
import { BushuPicker } from "./element.ts";

if (typeof customElements !== "undefined" && customElements.get("bushu-picker") === undefined) customElements.define("bushu-picker", BushuPicker);
