function matchAllProductsWithGivenID(productID){
    return [
      {
        $match: {
          product_id: productID,
        },
      },
    ];
}


module.exports = {matchAllProductsWithGivenID}

