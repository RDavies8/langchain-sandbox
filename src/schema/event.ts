import { distance } from "ml-distance";
import { z } from "zod";

const DistanceSchema = z
  .enum([
    "5k",
    "10k",
    "10 mile",
    "Half Marathon",
    "Marathon",
    "Ultramarathon",
    "Other",
  ])
  .catch("Other");

export const TicketSchema = z
  .object({
    name: z
      .optional(z.string())
      .describe(
        "The name of this ticket. If no specific title is given, just use the race name."
      ),
    price: z
      .optional(z.string().regex(/([0-9]*[\.]{0,1}[0-9]{0,2})/))
      .describe("The price of the ticket."),
  })
  .describe("Information about a ticket for a specific race.");

export const RaceSchema = z
  .object({
    title: z
      .optional(z.string())
      .describe(
        "The title of the race. If no specific title, just use the distance length."
      ),
    startDate: z
      .optional(z.string().datetime({ offset: true }))
      .describe(
        "The day and time the race begins in ISO 8601 format, with timezone offset"
      ),
    distance: z
      .optional(DistanceSchema)
      .describe("The distance of the race by category"),
    distancInKm: z
      .optional(z.number())
      .describe(
        "The distance of the race in kilometers.'K' as in 5K refers to kilomoters. 'M' as in 1M refers to miles, and will need to be converted to kilometers. i.e. a 'Half Marathon' is 21.1km"
      ),
    tickets: z.array(TicketSchema).describe("Tickets for this race"),
  })
  .describe("Information about a race within an event.");

export const OrganizerSchema = z
  .object({
    name: z
      .optional(z.string())
      .describe("The name of the organizer who hosts this event"),
    email: z
      .optional(z.string().email())
      .describe("The email address to reach this organizer."),
  })
  .describe("Information about an who hosts this event.");

export const EventSchema = z
  .object({
    title: z.optional(z.string()).describe("The title of the event"),
    organizer: z
      .optional(OrganizerSchema)
      .describe("The organizer of this event."),
    summary: z
      .optional(z.string())
      .describe(
        "Summary of event advertising why people should be excited to attend."
      ),
    address: z
      .optional(z.string())
      .describe(
        "The full, postal address the event is taking place at. If a specific, numbered address is not possible, this should be left blank."
      ),
    region: z
      .optional(z.string())
      .describe(
        "The general location of the event in city, state format. i.e. 'San Francisco, CA'"
      ),
    startDate: z
      .optional(z.string().datetime({ offset: true }))
      .describe(
        "The day and time the event begins in ISO 8601 format, with timezone offset"
      ),
    races: z.array(RaceSchema).describe("Races within this event"),
  })
  .describe("Information about an event.");

export type Event = z.infer<typeof EventSchema>;

export type Distance = z.infer<typeof DistanceSchema>;
