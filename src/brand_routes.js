const express = require("express");
const brandRoutes = express.Router();
const aggregationPipelines = require("./aggregation_pipelines");
const Brand = require("./models/brand");


brandRoutes.get("/all-brands", (req, res) => {
	Brand.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

brandRoutes.post("/search-brands", async (req, res) => {
    try {
        console.log(req.body);
        const {
            name,
            country,
            city,
            email,
            phone,
            website,
            establishedYearMin,
            establishedYearMax,
        } = req.body;

        // $options: "i" means that regex is case insensitive
        const searchCriteria = {};
        if (name) searchCriteria.name = { $regex: name, $options: "i" };
        if (country) searchCriteria["location.country"] = { $regex: country, $options: "i" };
        if (city) searchCriteria["location.city"] = { $regex: city, $options: "i" };
        if (email) searchCriteria["contact.email"] = { $regex: email, $options: "i" };
        if (phone) searchCriteria["contact.phone"] = { $regex: phone, $options: "i" };
        if (website) searchCriteria.website = { $regex: website, $options: "i" };
        if (establishedYearMin !== null && establishedYearMax !== null) {
            searchCriteria.established_year = { $gte: establishedYearMin, $lte: establishedYearMax };
        } else if (establishedYearMin !== null) {
            searchCriteria.established_year = { $gte: establishedYearMin };
        } else if (establishedYearMax !== null) {
            searchCriteria.established_year = { $lte: establishedYearMax };
        }

        console.log(searchCriteria);
        const companies = await Brand.find(searchCriteria);
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Wystąpił błąd serwera" });
    }
});





module.exports = brandRoutes;