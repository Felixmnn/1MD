import * as SQLite from 'expo-sqlite';

/**
 * getVariableType Function
 * - Determines the type of a variable based on its name.
 * - Returns one of the following types: "KEY", "NOMINAL", "ORDINAL", "METRIC", or "ARRAY".
 *
 * @param {string} name - The name of the variable.
 * @returns {string} - The type of the variable.
 */
export function getVariableType(name) {
    if (name == "date") {
        return "KEY"; // Represents a unique identifier or key.
    } else if (
        name == "workout" ||
        name == "avoidedBadHabits"
    ) {
        return "NOMINAL"; // Represents categorical data with no inherent order.
    } else if (
        name == "productivity" ||
        name == "sleepQuality" ||
        name == "workoutIntensity" || 
        name == "overallDayRating"
    ) {
        return "ORDINAL"; // Represents categorical data with an inherent order.
    } else if (
        name == "workHours" || 
        name == "sleepDuration" || 
        name == "kcal" ||
        name == "steps" || 
        name == "workoutDuration" ||
        name == "goodSocialInteractions" ||
        name == "badSocialInteractions" ||
        name == "socialMediaUsageMorning" ||
        name == "socialMediaUsageEvening" 
    ) {
        return "METRIC"; // Represents numerical data that can be measured.
    } else if (
        name == "thingsLearned" ||
        name == "somethingSpecial"
    ) {
        return "ARRAY"; // Represents an array of values.
    }
}

/**
 * getDataForVariable Function
 * - Fetches data for a specific column from a given table in the SQLite database.
 * - Processes the data based on the column type (e.g., "ARRAY" or other types).
 *
 * @param {string} table - The name of the database table.
 * @param {string} columnName - The name of the column to fetch data for.
 * @returns {Promise<Array>} - An array of objects containing `date` and `value` for each row.
 */
export async function getDataForVariable(table, columnName) {
    // Open a connection to the SQLite database
    const db = await SQLite.openDatabaseAsync('1MD', {
        useNewConnection: true
    });

    // Fetch all rows for the specified column and date
    const res = await db.getAllAsync(`SELECT ${columnName}, date FROM ${table}`);
    let array = [];
    try {
        // Handle columns that store JSON arrays
        if (columnName == "thingsLearned" || columnName == "somethingSpecial") {
                
             array = res.map(row => ({
                date: row["date"], // Extract the date
                value: !row[columnName] || row[columnName] === "" || row[columnName] === "[]" 
                    ? 0
                    : JSON.parse(row[columnName].replace(/'/g, '"')).length
            }));

            
        } else {
            // Handle other column types
             array = res.map(row => ({
                date: row["date"], // Extract the date
                value: row[columnName] // Extract the column value
            }));       
        
        }
        array.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
        return array;
    } catch (error) {
        
        // Return an empty array in case of an error
        return [];
    }
}

export async function getAmountOfEntries() {
        const res = await db.getAllAsync(`SELECT ${columnName}, date FROM ${table}`);
        return res.length;
}