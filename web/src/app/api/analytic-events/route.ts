import { AnalyticsEventDocument } from "@/lib/types/analytics";
import { connectToDatabase } from "../db";
import { MongoServerError } from "mongodb";

const dedupeCollectionName = "analytic-events-dedupe";
const eventsCollectionName = "analytic-events";


export async function POST(request: Request) {
    const body = await request.json() as AnalyticsEventDocument;

    if (!body) {
        return new Response(JSON.stringify({ message: "No body provided" }), { status: 400 });
    }

    const {eventId, ...details} = body;
    try {
        const db = await connectToDatabase();
        
        // Ensure that event has not already been created
        await db.collection(dedupeCollectionName)
            .insertOne({
                eventId: eventId,
                createdAt: details.timestamp
            })

        await db.collection(eventsCollectionName)
            .insertOne(details)

    } catch (err) {
        if (err instanceof MongoServerError && err.code === 11000) {
            // status: 200 as this is a correct response
            return new Response(JSON.stringify({ message: "Event already recorded" }), { status: 200 });
        }
        console.error("Failed to record event:", err);
        return new Response(JSON.stringify({ message: "Failed to record event" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Event recorded" }), { status: 200 });
}

// Honestly, I don't care about auth here because it's analytics data that I am okay with being public.
// It is also neither personal nor personally identifiable information.
export async function GET() {
    try {
        const db = await connectToDatabase();
        const events = await db.collection(eventsCollectionName)
            .find()
            .toArray();
        return new Response(JSON.stringify(events), { status: 200 });
    } catch (err) {
        console.error("Failed to retrieve events:", err);
        return new Response(JSON.stringify({ message: "Failed to retrieve events" }), { status: 500 });
    }
}