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
  return [
    {
      $match : {
        user_id : userID
      }
    }
  ];
}


module.exports = {
  matchAllProductsWithGivenID,
  matchAllBasketsWithGivenUserID,
};

