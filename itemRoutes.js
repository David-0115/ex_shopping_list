const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');
const items = require('./fakeDb');

router.get('/', (req, res, next) => {
    try {
        return res.status(200).json(items)
    } catch (e) {
        next(e)
    }
});

router.post('/', (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price) {
            throw new ExpressError('Request must include a item name and price', 400);
        } else {
            const newItem = { name: req.body.name, price: req.body.price };
            items.push(newItem);
            return res.status(201).json({ "added": newItem });
        }
    } catch (e) {
        next(e)
    }

});

router.get('/:name', (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name.toLowerCase() === req.params.name.toLowerCase())
        if (foundItem === undefined) {
            throw new ExpressError("Item not found", 404)
        }
        res.status(200).json(foundItem)
    } catch (e) {
        next(e)
    }
});

router.patch('/:name', (req, res, next) => {
    try {
        const foundItemIdx = items.findIndex(item => item.name.toLowerCase() === req.params.name.toLowerCase());
        if (foundItemIdx === -1) {
            throw new ExpressError("Item not found", 404);
        }
        const updatedItem = items[foundItemIdx];
        updatedItem.name = req.body.name ? req.body.name : updatedItem.name;
        updatedItem.price = req.body.price ? req.body.price : updatedItem.price;
        return res.status(200).json({ "updated": updatedItem })

    } catch (e) {
        next(e)
    }
})

router.delete('/:name', (req, res, next) => {
    try {
        const foundItemIdx = items.findIndex(item => item.name.toLowerCase() === req.params.name.toLowerCase());
        if (foundItemIdx === -1) {
            throw new ExpressError("Item not found", 404);
        }
        items.splice(foundItemIdx, 1)
        return res.status(200).json("Deleted")
    } catch (e) {
        next(e)
    }
})


module.exports = router;