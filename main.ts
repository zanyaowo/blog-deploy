import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // If the request is for a directory, try to serve the index.html file.
  if (pathname.endsWith("/")) {
    const filePath = `./${pathname}index.html`;
    try {
      const file = await Deno.open(filePath, { read: true });
      const stat = await file.stat();
      file.close(); // Close the file handle immediately
      if (stat.isFile) {
        return serveDir(req, {
          fsRoot: ".",
          urlRoot: "",
        });
      }
    } catch (e) {
      // If index.html doesn't exist, serveDir will handle the 404.
    }
  }
  
  return serveDir(req, {
    fsRoot: "./dist",
    urlRoot: "",
    enableCors: true
  });
});
