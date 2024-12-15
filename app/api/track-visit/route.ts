import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Analytics from "@/models/analytics";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { eventId, visitId } = await req.json();
    console.log("visitId", visitId);
    if (!eventId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "Unknown";
    const location = req.headers.get("x-location") || "Unknown";
    console.log("Analytics", visitId, eventId, location, ip);
    if (!visitId) {
      return NextResponse.json(
        { error: "visitId ID is missing" },
        { status: 400 }
      );
    }

    const existingVisit = await Analytics.findOne({ visitId });
    console.log("EXist", existingVisit);
    const isReturningVisitor = !!existingVisit;

    const newVisit = new Analytics({
      eventId,
      ip,
      location,
      visitId,
      timestamp: new Date().toISOString(),
      isReturningVisitor,
    });

    await newVisit.save();

    return NextResponse.json(
      {
        message: "Visit tracked successfully",
        visit: newVisit,
        isReturningVisitor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
