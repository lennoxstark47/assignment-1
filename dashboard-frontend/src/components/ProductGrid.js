import React from "react";

const ProductGrid = ({ products, highlightedRow }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Products ({products.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`
              bg-gray-50 border border-gray-200 rounded-lg p-4
              flex flex-col justify-between items-start
              ${highlightedRow(product.id, "products") ? "highlight-card" : ""} {/* Call the highlightedRow function */}
            `}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between w-full text-sm font-medium text-gray-700">
              <span>Price: ${parseFloat(product.price).toFixed(2)}</span>
              <span>Stock: {product.stock_quantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
