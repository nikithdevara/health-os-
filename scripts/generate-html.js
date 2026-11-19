import { readdirSync, writeFileSync } from "node:fs";

const clientDir = "dist/client";
const assetsDir = "dist/client/assets";

try {
  const files = readdirSync(assetsDir);
  const mainCss = files.find((f) => f.startsWith("index-") && f.endsWith(".css"));
  const mainJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HealthOS — The health layer that stays with you</title>
    <meta name="description" content="HealthOS connects people, clinicians, hospitals, laboratories and pharmacies through consent-first health records." />
    <meta name="theme-color" content="#087F5B" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
    ${mainCss ? `<link rel="stylesheet" href="/assets/${mainCss}" />` : ""}
  </head>
  <body data-react-root="true">
    <!--$--><!--$--><!--/$--><!--/$-->
    <section aria-label="Notifications alt+T" tabindex="-1" aria-live="polite" aria-relevant="additions text" aria-atomic="false" data-react-aria-top-layer="true"></section>
    <script>
      (self.$R = self.$R || {})["tsr"] = [];
      self.$_TSR = {
        h() { this.hydrated = true; this.c(); },
        e() { this.streamEnded = true; this.c(); },
        c() {
          if (this.hydrated && this.streamEnded) {
            delete self.$_TSR;
            delete self.$R.tsr;
          }
        },
        p(e) { this.initialized ? e() : this.buffer.push(e); },
        buffer: []
      };
      self.$_TSR.router = {
        manifest: { routes: {} },
        matches: [
          { i: "__root__#", u: Date.now(), s: "success", ssr: true },
          { i: "#_authed#", u: Date.now(), s: "pending", ssr: false }
        ],
        dehydratedData: {}
      };
    </script>
    ${mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : ""}
    <script>
      if (self.$_TSR && self.$_TSR.e) {
        self.$_TSR.e();
      }
    </script>
  </body>
</html>
`;

  writeFileSync(`${clientDir}/index.html`, html, "utf8");
  console.log(`[generate-html] Generated ${clientDir}/index.html with CSS: ${mainCss}, JS: ${mainJs}`);
} catch (err) {
  console.error("[generate-html] Error generating index.html:", err);
}
