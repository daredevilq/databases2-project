const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

function matchAllProductsWithGivenID(productID){
		return [
			{
				$match: {
					product_id: productID,
				},
			},
		];
}

function matchAllBasketsWithGivenUserID(userID){
	const userObjectId = new mongoose.Types.ObjectId(userID)
	return  [
		// Znajdź koszyki dla danego użytkownika
		{ $match: { user_id: userObjectId } },
		{
			$lookup: {
				from: 'users',
				localField: 'user_id',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ $unwind: '$user' },

		// Lookup produktów
		{
			$lookup: {
				from: 'products',
				localField: 'products',
				foreignField: '_id',
				as: 'productDetails'
			}
		},
		// Projektowanie produktów z wybranymi atrybutami
		{
			$project: {
				user: 1,
				date_time: 1,
				transaction: 1,
				delivery_status: 1,
				productDetails: {
					_id: 1,
					title: 1,
					description: 1,
					price: 1,
					discountPercentage: 1,
					rating: 1,
					stock: 1,
					brand: 1,
					category: 1,
				},
				total_value: { $sum: '$productDetails.price' }
			}
		},

		// Projektowanie danych wyjściowych
		{
			$project: {
				_id: 0,
				firstname: '$user.firstname',
				lastname: '$user.lastname',
				baskets: {
					_id: '$_id',
					date_time: '$date_time',
					products: '$productDetails',
					transaction: '$transaction',
					delivery_status: '$delivery_status'
				},
				total_value: 1
			}
		}
	];
}


function matchAllBasketsDetailed(userId, title, category){
    const userObjectId = new ObjectId(userId);
    const productSearchCriteria = [];

    if (title) productSearchCriteria.push({ 'productDetails.title': { $regex: title, $options: "i" } });
    if (category) productSearchCriteria.push({ 'productDetails.category': { $regex: category, $options: "i" } });

    const pipeline = [
        { $match: { user_id: userObjectId } },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        // Lookup to join the brand details
        {
            $lookup: {
                from: 'brands',
                localField: 'productDetails.brand',
                foreignField: '_id',
                as: 'brandDetails'
            }
        },
        {
            $addFields: {
                productDetails: {
                    $map: {
                        input: '$productDetails',
                        as: 'product',
                        in: {
                            $mergeObjects: [
                                '$$product',
                                { brandDetails: { $arrayElemAt: ['$brandDetails', { $indexOfArray: ['$brandDetails._id', '$$product.brand'] }] } }
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                totalValue: { $sum: '$productDetails.price' },
                matchingProducts: {
                    $filter: {
                        input: '$productDetails',
                        as: 'product',
                        cond: {
                            $or: productSearchCriteria.length > 0
                                ? productSearchCriteria.map(criteria => ({
                                        $regexMatch: {
                                            input: `$$product.${Object.keys(criteria)[0].split('.')[1]}`,
                                            regex: Object.values(criteria)[0].$regex,
                                            options: Object.values(criteria)[0].$options
                                        }
                                    }))
                                : [true] // nie filtrujemy jesli nie ma search criteria 
                        }
                    }
                }
            }
        },
        {
            $match: {
                $expr: {
                    $gt: [{ $size: '$matchingProducts' }, 0]
                }
            }
        },
        {
            $project: {
                _id: 0,
                firstname: '$user.firstname',
                lastname: '$user.lastname',
                baskets: {
                    _id: '$_id',
                    date_time: '$date_time',
                    products: {
                        $map: {
                            input: '$productDetails',
                            as: 'product',
                            in: {
                                _id: '$$product._id',
                                title: '$$product.title',
                                price: '$$product.price',
                                brand: '$$product.brandDetails.name', 
                                category: '$$product.category'
                            }
                        }
                    },
                    transaction: '$transaction',
                    delivery_status: '$delivery_status'
                },
                totalValue: 1
            }
        }
    ];

    return pipeline;
}


function matchAllComents(userId ){

	const userObjectId = new ObjectId(userId);

	return [
		{ $unwind: "$comments" },
		{ $match: { "comments.userid": { $oid: userId } } },
		{
				$lookup: {
						from: "users",
						localField: "comments.userid",
						foreignField: "_id",
						as: "user_info"
				}
		},
		{ $unwind: "$user_info" },
		{
				$project: {
						_id: 0,
						product_id: 1,
						review: 1,
						"comment": "$comments.comment",
						"user_firstname": "$user_info.firstname",
						"user_lastname": "$user_info.lastname"
				}
		}
]
}


function searchAllUserComments2(userId){

	const userObjectId = new mongoose.Types.ObjectId(userId)

	return [
		{
			$unwind: "$comments"
		},
		{
			$match: {
				"comments.userid": userObjectId 
			}
		},
		{
			$lookup: {
				from: "products",
				localField: "product_id",
				foreignField: "_id",
				as: "product_info"
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "comments.userid",
				foreignField: "_id",
				as: "user_info"
			}
		},
		{
			$unwind: "$product_info"
		},
		{
			$unwind: "$user_info"
		},
		{
			$project: {
				_id: 0,
				comment: "$comments.comment",
				product_title: "$product_info.title",
				firstname: "$user_info.firstname",
				lastname: "$user_info.lastname"
			}
		}
	]
}


function searchAllUserComments(userId){

	const userObjectId = new mongoose.Types.ObjectId(userId)

	return [
		{
			$match: {
				customer_id: userObjectId 
			}
		},
		{
			$lookup: {
				from: "products",
				localField: "product_id",
				foreignField: "_id",
				as: "product_info"
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "customer_id",
				foreignField: "_id",
				as: "user_info"
			}
		},
		{
			$unwind: "$product_info"
		},
		{
			$unwind: "$user_info"
		},
		{
			$project: {
				"_id": 0,
				firstname: "$user_info.firstname",
				lastname: "$user_info.lastname",
				product_title: "$product_info.title",
				rating: "$rating",
				review: "$review",
				date: "$date"
			}
		}
	]
}


function financialReportUsers(){
	const pipeline = [
		
		{ $unwind: "$products" },
		{
			$lookup: {
				from: "products",
				localField: "products",
				foreignField: "_id",
				as: "productInfo"
			}
		},
		
		{ $unwind: "$productInfo" },
		
		{
			$group: {
				_id: "$user_id",
				totalAmount: { $sum: "$productInfo.price" }
			}
		},
		
		{
			$lookup: {
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "userInfo"
			}
		},
		
		// Rozpakowanie tablicy userInfo
		{ $unwind: "$userInfo" },
		
		// Projektowanie końcowego wyniku
		{
			$project: {
				_id: 0,
				userId: "$_id",
				firstname: "$userInfo.firstname",
				lastname: "$userInfo.lastname",
				totalAmount: "$totalAmount"
			}
		}
	];

	return pipeline
}


function countCoustomersInCountries(){
	return [
		{
			$group: {
				_id: "$address.country",
				userCount: { $sum: 1 }
			}
		},
		{
			$sort: { userCount: -1 }
		},{
			$project:{
				country: "$_id",
				_id:0,
				userCount: "$userCount"
			}
		}
	]
}


function ordersWeekly(){
	return [
		{
			"$addFields": {
				"date_time": {
					"$cond": {
						"if": {
							"$eq": [
								{
									"$type": "$date_time"
								},
								"date"
							]
						},
						"then": "$date_time",
						"else": null
					}
				}
			}
		},
		{
			"$addFields": {
				"dayOfWeek": {
					"$add": [
						{
							"$dayOfWeek": "$date_time"
						},
						-1
					]
				}
			}
		},
		{
			"$group": {
				"_id": "$dayOfWeek",
				"numberOfOrders": {
					"$sum": 1
				}
			}
		},
		{
			"$sort": {
				"_id": 1
			}
		},
		{
			"$project": {
				"dayOfWeek": "$_id",
				"numberOfOrders": 1,
				"_id": 0
			}
		}
	];
}



function ordersMonthlyPeriodic(){
	return [
		{
		  "$addFields": {
			"date_time": {
			  "$cond": {
				"if": {
				  "$eq": [
					{
					  "$type": "$date_time"
					},
					"date"
				  ]
				},
				"then": "$date_time",
				"else": null
			  }
			}
		  }
		},
		{
		  "$addFields": {
			"__alias_0": {
			  "month": {
				"$subtract": [
				  {
					"$month": "$date_time"
				  },
				  1
				]
			  }
			}
		  }
		},
		{
		  "$group": {
			"_id": {
			  "__alias_0": "$__alias_0"
			},
			"__alias_1": {
			  "$sum": 1
			}
		  }
		},
		{
		  "$project": {
			"_id": 0,
			"__alias_0": "$_id.__alias_0",
			"__alias_1": 1
		  }
		},
		{
		  "$project": {
			"x": "$__alias_0",
			"y": "$__alias_1",
			"_id": 0
		  }
		},
		{
		  "$sort": {
			"x.month": 1
		  }
		},
		{
		  "$limit": 5000
		},
		{
			$project:{
				"month": "$x.month",
				"quantity": "$y"
			}
		}
	  ]
}

function ordersMonthly(){
	return [
		{
		  "$addFields": {
			"date_time": {
			  "$cond": {
				"if": {
				  "$eq": [
					{
					  "$type": "$date_time"
					},
					"date"
				  ]
				},
				"then": "$date_time",
				"else": null
			  }
			}
		  }
		},
		{
		  "$addFields": {
			"__alias_0": {
			  "year": {
				"$year": "$date_time"
			  },
			  "month": {
				"$subtract": [
				  {
					"$month": "$date_time"
				  },
				  1
				]
			  }
			}
		  }
		},
		{
		  "$group": {
			"_id": {
			  "__alias_0": "$__alias_0"
			},
			"__alias_1": {
			  "$sum": 1
			}
		  }
		},
		{
		  "$project": {
			"_id": 0,
			"__alias_0": "$_id.__alias_0",
			"__alias_1": 1
		  }
		},
		{
		  "$project": {
			"x": "$__alias_0",
			"y": "$__alias_1",
			"_id": 0
		  }
		},
		{
		  "$sort": {
			"x.year": 1,
			"x.month": 1
		  }
		},
		{
		  "$limit": 5000
		}
	  ]
}

function getLogsForUser(userId) {
    const userObjectId = new ObjectId(userId);

    const pipeline = [
        { 
            $match: { user_id: userObjectId } 
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        { 
            $unwind: '$userDetails' 
        },
        {
            $project: {
                _id: 0,
                user_id: 1,
                action_type: 1,
                time: 1,
                firstname: '$userDetails.firstname',
                lastname: '$userDetails.lastname'
            }
        }
    ];

    return pipeline;
}

module.exports = {
	matchAllProductsWithGivenID,
	matchAllBasketsWithGivenUserID,
	matchAllBasketsDetailed,
	matchAllComents,
	searchAllUserComments,
	financialReportUsers,
	countCoustomersInCountries,
	ordersWeekly,
	ordersMonthlyPeriodic,
	ordersMonthly,
	getLogsForUser
};

