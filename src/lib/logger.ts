const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	blue: '\x1b[34m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
};

type LoggerTypes = 'info' | 'debug' | 'warn' | 'error';

export class Logger {
	private showTimeStamp: boolean;

	constructor(showTimeStamp: boolean = true) {
		this.showTimeStamp = showTimeStamp;
	}

	private static colorMap: Record<LoggerTypes, string> = {
		info: colors.green,
		debug: colors.blue,
		warn: colors.yellow,
		error: colors.red,
	};

	private logMessage(type: LoggerTypes, message: string) {
		const color = Logger.colorMap[type];
		const timestamp = new Date().toISOString();

		console.log(
			`${color}[${type.toUpperCase()}] ${
				this.showTimeStamp ? `[${timestamp}]` : ''
			} ${message}${colors.reset}`
		);
	}

	info(message: string) {
		this.logMessage('info', message);
	}

	debug(message: string) {
		this.logMessage('debug', message);
	}

	warn(message: string) {
		this.logMessage('warn', message);
	}

	error(message: string) {
		this.logMessage('error', message);
	}
}
