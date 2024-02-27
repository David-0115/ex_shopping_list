process.env.NODE_ENV = "test";
const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb')

let newItem = { name: "HeadPhones", price: "39.99" }
beforeEach(() => {
    items.push(newItem);
});

afterEach(() => {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ name: "HeadPhones", price: "39.99" }]);
    });
});

describe("POST /items", () => {
    test("Add an item", async () => {
        const newItem = { name: "Hat", price: "19.99" };
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": { name: "Hat", price: "19.99" } })
    });
    test("Adding an item with out a name should throw an error", async () => {
        const newItem = { price: "29.99" }
        const res = await request(app).post("/items");
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ "error": "Request must include a item name and price" })
    });
    test("Adding an item without a prices should throw an error", async () => {
        const newItem = { name: "No_Price" }
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ "error": "Request must include a item name and price" })
    })
});

describe("GET /items:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get('/items/HeadPhones');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ name: "HeadPhones", price: "39.99" });
    });
    test("Get item by name is case insensitive", async () => {
        const res = await request(app).get('/items/HeAdPhONes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ name: "HeadPhones", price: "39.99" });
    });
    test("Get item that doesn't exist should throw an error", async () => {
        const res = await request(app).get('/items/not_an_item');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ "error": "Item not found" })
    })
});

describe("PATCH /items:name", () => {
    test("Patch item should update an existing item", async () => {
        const res = await request(app).patch('/items/HeadPhones').send({ name: 'Beats_Headphones', price: '149.99' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "updated": { name: 'Beats_Headphones', price: '149.99' } });
    });
    test("Patch item should update either name or price and default to original if one is left blank", async () => {
        const res = await request(app).patch('/items/Beats_Headphones').send({ name: "Cool_Earbuds" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "updated": { name: 'Cool_Earbuds', price: '149.99' } });

        const res1 = await request(app).patch('/items/Cool_Earbuds').send({ price: "9.99" });
        expect(res1.statusCode).toBe(200);
        expect(res1.body).toEqual({ "updated": { name: 'Cool_Earbuds', price: '9.99' } });
    });
    test("Patch item that doesn't exist should throw an error", async () => {
        const res = await request(app).patch('/items/not_an_item').send({ name: "NewItem", price: "4.99" });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ "error": "Item not found" })
    })
});

describe("DELETE /items:name", () => {
    test("Delete item should delete the item", async () => {
        const res = await request(app).delete('/items/Cool_Earbuds');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual("Deleted");
    });
    test("Delete request to item that doesn't exist throws an error", async () => {
        const res = await request(app).delete('/items/shoes');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ "error": "Item not found" });
    });
});


