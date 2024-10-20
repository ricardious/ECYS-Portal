import { Router } from "express";
import { createProfessor, getProfessors, updateProfessor, deleteProfessor, bulkUploadProfessors, exportToExcel } from '../controllers/professors.controller.js';

const router = Router();

router.post('/create', createProfessor);

router.get('/all', getProfessors);

router.put('/update/:id', updateProfessor);

router.delete('/delete/:id', deleteProfessor);

router.post('/bulk-upload', bulkUploadProfessors);

router.get('/export', exportToExcel);


export default router