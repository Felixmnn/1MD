import * as SQLite from 'expo-sqlite';

/**
 * initializeTable Function
 * - Initializes the database tables if they do not already exist.
 * - Creates tables for work, physical health, mental health, and overall day rating.
 *
 * @returns {Promise<boolean>} - Returns `true` if the tables are created successfully, otherwise `false`.
 */
export async function initializeTable() {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });

  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS work (
        date TEXT PRIMARY KEY NOT NULL,
        workHours INTEGER NOT NULL,
        thingsLearned TEXT,
        productivity INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS physicalHealth (
        date TEXT PRIMARY KEY NOT NULL,
        sleepDuration INTEGER NOT NULL,
        sleepQuality INTEGER NOT NULL,
        kcal INTEGER NOT NULL,
        steps INTEGER NOT NULL,
        workout INTEGER NOT NULL,
        workoutDuration INTEGER,
        workoutIntensity INTEGER
      );
      CREATE TABLE IF NOT EXISTS mentalHealth (
        date TEXT PRIMARY KEY NOT NULL,
        socialInteractions INTEGER NOT NULL,
        goodSocialInteractions INTEGER NOT NULL,
        badSocialInteractions INTEGER NOT NULL,
        socialMediaUsageMorning INTEGER NOT NULL,
        socialMediaUsageEvening INTEGER NOT NULL,
        avoidedBadHabits INTEGER NOT NULL,
        somethingSpecial TEXT
      );
      CREATE TABLE IF NOT EXISTS overallDayRating (
        date TEXT PRIMARY KEY NOT NULL,
        overallDayRating INTEGER NOT NULL
      );
    `);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * readTable Function
 * - Reads all rows from the `work` table.
 *
 * @returns {Promise<Array>} - Returns an array of rows from the `work` table.
 */
export async function readTable() {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });
  try {
    const result = await db.getAllAsync('SELECT * FROM work');
    return result;
  } catch (error) {
    return [];
  }
}

/**
 * addEntry Function
 * - Adds or updates an entry in the database for a specific date.
 * - Inserts data into the `work`, `physicalHealth`, `mentalHealth`, and `overallDayRating` tables.
 *
 * @param {Object} data - The data object containing all fields to be inserted.
 * @returns {Promise<boolean>} - Returns `true` if the entry is added successfully, otherwise `false`.
 */
export async function addEntry(data) {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });
  console.log("Adding Entry:", data);
  /*
  Home
  Adding entry with data: {"avoidedBadHabits": false, "badSocialInteractions": 0, "date": "28.8.2025", "goodSocialInteractions": 0, "kcal": 3500, "overallDayRating": 3, "productivity": 4, "sleepDuration": 9, "sleepQuality": 3, "socialInteractions": 12, "socialMediaUsageEvening": false, "socialMediaUsageMorning": false, 
  "somethingSpecial": ["Burger", "Pommes"], "steps": 3000, 
  "thingsLearned": ["Burger", "Pommes"], "workHours": 12, "workout": false, "workoutDuration": null, "workoutIntensity": null}
  
  Importer
  LOG  Things learned at [{"avoidedBadHabits": "false", "badSocialInteractions": "", "date": "28.8.2025", "goodSocialInteractions": "", "kcal": "", "overallDayRating": "", "productivity": "2", "sleepDuration": "", "sleepQuality": "", "socialInteractions": "", "socialMediaUsageEvening": "false", "socialMediaUsageMorning": "false", 
    "somethingSpecial": "", "steps": "",
    "thingsLearned": "Burger2,Pommes2", "workHours": "12", "workout": "false", "workoutDuration": "", "workoutIntensity": ""}]
  
  Exporter
  🐋Work Results {"date": "28.8.2025", "productivity": 4, "thingsLearned": "['Burger','Pommes']", "workHours": 12}
  🔥Things Learned {"avoidedBadHabits": 0, "badSocialInteractions": 0, "date": "28.8.2025", "goodSocialInteractions": 0, "socialInteractions": 12, "socialMediaUsageEvening": 0, "socialMediaUsageMorning": 0, "somethingSpecial": "['Burger','Pommes']"}
    */
  try {
    let date;
    try {
      date = data.date.toLocaleDateString();
    } catch (error) {
      date = data.date;
    }
    console.log("Home\nAdding entry with data:", data);
    const d = (data.workHours = Math.floor(data.workHours));
     try {
      await db.execAsync(`
        INSERT OR REPLACE INTO work (date, workHours, thingsLearned, productivity)
        VALUES ("${date}", ${d}, "${data.thingsLearned ? JSON.stringify(data.thingsLearned).replace(/"/g, "'") : ''}", ${data.productivity});
        
        INSERT OR REPLACE INTO physicalHealth (date, sleepDuration, sleepQuality, kcal, steps, workout, workoutDuration, workoutIntensity)
        VALUES ("${date}", ${data.sleepDuration}, ${data.sleepQuality}, ${data.kcal}, ${data.steps}, ${data.workout ? 1 : 0}, ${data.workoutDuration != null ? data.workoutDuration : 'NULL'}, ${data.workoutIntensity != null ? data.workoutIntensity : 'NULL'});
        
        INSERT OR REPLACE INTO mentalHealth (date, socialInteractions, goodSocialInteractions, badSocialInteractions, socialMediaUsageMorning, socialMediaUsageEvening, avoidedBadHabits, somethingSpecial)
        VALUES ("${date}", ${data.socialInteractions}, ${data.goodSocialInteractions}, ${data.badSocialInteractions}, ${data.socialMediaUsageMorning ? 1 : 0}, ${data.socialMediaUsageEvening ? 1 : 0}, ${data.avoidedBadHabits ? 1 : 0}, "${data.somethingSpecial ? JSON.stringify(data.somethingSpecial).replace(/"/g, "'") : ''}");
        
        INSERT OR REPLACE INTO overallDayRating (date, overallDayRating)
        VALUES ("${date}", ${data.overallDayRating});
      `);
    } catch (error) {
      console.log("Error during insert:", error);
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * deleteTable Function
 * - Deletes all tables from the database.
 *
 * @returns {Promise<boolean>} - Returns `true` if the tables are deleted successfully, otherwise `false`.
 */
export async function deleteTable() {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });
  try {
    await db.execAsync('DROP TABLE IF EXISTS work');
    await db.execAsync('DROP TABLE IF EXISTS physicalHealth');
    await db.execAsync('DROP TABLE IF EXISTS mentalHealth');
    await db.execAsync('DROP TABLE IF EXISTS overallDayRating');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * getEntryForToday Function
 * - Fetches the entry for the current date from all tables.
 *
 * @returns {Promise<Object|null>} - Returns the entry object if found, otherwise `null`.
 */
export async function getEntryForToday() {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });

  const today = new Date().toLocaleDateString();
  try {
    const workResult = await db.getAllAsync(`SELECT * FROM work WHERE date = "${today}"`);
    const physicalHealthResult = await db.getAllAsync(`SELECT * FROM physicalHealth WHERE date = "${today}"`);
    const mentalHealthResult = await db.getAllAsync(`SELECT * FROM mentalHealth WHERE date = "${today}"`);
    const overallDayRatingResult = await db.getAllAsync(`SELECT * FROM overallDayRating WHERE date = "${today}"`);

    if (!workResult.length && !physicalHealthResult.length && !mentalHealthResult.length) {
      return null;
    }

    const entry = {
      date: workResult[0]?.date,
      workHours: workResult[0]?.workHours ?? null,
      productivity: workResult[0]?.productivity ?? null,
      thingsLearned: workResult[0]?.thingsLearned
        ? JSON.parse(workResult[0].thingsLearned.replace(/'/g, '"'))
        : null,

      sleepDuration: physicalHealthResult[0]?.sleepDuration ?? null,
      sleepQuality: physicalHealthResult[0]?.sleepQuality ?? null,
      kcal: physicalHealthResult[0]?.kcal ?? null,
      steps: physicalHealthResult[0]?.steps ?? null,
      workout: physicalHealthResult[0]?.workout === 1,
      workoutDuration: physicalHealthResult[0]?.workoutDuration ?? null,
      workoutIntensity: physicalHealthResult[0]?.workoutIntensity ?? null,

      socialInteractions: mentalHealthResult[0]?.socialInteractions ?? null,
      goodSocialInteractions: mentalHealthResult[0]?.goodSocialInteractions ?? null,
      badSocialInteractions: mentalHealthResult[0]?.badSocialInteractions ?? null,
      socialMediaUsageMorning: mentalHealthResult[0]?.socialMediaUsageMorning === 1,
      socialMediaUsageEvening: mentalHealthResult[0]?.socialMediaUsageEvening === 1,
      avoidedBadHabits: mentalHealthResult[0]?.avoidedBadHabits === 1,
      somethingSpecial: mentalHealthResult[0]?.somethingSpecial
        ? JSON.parse(mentalHealthResult[0].somethingSpecial.replace(/'/g, '"'))
        : null,

      overallDayRating: overallDayRatingResult[0]?.overallDayRating ?? null,
    };

    return entry;
  } catch (error) {
    return null;
  }
}

/**
 * getAllEntries Function
 * - Fetches all entries from the `overallDayRating` table.
 *
 * @returns {Promise<Array>} - Returns an array of all entries.
 */
export async function getAllEntries() {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });

  try {
    const overallDayRatingResult = await db.getAllAsync('SELECT * FROM overallDayRating');
    return overallDayRatingResult;
  } catch (error) {
    return [];
  }
}

/**
 * getAndTransformallEntries Function
 * - Fetches and combines data from all tables into a single array of entries.
 *
 * @returns {Promise<Array>} - Returns an array of transformed entries.
 */
export async function getAndTransformallEntries() {
  try {
    const db = await SQLite.openDatabaseAsync('1MD', {
      useNewConnection: true,
    });

    const workResult = await db.getAllAsync(`SELECT * FROM work`);
    const physicalHealthResult = await db.getAllAsync(`SELECT * FROM physicalHealth`);
    const mentalHealthResult = await db.getAllAsync(`SELECT * FROM mentalHealth`);
    const overallDayRatingResult = await db.getAllAsync(`SELECT * FROM overallDayRating`);

    let allEntries = [];


    console.log("🐋Work Results",workResult.filter(entry => entry.date == "28.8.2025")[0])
    console.log("🔥Things Learned",mentalHealthResult.filter(entry => entry.date == "28.8.2025")[0])

    for (let i = 0; i < workResult.length; i++) {
      
      allEntries = [
        ...allEntries,
        {
          date: workResult[i]?.date,
          workHours: workResult[i]?.workHours,
          productivity: workResult[i]?.productivity,
          thingsLearned: workResult[i]?.thingsLearned
            ? JSON.parse(workResult[i].thingsLearned.replace(/'/g, '"'))
            : null,

          sleepDuration: physicalHealthResult[i]?.sleepDuration,
          sleepQuality: physicalHealthResult[i]?.sleepQuality,
          kcal: physicalHealthResult[i]?.kcal,
          steps: physicalHealthResult[i]?.steps,
          workout: physicalHealthResult[i]?.workout === 1,
          workoutDuration: physicalHealthResult[i]?.workoutDuration,
          workoutIntensity: physicalHealthResult[i]?.workoutIntensity,

          socialInteractions: mentalHealthResult[i]?.socialInteractions,
          goodSocialInteractions: mentalHealthResult[i]?.goodSocialInteractions,
          badSocialInteractions: mentalHealthResult[i]?.badSocialInteractions,
          socialMediaUsageMorning: mentalHealthResult[i]?.socialMediaUsageMorning === 1,
          socialMediaUsageEvening: mentalHealthResult[i]?.socialMediaUsageEvening === 1,
          avoidedBadHabits: mentalHealthResult[i]?.avoidedBadHabits === 1,
          somethingSpecial: mentalHealthResult[i]?.somethingSpecial
            ? JSON.parse(mentalHealthResult[i].somethingSpecial.replace(/'/g, '"'))
            : null,

          overallDayRating: overallDayRatingResult[i]?.overallDayRating,
        },
      ];
    
      }
    return allEntries;
  } catch (error) {
    return [];
  }
}

export async function getEntryForDate(date) {
    const db = await SQLite.openDatabaseAsync('1MD', {
        useNewConnection: true
    });
    try {
        const workResult = await db.getAllAsync(`SELECT * FROM work WHERE date = "${date}"`);
        const physicalHealthResult = await db.getAllAsync(`SELECT * FROM physicalHealth WHERE date = "${date}"`);
        const mentalHealthResult = await db.getAllAsync(`SELECT * FROM mentalHealth WHERE date = "${date}"`);
        const overallDayRatingResult = await db.getAllAsync(`SELECT * FROM overallDayRating WHERE date = "${date}"`);
        if (!workResult.length && !physicalHealthResult.length && !mentalHealthResult.length)
            return null;
        const entry = {
    date: workResult[0]?.date,
    workHours: workResult[0]?.workHours ?? null,
    productivity: workResult[0]?.productivity ?? null,
    thingsLearned: workResult[0]?.thingsLearned 
        ? JSON.parse(workResult[0].thingsLearned.replace(/'/g, '"')) 
        : null,

    sleepDuration: physicalHealthResult[0]?.sleepDuration ?? null,
    sleepQuality: physicalHealthResult[0]?.sleepQuality ?? null,
    kcal: physicalHealthResult[0]?.kcal ?? null,
    steps: physicalHealthResult[0]?.steps ?? null,
    workout: physicalHealthResult[0]?.workout === 1,
    workoutDuration: physicalHealthResult[0]?.workoutDuration ?? null,
    workoutIntensity: physicalHealthResult[0]?.workoutIntensity ?? null,

    socialInteractions: mentalHealthResult[0]?.socialInteractions ?? null,
    goodSocialInteractions: mentalHealthResult[0]?.goodSocialInteractions ?? null,
    badSocialInteractions: mentalHealthResult[0]?.badSocialInteractions ?? null,
    socialMediaUsageMorning: mentalHealthResult[0]?.socialMediaUsageMorning === 1,
    socialMediaUsageEvening: mentalHealthResult[0]?.socialMediaUsageEvening === 1,
    avoidedBadHabits: mentalHealthResult[0]?.avoidedBadHabits === 1,
    somethingSpecial: mentalHealthResult[0]?.somethingSpecial 
        ? JSON.parse(mentalHealthResult[0].somethingSpecial.replace(/'/g, '"')) 
        : null,

    overallDayRating: overallDayRatingResult[0]?.overallDayRating ?? null
};
        return entry;
    } catch (error) {
        return null;
    }
}