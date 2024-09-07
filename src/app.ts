import cors from 'cors';
import helmet from 'helmet';
import express from "express";

import userRouter from './route/userRoute';
import todoRouter from './route/todo.Route';
import { STATUS_CODES } from './constant/statusCodes';
import { initializeDIContainer } from './di/container';
import requestErrorHandler from './middleware/requestErrorHandler';
import { addModifiedDateToRequestData } from './middleware/addModifiedDate';

// Initializes the Dependency container with the services required.
initializeDIContainer();

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

// for checking the health of the api.
app.use('/health', (req, res) => {
  res.status(200).json({
    status: STATUS_CODES.OK,
    message: 'Server is running'
  })
});

app.use(addModifiedDateToRequestData);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

app.use(requestErrorHandler);

export default app;
