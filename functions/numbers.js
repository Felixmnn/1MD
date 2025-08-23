/**
 * isNumber Function
 * - Checks if a given string contains only numeric characters (0-9).
 * - Returns `true` if all characters in the string are numeric, otherwise `false`.
 *
 * @param {string} value - The string to be checked. Defaults to an empty string.
 * @returns {boolean} - Returns `true` if the string is numeric, otherwise `false`.
 */
export function isNumber(value = "") {
    // Iterate through each character in the string
    for (let i = 0; i < value.length; i++) {
        // Check if the character is not between '0' and '9'
        if (value[i] < '0' || value[i] > '9') {
            return false; // Return false if a non-numeric character is found
        }
    }
    return true; // Return true if all characters are numeric
}