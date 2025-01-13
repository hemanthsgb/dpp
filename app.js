require('dotenv').config();
const axios = require('axios');

const SHOP_NAME = process.env.SHOP_NAME;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Define product tags, API URLs, and pricing formulas
const PRODUCTS = [
    { tag: "gld", apiUrl: "https://api.gold-api.com/price/XAU", formula: (price) => price * 1.2 + 10 },
    { tag: "slvr", apiUrl: "https://api.gold-api.com/price/XAG", formula: (price) => price * 1.9 + 5 }
];

async function getMetalPrice(apiUrl) {
    try {
        const response = await axios.get(apiUrl);
        return response.data.price; // Extract price from API response
    } catch (error) {
        console.error(`Error fetching price from ${apiUrl}:`, error.response?.data || error.message);
        return null;
    }
}

async function getProducts() {
    const url = `https://${SHOP_NAME}.myshopify.com/admin/api/2023-10/products.json?limit=250`;
    try {
        const response = await axios.get(url, {
            headers: { "X-Shopify-Access-Token": ACCESS_TOKEN }
        });
        return response.data.products || [];
    } catch (error) {
        console.error(`Error fetching products:`, error.response?.data || error.message);
        return [];
    }
}

async function updateProductPrice(productId, newPrice) {
    const url = `https://${SHOP_NAME}.myshopify.com/admin/api/2023-10/products/${productId}.json`;
    const data = {
        product: {
            id: productId,
            variants: [{ price: newPrice }]
        }
    };

    try {
        await axios.put(url, data, {
            headers: { "X-Shopify-Access-Token": ACCESS_TOKEN }
        });
        console.log(`Updated product ${productId} to price ${newPrice}`);
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error.response?.data || error.message);
    }
}

async function updatePrices() {
    const allProducts = await getProducts();
    if (allProducts.length === 0) {
        console.log("No products found in the store.");
        return;
    }

    for (const product of PRODUCTS) {
        const metalPrice = await getMetalPrice(product.apiUrl);
        if (!metalPrice) continue;

        const adjustedPrice = product.formula(metalPrice);
        console.log(`Calculated new price for ${product.tag}: ${adjustedPrice}`);

        // Filter products by tag
        const filteredProducts = allProducts.filter((p) =>
            p.tags.split(", ").includes(product.tag)
        );

        if (filteredProducts.length === 0) {
            console.log(`No products found with tag: ${product.tag}`);
            continue;
        }

        // Update only the filtered products
        for (const p of filteredProducts) {
            await updateProductPrice(p.id, adjustedPrice);
        }
    }
}

// Run the script
updatePrices();
