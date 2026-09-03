import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pdfUrl = searchParams.get("url");

    console.log("=== PDF Proxy Request ===");
    console.log("Raw URL:", pdfUrl);
    console.log("Full request URL:", request.url);
    console.log(
      "All search params:",
      Object.fromEntries(searchParams.entries()),
    );

    if (!pdfUrl) {
      console.error("PDF Proxy Error: No URL provided");
      return NextResponse.json(
        { error: "PDF URL is required" },
        { status: 400 },
      );
    }

    // Check if URL looks incomplete
    if (pdfUrl.length < 30) {
      console.error(
        "PDF Proxy Error: URL appears incomplete or invalid",
        pdfUrl,
      );
      return NextResponse.json(
        {
          error:
            "Invalid PDF URL - URL appears incomplete or does not point to a PDF file",
          receivedUrl: pdfUrl,
        },
        { status: 400 },
      );
    }

    // Validate and parse URL
    let url: URL;
    try {
      url = new URL(pdfUrl);
      console.log(
        "Parsed URL - Hostname:",
        url.hostname,
        "Pathname:",
        url.pathname,
      );
    } catch (urlError) {
      console.error("PDF Proxy Error: Invalid URL format", urlError);
      return NextResponse.json(
        {
          error: "Invalid URL format",
          details:
            urlError instanceof Error ? urlError.message : "Unknown error",
          receivedUrl: pdfUrl,
        },
        { status: 400 },
      );
    }

    // Validate that the URL is from the expected domain (more lenient check)
    const allowedDomains = [
      "digitaloceanspaces.com",
      "fra1.digitaloceanspaces.com",
      "api.darelchimalapp.com",
    ];
    const isAllowedDomain = allowedDomains.some((domain) =>
      url.hostname.includes(domain),
    );

    if (!isAllowedDomain) {
      console.error("PDF Proxy Error: Domain not allowed", url.hostname);
      return NextResponse.json(
        {
          error: "Invalid PDF URL domain",
          hostname: url.hostname,
          allowedDomains,
        },
        { status: 403 },
      );
    }

    console.log("Fetching PDF from:", pdfUrl);

    // Fetch the PDF from DigitalOcean Spaces
    const response = await fetch(pdfUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    console.log(
      "PDF Fetch Response Status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.error("PDF Fetch Failed:", response.status, response.statusText);
      return NextResponse.json(
        {
          error: "Failed to fetch PDF from source",
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status },
      );
    }

    // Get content length from the response headers
    const contentLength = response.headers.get("content-length");
    console.log("PDF Content Length:", contentLength, "bytes");

    // Stream the PDF directly to avoid memory issues with large files
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    // Add content-length if available
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // Return the response body stream directly
    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("PDF Proxy Error:", error);
    return NextResponse.json(
      {
        error: "Failed to load PDF",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
