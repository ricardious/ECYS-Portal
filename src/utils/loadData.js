import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Constructs the full file path for a given filename inside the 'data/input' directory.
 *
 * @param {string} filename - The name of the file (e.g., 'Admin.json').
 * @returns {string} The full path to the file.
 */
const getFilePath = (filename) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '..', 'data', 'input', filename);
};

/**
 * Loads data from a specified JSON file.
 *
 * This function reads the contents of the specified file located in the 'data/input' directory
 * and parses it as JSON. If the file does not exist or contains invalid JSON, it returns an empty array.
 *
 * @param {string} filename - The name of the file to load data from (e.g., 'professors.json').
 * @returns {Array} The data loaded from the file, or an empty array if the file does not exist or contains invalid JSON.
 *
 * @example
 * const professors = loadDataFromFile('professors.json');
 * console.log(professors); // Outputs the array of professors from the JSON file
 */
export const loadDataFromFile = (filename) => {
    const filePath = getFilePath(filename);

    let data = [];

    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
            data = JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error parsing JSON from ${filename}:`, error);
            data = [];
        }
    } else {
        console.error(`File ${filename} does not exist.`);
    }

    return Array.isArray(data) ? data : [];
};

/**
 * Updates a specified JSON file with new data.
 *
 * This function writes the provided data to the specified file located in the 'data/input' directory.
 * The data is serialized to JSON format with 2-space indentation. If the file cannot be written,
 * an error message is logged to the console.
 *
 * @param {string} filename - The name of the file to update (e.g., 'professors.json').
 * @param {Array|Object} data - The data to write to the file. It can be an array or an object.
 *
 * @example
 * const newProfessors = [{ id: 1, name: 'John Doe' }];
 * updateDataFile('professors.json', newProfessors);
 * console.log('Professors file updated.');
 */
export const updateDataFile = (filename, data) => {
    const filePath = getFilePath(filename);

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`File ${filename} updated successfully.`);
    } catch (error) {
        console.error(`Error writing to file ${filename}:`, error);
    }
};
