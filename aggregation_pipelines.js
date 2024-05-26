const mongoose = require("mongoose");


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




module.exports = {
  matchAllProductsWithGivenID,
  matchAllBasketsWithGivenUserID,
};

