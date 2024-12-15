import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Bypass requests to _next and public files
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  let hostname = req.headers.get("host") || ""; // Get hostname from headers
  hostname = hostname?.split(":")[0];

  // Define allowed domains (including main domain and localhost)
  const allowedDomains = ["localhost"];

  // Check if the current hostname is in the list of allowed domains
  const isMainDomain = allowedDomains.includes(hostname);

  // Extract subdomain if not a main domain
  const subdomain = isMainDomain ? null : hostname.split(".")[0];

  console.log("Middleware: Hostname:", hostname);
  console.log("Middleware: Subdomain:", subdomain);

  // If it's a main domain, allow the request to proceed
  if (isMainDomain) {
    console.log("Middleware: Main domain detected, passing through");
    return NextResponse.next();
  }

  // Handle subdomain logic
  if (subdomain) {
    try {
      // Track visits on the event/[id] page
      console.log("pathname", url.origin);
      if (url.pathname.startsWith("/event/")) {
        const cookies = req.cookies;
        const visitCookie = cookies.get("visit_id");

        const uniqueId = visitCookie || generateUniqueId(); // Use existing ID or generate a new one
        const response = NextResponse.next();
        if (!visitCookie) {
          response.cookies.set("visit_id", uniqueId.toString(), {
            path: "/",
            httpOnly: true,
          });
          console.log("Middleware: Setting unique visit cookie:", uniqueId);
        } else {
          console.log("Middleware: Visit cookie already set:", visitCookie);
        }
console.log('uniqueId',typeof uniqueId);
        // Call the track endpoint for every visit
        await fetch(`${url.origin}/api/track-visit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitId: typeof uniqueId === 'string' ? uniqueId : uniqueId.value,
            eventId: url.pathname.split("/")[2],
          }),
        });

        // Do not return here, continue processing
      }

      console.log("Middleware: Valid subdomain detected, rewriting URL");
      // Rewrite the URL to a dynamic route based on the subdomain
      return NextResponse.rewrite(
        new URL(`/${subdomain}${url.pathname}`, req.nextUrl)
      );
    } catch (error) {
      console.error("Middleware: Error fetching tenant:", error);
    }
  }

  console.log("Middleware: Invalid subdomain or domain, returning 404");
  // If none of the above conditions are met, return a 404 response
  return new NextResponse(null, { status: 404 });
}

// Helper function to generate a unique ID
function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
