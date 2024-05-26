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


function matchAllBasketsDetailed(userId, title, brand, category){


  const userObjectId = new ObjectId(userId);
  const productSearchCriteria = [];

  if (title) productSearchCriteria.push({ 'productDetails.title': { $regex: title, $options: "i" } });
  if (brand) productSearchCriteria.push({ 'productDetails.brand': { $regex: brand, $options: "i" } });
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
                : [true] // No filtering if no search criteria
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
                brand: '$$product.brand',
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





module.exports = {
  matchAllProductsWithGivenID,
  matchAllBasketsWithGivenUserID,
  matchAllBasketsDetailed
};

