// backend/src/utils/validators.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const planCommuteSchema = Joi.object({
  source: Joi.string().min(2).max(255).required(),
  destination: Joi.string().min(2).max(255).required(),
  travelDate: Joi.date().iso().required(),
  preferences: Joi.object({
    modePreference: Joi.string().valid('cheapest', 'fastest', 'greenest', 'balanced'),
    maxCost: Joi.number().min(0),
    maxTime: Joi.number().min(1),
    avoidTolls: Joi.boolean()
  }).optional()
});

const saveHistorySchema = Joi.object({
  routeOptionId: Joi.number().integer().min(1).required(),
  travelledOn: Joi.date().iso().default(Date.now)
});

const validateRegistration = (data) => registerSchema.validate(data);
const validateLogin = (data) => loginSchema.validate(data);
const validatePlanCommute = (data) => planCommuteSchema.validate(data);
const validateSaveHistory = (data) => saveHistorySchema.validate(data);

module.exports = {
  validateRegistration,
  validateLogin,
  validatePlanCommute,
  validateSaveHistory
};