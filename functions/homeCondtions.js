/**
 * isCompleated Function
 * - Checks if all required conditions for the selected data are met.
 * - Returns a string listing the incomplete sections (e.g., "Work, Physical Health").
 *
 * @param {Object} selectedData - The data object containing all fields to be validated.
 * @returns {string} - A comma-separated string of incomplete sections.
 */
export function isCompleated(selectedData) {
    let output = "";
    if (workConditions(selectedData) === false) {
        output += "Work, ";
    } else if (physicalHealthConditions(selectedData) === false) {
        output += "Physical Health, ";
    } else if (mentalHealthConditions(selectedData) === false) {
        output += "Mental Health, ";
    } else if (selectedData.overallDayRating === null) {
        output += "Overall Day Rating, ";
    }
    return output;
}

/**
 * workConditions Function
 * - Validates the work-related fields in the selected data.
 * - Checks if `workHours` and `productivity` are not null.
 *
 * @param {Object} selectedData - The data object containing work-related fields.
 * @returns {boolean} - Returns `true` if all conditions are met, otherwise `false`.
 */
export function workConditions(selectedData) {
    if (selectedData.workHours === null) {
        return false;
    } else if (selectedData.productivity === null) {
        return false;
    }
    return true;
}

/**
 * physicalHealthConditions Function
 * - Validates the physical health-related fields in the selected data.
 * - Checks if fields like `sleepDuration`, `kcal`, and `steps` are not null.
 * - If `workout` is true, also checks `workoutDuration` and `workoutIntensity`.
 *
 * @param {Object} selectedData - The data object containing physical health-related fields.
 * @returns {boolean} - Returns `true` if all conditions are met, otherwise `false`.
 */
export function physicalHealthConditions(selectedData) {
    if (selectedData.sleepDuration === null) {
        return false;
    }
    if (selectedData.sleepQuality === null) {
        return false;
    }
    if (selectedData.kcal === null) {
        return false;
    }
    if (selectedData.steps === null) {
        return false;
    }
    if (selectedData.workout && selectedData.workoutDuration === null) {
        return false;
    }
    if (selectedData.workout && selectedData.workoutIntensity === null) {
        return false;
    }
    return true;
}

/**
 * mentalHealthConditions Function
 * - Validates the mental health-related fields in the selected data.
 * - Checks if fields like `socialInteractions`, `socialMediaUsageMorning`, and `avoidedBadHabits` are not null.
 *
 * @param {Object} selectedData - The data object containing mental health-related fields.
 * @returns {boolean} - Returns `true` if all conditions are met, otherwise `false`.
 */
export function mentalHealthConditions(selectedData) {
    if (selectedData.socialInteractions === null) {
        return false;
    }
    if (selectedData.goodSocialInteractions === null) {
        return false;
    }
    if (selectedData.badSocialInteractions === null) {
        return false;
    }
    if (selectedData.socialMediaUsageMorning === null) {
        return false;
    }
    if (selectedData.socialMediaUsageEvening === null) {
        return false;
    }
    if (selectedData.avoidedBadHabits === null) {
        return false;
    }
    return true;
}