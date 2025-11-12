import rateLimit from 'express-rate-limit';

export const GeneralLimiter =rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100,
	message: {
		success: false,
		message: "Too many requests from this IP, please try again later."
	}
});


export const AuthLimiter = rateLimit({

	windowMs: 15 * 60 * 1000, 
	max: 20, 
	message: {
		success: false,
		message: "Too many login attempts from this IP, please try again later."
	}
});

export const OrderLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 50, 
	message: {
		success: false,
		message: "Too many orders placed, please try again later."
	}
});