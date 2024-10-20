import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Professor } from '../models/professor.model.js';
import ExcelJS from 'exceljs';
import { loadDataFromFile, updateDataFile } from '../utils/loadData.js';

// Load initial professors data from 'professors.json' file
let professors = loadDataFromFile('professors.json');

/**
 * Create a new professor and save it to the JSON file.
 * 
 * @param {Object} req - Express request object containing professor data in the body.
 * @param {Object} res - Express response object to return the created professor or an error message.
 */
export const createProfessor = (req, res) => {
    const { id, name, email, gender, password } = req.body;

    // Check if a professor with the given ID already exists
    const existingProfessor = professors.find(prof => prof.id === id);
    if (existingProfessor) {
        return res.status(400).json({ message: 'Professor ID already exists' });
    }

    // Create a new professor instance and add it to the professors array
    const newProfessor = new Professor(id, name, email, gender, password);
    professors.push(newProfessor);
    updateDataFile('professors.json', professors);

    // Respond with the created professor
    res.status(201).json(newProfessor);
};

/**
 * Retrieve all professors and send them as a JSON response.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the list of professors.
 */
export const getProfessors = (req, res) => {
    res.json(professors);
};

/**
 * Update a professor's information based on the ID provided in the URL.
 * 
 * @param {Object} req - Express request object containing professor updates in the body.
 * @param {Object} res - Express response object with the updated professor or an error message.
 */
export const updateProfessor = (req, res) => {
    const { id } = req.params;
    const { name, email, gender, password } = req.body;
    const professor = professors.find(prof => prof.id === id);

    if (!professor) {
        return res.status(404).json({ message: 'Professor not found' });
    }

    // Update professor's data if provided
    if (name) professor.name = name;
    if (email) professor.email = email;
    if (password) professor.password = password;

    updateDataFile('professors.json', professors);
    res.json(professor);
};

/**
 * Delete a professor based on the ID provided in the URL.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object to confirm deletion or return an error message.
 */
export const deleteProfessor = (req, res) => {
    const { id } = req.params;
    const index = professors.findIndex(prof => prof.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Professor not found' });
    }

    // Remove the professor from the array and update the JSON file
    professors.splice(index, 1);
    updateDataFile('professors.json', professors);
    res.status(204).send(); // No content response on successful deletion
};

/**
 * Bulk upload multiple professors from the request body.
 * 
 * @param {Object} req - Express request object containing an array of professors in the body.
 * @param {Object} res - Express response object confirming the upload or returning an error message.
 */
export const bulkUploadProfessors = (req, res) => {
    const professorsData = req.body;

    // Ensure the incoming data is an array
    if (!Array.isArray(professorsData)) {
        return res.status(400).json({ message: 'Invalid data format. Expected an array of professors.' });
    }

    // Check for duplicate IDs in the upload data
    const idsInUpload = professorsData.map(prof => prof.id);
    const hasDuplicatesInUpload = new Set(idsInUpload).size !== idsInUpload.length;

    if (hasDuplicatesInUpload) {
        return res.status(400).json({
            message: 'Duplicate IDs found in upload data. No professors were added.'
        });
    }

    // Check if any professor ID already exists in the current data
    const existingIds = professors.map(prof => prof.id);
    const hasExistingIds = professorsData.some(prof => existingIds.includes(prof.id));

    if (hasExistingIds) {
        return res.status(400).json({
            message: 'One or more professors have an ID that already exists. No professors were added.'
        });
    }

    // Add the new professors to the current data
    const newProfessors = professorsData.map(({ id, name, email, gender, password }) =>
        new Professor(id, name, email, gender, password)
    );

    professors.push(...newProfessors);
    updateDataFile('professors.json', professors);

    // Respond with the number of professors uploaded
    res.status(201).json({
        message: 'Professors uploaded successfully',
        count: newProfessors.length
    });
};

/**
 * Export the list of professors to an Excel file. Either downloads the file in the browser or saves it on the server.
 * 
 * @param {Object} req - Express request object containing query parameters for file name and location.
 * @param {Object} res - Express response object to download or confirm export.
 */
export const exportToExcel = async (req, res) => {
    try {
        const { fileName = 'professors', location = '' } = req.query;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Professors');

        // Define Excel columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Gender', key: 'gender', width: 15 },
            { header: 'Password', key: 'password', width: 15 },
        ];

        // Add professor data to the Excel worksheet
        professors.forEach(professor => {
            worksheet.addRow({
                id: professor.id,
                name: professor.name,
                email: professor.email,
                gender: professor.gender,
            });
        });

        if (location) {
            // Save the Excel file to a specific server location
            const filePath = path.join(__dirname, '..', 'data', 'exports', location, `${fileName}.xlsx`);
            const dirPath = path.dirname(filePath);

            // Create the directory if it doesn't exist
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            await workbook.xlsx.writeFile(filePath);
            res.json({ message: 'File exported successfully', path: filePath });
        } else {
            // Download the file in the browser
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=${fileName}.xlsx`
            );
            await workbook.xlsx.write(res);
            res.end();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error exporting to Excel', error: error.message });
    }
};
