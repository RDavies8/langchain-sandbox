import { distance } from "ml-distance";
import { z } from "zod";

const DistanceSchema = z.enum(["5k", "10k", "10 mile", "Half Marathon", "Marathon", "Ultramarathon", "Other"]);

export const RaceSchema = z
    .object({
        title: z.optional(z.string()).describe("The title of the race. If no specific title, just use the distance length."),
        startDate: z
            .optional(z.string().datetime({ offset: true }))
            .describe("The day and time the race begins"),
        distance: z
            .optional(DistanceSchema)
            .describe("The distance of the race by category"),
        distanceInKm: z
            .optional(z.number())
            .describe("The distance of the race in kilometers"),
    })
    .describe("Information about a race within an event.");

export const EventSchema = z
    .object({
        title: z.optional(z.string()).describe("The title of the event"),
        address: z.optional(z.string()).describe("The address the event is taking place at"),
        startDate: z
            .optional(z.string().datetime({ offset: true }))
            .describe("The day the event begins"),
        races: z.array(RaceSchema).describe("Races within this event")
    })
    .describe("Information about an event.");


export type Event = z.infer<typeof EventSchema>;

export type Distance = z.infer<typeof DistanceSchema>;




