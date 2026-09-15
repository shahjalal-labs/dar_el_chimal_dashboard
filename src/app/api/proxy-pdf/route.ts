import { NextRequest, NextResponse } from "next/server";
import { getOptimizedPdfUrl } from "@/lib/pdfUtils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let pdfUrl = searchParams.get("url");

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "PDF URL is required" },
        { status: 400 }
      );
    }

    // Automatically resolve to fast Cloudflare CDN if DO Spaces URL
    pdfUrl = getOptimizedPdfUrl(pdfUrl);

    // Validate and parse URL
    let url: URL;
    try {
      url = new URL(pdfUrl);
    } catch (urlError) {
      return NextResponse.json(
        {
          error: "Invalid URL format",
          details:
            urlError instanceof Error ? urlError.message : "Unknown error",
          receivedUrl: pdfUrl,
        },
        { status: 400 }
      );
    }

    // Validate allowed domains
    const allowedDomains = [
      "digitaloceanspaces.com",
      "fra1.digitaloceanspaces.com",
      "dac.fra1.cdn.digitaloceanspaces.com",
      "api.darelchimalapp.com",
    ];
    const isAllowedDomain = allowedDomains.some((domain) =>
      url.hostname.includes(domain)
    );

    if (!isAllowedDomain) {
      return NextResponse.json(
        {
          error: "Invalid PDF URL domain",
          hostname: url.hostname,
          allowedDomains,
        },
        { status: 403 }
      );
    }

    // Forward Range header from client if present
    const rangeHeader = request.headers.get("range");
    const fetchHeaders: Record<string, string> = {
      Accept: "application/pdf",
    };
    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    // Fetch the PDF from source/CDN
    const response = await fetch(pdfUrl, {
      method: "GET",
      headers: fetchHeaders,
    });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        {
          error: "Failed to fetch PDF from source",
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status }
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
      "Access-Control-Expose-Headers":
        "Content-Length, Content-Range, Accept-Ranges, ETag",
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    const contentRange = response.headers.get("content-range");
    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    const etag = response.headers.get("etag");
    if (etag) {
      headers.set("ETag", etag);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("PDF Proxy Error:", error);
    return NextResponse.json(
      {
        error: "Failed to load PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
      "Access-Control-Expose-Headers":
        "Content-Length, Content-Range, Accept-Ranges, ETag",
    },
  });
}
