const {Book} = require("../models/book");
const mongoose = require("mongoose")

module.exports = {
    getAllProducts: async (req, res, next) => {
        const { filterQuery, sort } = Book.buildFilterQuery(req);

        const books = await Book.find(filterQuery).sort(sort);
        return res.status(200).json({
            status: "success",
            data: books
        })
    }
} 