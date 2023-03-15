declare module "lightning-lit:*.css" {
    import { css } from "lit";
    const styles: ReturnType<typeof css>;
    export default styles;
}
