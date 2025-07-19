import express from 'express';
import { executeQuery, searchQuery } from '../controllers/queryController.js';

const queryRouter = express.Router();

queryRouter.post('/', executeQuery);
queryRouter.post('/search', searchQuery);

export default queryRouter;