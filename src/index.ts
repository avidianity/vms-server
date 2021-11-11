import express, { json, urlencoded, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import expand from 'dotenv-expand';
import '@avidian/extras';
import { mailRoutes } from './routes/mail';
import { smsRoutes } from './routes/sms';

expand(config());

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/mail', mailRoutes);
app.use('/sms', smsRoutes);
app.get('/ping', (_, res) => res.sendStatus(204));

app.use((_, res) => {
	return res.status(404).end();
});

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
	console.error(error.message);
	return res.status(error.status || 500).json(error.toObject());
});

app.listen(process.env.PORT || 8000);
