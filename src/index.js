/**
 * GitHub Fetch Worker
 * Fetches a GitHub artifact zip file and returns it to the client
 */

// const GITHUB_API_TOKEN =

export default {
  async fetch(request, env, ctx) {
    // The GitHub artifact URL
    const artifactUrl =
      "https://api.github.com/repos/zed-industries/zed/actions/artifacts/4398903974/zip";

    try {
      // Fetch the artifact from GitHub
      const pathname = new URL(request.url).pathname;

      let response;
      if (pathname === "/broken") {
        response = await fetch(artifactUrl, {
          headers: {
            "User-Agent": "Cloudflare-Worker",
            Authorization: `Bearer ${GITHUB_API_TOKEN}`,
          },
        });
      } else if (pathname === "/fixed") {
        response = await fetch(artifactUrl, {
          headers: {
            "User-Agent": "Cloudflare-Worker",
            Authorization: `Bearer ${GITHUB_API_TOKEN}`,
          },
          redirect: "manual",
        });
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get("Location");
          if (location) {
            response = await fetch(location, {
              headers: {
                "User-Agent": "Cloudflare-Worker",
              },
            });
          }
        }
      } else {
        return new Response("Invalid path. Use /broken or /fixed.", {
          status: 400,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      // Check if the fetch was successful
      if (!response.ok) {
        return new Response(
          `Failed to fetch artifact: ${response.status} ${response.statusText}`,
          {
            status: response.status,
            headers: {
              "Content-Type": "text/plain",
            },
          },
        );
      }

      // Get the response body
      const blob = await response.blob();

      // Return the zip file to the client with appropriate headers
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": 'attachment; filename="zed-artifact.zip"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (error) {
      return new Response(`Error fetching artifact: ${error.message}`, {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  },
};
