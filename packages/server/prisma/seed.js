"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash('password123', 10);
        // Create users
        yield prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'admin',
            },
        });
        // Create categories
        const phone = yield prisma.category.create({ data: { name: 'Phones' } });
        const laptop = yield prisma.category.create({ data: { name: 'Laptops' } });
        const accessories = yield prisma.category.create({ data: { name: 'Accessories' } });
        const components = yield prisma.category.create({ data: { name: 'Components' } });
        const speakers = yield prisma.category.create({ data: { name: 'Speakers' } });
        yield prisma.category.create({ data: { name: 'Others' } });
        // Create suppliers
        const supplier1 = yield prisma.supplier.create({
            data: { name: 'Apple', contact: 'contact@apple.com' },
        });
        const supplier2 = yield prisma.supplier.create({
            data: { name: 'Samsung', contact: 'contact@samsung.com' },
        });
        // Create products
        yield prisma.product.create({
            data: {
                name: 'iPhone 15 Pro',
                price: 999,
                cost: 799,
                quantity: 50,
                imageUrl: 'https://via.placeholder.com/150',
                categoryId: phone.id,
                supplierId: supplier1.id,
            },
        });
        yield prisma.product.create({
            data: {
                name: 'MacBook Pro 16',
                price: 2499,
                cost: 2000,
                quantity: 30,
                imageUrl: 'https://via.placeholder.com/150',
                categoryId: laptop.id,
                supplierId: supplier1.id,
            },
        });
        yield prisma.product.create({
            data: {
                name: 'Samsung Galaxy S24',
                price: 899,
                cost: 700,
                quantity: 60,
                imageUrl: 'https://via.placeholder.com/150',
                categoryId: phone.id,
                supplierId: supplier2.id,
            },
        });
        yield prisma.product.create({
            data: {
                name: 'AirPods Pro',
                price: 249,
                cost: 200,
                quantity: 100,
                imageUrl: 'https://via.placeholder.com/150',
                categoryId: accessories.id,
                supplierId: supplier1.id,
            },
        });
        yield prisma.product.create({
            data: {
                name: 'M3 Chip',
                price: 699,
                cost: 500,
                quantity: 20,
                imageUrl: 'https://via.placeholder.com/150',
                categoryId: components.id,
                supplierId: supplier1.id,
            },
        });
        yield prisma.product.create({
            data: {
                name: 'HomePod',
                price: 299,
                cost: 250,
                quantity: 40,
                imageUrl: 'https://via.placeholder.com/150',
                categoryId: speakers.id,
                supplierId: supplier1.id,
            },
        });
        console.log('Seeding finished.');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
