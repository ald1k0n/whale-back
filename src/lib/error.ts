export class CustomError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string = 'Not Found') {
		super(message, 404);
	}
}

export class ValidationError extends CustomError {
	constructor(message: string = 'Validation Error') {
		super(message, 400);
	}
}

export class UnauthorizedError extends CustomError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401);
	}
}

export class ForbiddenError extends CustomError {
	constructor(message: string = 'Forbidden') {
		super(message, 403);
	}
}

export class MethodNotAllowed extends CustomError {
	constructor(message: string = 'Method not allowed') {
		super(message, 405);
	}
}

export class InternalServerError extends CustomError {
	constructor(message: string = 'Internal Server Error') {
		super(message, 500);
	}
}
