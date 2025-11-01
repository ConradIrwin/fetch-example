/**
 * GitHub Fetch Worker
 * Fetches a GitHub artifact zip file and returns it to the client
 */

const GITHUB_API_TOKEN = ;
  // export default {
  async function testFetch(request, env, ctx) {
    // The GitHub artifact URL
    const artifactUrl =
      "https://api.github.com/repos/zed-industries/zed/actions/artifacts/4398903974/zip";

    if (process.argv[2] == "default") {
      // test the default behaviour of node.
      response = await fetch(artifactUrl, {
        headers: {
          "User-Agent": "Cloudflare-Worker",
          Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        },
      });
    } else if (process.argv[2] == "fixed") {
      // correct behaviour as implemented by default in Node, Chrome, Safari
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
    } else if (process.argv[2] == "broken") {
      // current erroneous cloudflare behaviour
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
              // Authorization Header must not be included for cross-origin request
              Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
          });
        }
      }
    } else {
      throw new Error("invalid", process.argv);
    }

    console.log(response.status);
    if (response.status !== 200 ) {

    }
  };
// };
//
testFetch();
