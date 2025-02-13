"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasteProfile: {
        // Whiskey preferences
        whiskeyTypes: [{
                type: String,
                enum: ['Bourbon', 'Rye', 'Single Malt', 'Blended', 'Scotch', 'Irish', 'Japanese']
            }],
        flavorNotes: [{
                type: String,
                enum: ['Sweet', 'Spicy', 'Smoky', 'Fruity', 'Nutty', 'Caramel', 'Vanilla', 'Oak', 'Peat']
            }],
        agingPreference: [{
                type: String,
                enum: ['Young (<3 years)', 'Medium (3-10 years)', 'Well-Aged (>10 years)']
            }],
        proofPreference: [{
                type: String,
                enum: ['Low (<90 proof)', 'Medium (90-110 proof)', 'High (>110 proof)']
            }],
        finishType: [{
                type: String,
                enum: ['Short', 'Medium', 'Long']
            }],
        caskType: [{
                type: String,
                enum: ['New Oak', 'Ex-Bourbon', 'Sherry', 'Wine', 'Rum']
            }],
        // Beer preferences
        beerStyles: [{
                type: String,
                enum: ['IPA', 'Pale Ale', 'Lager', 'Pilsner', 'Stout', 'Porter', 'Wheat', 'Saison', 'Sour', 'Belgian Ale']
            }],
        beerFlavorProfiles: [{
                type: String,
                enum: ['Bitter', 'Hoppy', 'Malty', 'Sweet', 'Fruity', 'Spicy', 'Roasty', 'Tart', 'Dry', 'Smooth']
            }],
        beerColor: [{
                type: String,
                enum: ['Light', 'Amber', 'Dark']
            }],
        beerStrength: [{
                type: String,
                enum: ['Session (<5% ABV)', 'Standard (5-7% ABV)', 'Strong (>7% ABV)']
            }],
        beerCarbonation: [{
                type: String,
                enum: ['Low', 'Medium', 'High']
            }],
        brewingMethod: [{
                type: String,
                enum: ['Traditional', 'Modern', 'Experimental']
            }]
    },
    createdAt: { type: Date, default: Date.now }
});
exports.User = mongoose_1.default.model('UserModel', userSchema);
