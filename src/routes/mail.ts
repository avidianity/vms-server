import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import 'express-async-errors';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');

const routes = Router();

routes.post(
	'/',
	[body('email').isEmail().notEmpty(), body('message').isString().notEmpty(), body('subject').isString().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json(errors.array());
		}

		const transport = createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT?.toNumber(),
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
			secure: process.env.MAIL_SECURE === 'true',
		});

		try {
			await verify(transport);
		} catch (error: any) {
			return res.status(500).json({
				message: 'Transport has invalid configuration.',
				error: error.toObject(),
			});
		}

		const response = await send(transport, {
			to: req.body.email,
			text: req.body.message,
			html: req.body.message,
			sender: process.env.MAIL_FROM!,
			from: process.env.MAIL_FROM!,
			subject: req.body.subject,
		});

		return res.json(response);
	}
);

function verify(transport: Transporter<SMTPTransport.SentMessageInfo>) {
	return new Promise<boolean>((resolve, reject) => {
		transport.verify((error, success) => {
			if (error) {
				return reject(error);
			}
			return resolve(success);
		});
	});
}

type SendOptions = {
	to: string;
	from: string;
	sender: string;
	text: string;
	html: string;
	subject: string;
};

function send(transport: Transporter<SMTPTransport.SentMessageInfo>, config: SendOptions) {
	return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
		transport.sendMail(config, (error, result) => {
			if (error) {
				return reject(error);
			}
			return resolve(result);
		});
	});
}

export const mailRoutes = routes;
