export interface ReminderSpecies {
  id: number;
  name: string;
  type: string;
//   monthRipe: string;
  months: string[];
}

export interface TempReminderSpecies extends ReminderSpecies{
    monthRipe: string;
}

export interface Reminder extends ReminderSpecies {
  frequency: string;
}

// interface Species extends PlantInfo {
// // Any additional species-specific properties
// scientificName?: string;
// }

// Use Reminder or Species where needed
