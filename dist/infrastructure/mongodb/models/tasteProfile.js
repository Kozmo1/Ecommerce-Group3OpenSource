"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tasteProfileSchema = new mongoose_1.default.Schema({
    primaryFlavor: String,
    secondaryFlavors: [String],
    sweetness: {
        type: String,
        enum: ['Dry', 'Semi-Sweet', 'Sweet']
    },
    bitterness: {
        type: String,
        enum: ['Low', 'Moderate', 'High']
    },
    mouthfeel: {
        type: String,
        enum: ['Crisp', 'Smooth', 'Creamy']
    },
    body: {
        type: String,
        enum: ['Light', 'Medium', 'Full']
    },
    acidity: Number,
    aftertaste: String,
    aroma: [{
            type: String,
            enum: [
                'Citrus', 'Floral', 'Herbal', 'Spicy', 'Earthy',
                'Fruity', 'Nutty', 'Caramel', 'Vanilla', 'Woody',
                'Smoky', 'Grassy', 'Bready', 'Malty', 'Roasted'
            ]
        }]
});
exports.default = tasteProfileSchema;
