const paginate =
    (model, filterFunction = (query) => query) =>
    async (req, res, next) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const fields = req.query.fields
            ? req.query.fields.split(",").join(" ")
            : "";
        const sort = req.query.sort || "-createdAt";

        const skip = (page - 1) * limit;

        try {
            const total = await model.countDocuments();
            const totalPages = Math.ceil(total / limit);

            const currentUrl = `${req.protocol}://${req.get("host")}${
                req.originalUrl.split("?")[0]
            }`;

            const results = await filterFunction(model.find())
                .find()
                .select(fields)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec();

            req.paginatedResults = {
                results,
                page,
                limit,
                totalPages,
                total,
                next:
                    page < totalPages
                        ? `${currentUrl}?page=${page + 1}&limit=${limit}${
                              fields !== "" ? `&fields=${fields}` : ""
                          }`
                        : null,
                prev:
                    page > 1
                        ? `${currentUrl}?page=${page - 1}&limit=${limit}${
                              fields !== "" ? `&fields=${fields}` : ""
                          }`
                        : null,
            };
            next();
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

export default paginate;
