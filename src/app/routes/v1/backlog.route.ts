import { Router } from 'express';
import {
  createBacklog,
  deleteBacklog,
  getBacklog,
  getBacklogs,
  updateBacklog,
} from '../../controllers/v1/backlogController';

const backlogRouter = Router();

// get all
backlogRouter.get('/', getBacklogs);

// get one
backlogRouter.get('/:id', getBacklog);

// create
backlogRouter.post('/', createBacklog);

// update
backlogRouter.put('/:id', updateBacklog);

// delete
backlogRouter.delete('/:id', deleteBacklog);

export default backlogRouter;
