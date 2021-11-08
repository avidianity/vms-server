import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import 'express-async-errors';
import Client from '@avidian/semaphorejs';
import { getErrorResponse } from '../helpers';

const router = Router();

router.post(
	'/',
	[
		body('numbers')
			.isArray()
			.custom((value) => {
				if (!Array.isArray(value)) {
					return false;
				}
				for (const entry of value) {
					if (!/^(\+639|639|09)\d{9}$/.test(entry)) {
						return false;
					}
				}
				return true;
			}),
		body('message').isString().notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json(errors.array());
		}

		const client = new Client(process.env.SEMAPHORE_TOKEN!, {
			baseUrl: process.env.SEMAPHORE_URL,
		});

		try {
			const response = await client.send(req.body.numbers, req.body.message);

			return res.json(response);
		} catch (error: any) {
			const response = getErrorResponse(error);
			return res.status(response?.status || 500).json(response?.data);
		}
	}
);

export const smsRoutes = router;
