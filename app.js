require('dotenv').config();
const axios = require('axios');

const SHOP_NAME = process.env.SHOP_NAME;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Define product tags, price types, and formulas
const PRODUCTS = [
    { tags: ["gld", "egl", "coin", "1oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "egl", "coin", "1/2 oz"], priceType: "gold", formula: (price) => price * 0.5 * 1.03 },
    { tags: ["gld", "egl", "coin", "1/4 oz"], priceType: "gold", formula: (price) => price * 0.25 * 1.03 },
    { tags: ["gld", "egl", "coin", "1/10 oz"], priceType: "gold", formula: (price) => price * 0.1 * 1.03 },
    { tags: ["gld", "maple", "coin", "1 oz"], priceType: "gold", formula: (price) => price + 100 },
    { tags: ["gld", "maple", "coin", "1/2 oz"], priceType: "gold", formula: (price) => price * 0.5 * 1.03 },
    { tags: ["gld", "maple", "coin", "1/4 oz"], priceType: "gold", formula: (price) => price * 0.25 * 1.03 },
    { tags: ["gld", "maple", "coin", "1/10 oz"], priceType: "gold", formula: (price) => price * 0.1 * 1.03 },
    { tags: ["gld", "brtn", "coin", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "brtn", "coin", "1/2 oz"], priceType: "gold", formula: (price) => price * 0.5 * 1.03 },
    { tags: ["gld", "brtn", "coin", "1/4 oz"], priceType: "gold", formula: (price) => price * 0.25 * 1.03 },
    { tags: ["gld", "brtn", "coin", "1/10 oz"], priceType: "gold", formula: (price) => price * 0.1 * 1.03 },
    { tags: ["gld", "bfl", "coin", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "33", "coin", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "33", "coin", "1/2 oz"], priceType: "gold", formula: (price) => price * 0.5 * 1.03 },
    { tags: ["gld", "kngr", "coin", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "kngr", "coin", "1/2 oz"], priceType: "gold", formula: (price) => price * 0.5 * 1.03 },
    { tags: ["gld", "kngr", "coin", "1/4 oz"], priceType: "gold", formula: (price) => price * 0.25 * 1.03 },
    { tags: ["gld", "kngr", "coin", "1/10 oz"], priceType: "gold", formula: (price) => price * 0.1 * 1.03 },
    { tags: ["gld", "panda", "coin", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "panda", "coin", "1/2 oz"], priceType: "gold", formula: (price) => price * 0.5 * 1.03 },
    { tags: ["gld", "pamp", "bar", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "royal canadian", "bar", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "Perth", "bar", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "Argor", "bar", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "johnson", "bar", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "Valcambi", "bar", "1 oz"], priceType: "gold", formula: (price) => price * 1.03 },
    { tags: ["gld", "Valcambi", "bar", "10 oz"], priceType: "gold", formula: (price) => price * 10.0 * 1.03 },
    { tags: ["gld", "Perth", "bar", "10 oz"], priceType: "gold", formula: (price) => price * 10.0 * 1.03 },
    { tags: ["gld", "pamp", "bar", "10 oz"], priceType: "gold", formula: (price) => price * 10.0 * 1.03 },
    { tags: ["gld", "johnson", "bar", "10 oz"], priceType: "gold", formula: (price) => price * 10.0 * 1.03 },
    { tags: ["gld", "royal canadian", "bar", "1 kilo"], priceType: "gold", formula: (price) => price * 32.15 * 1.03 },
    { tags: ["gld", "johnson", "bar", "1 kilo"], priceType: "gold", formula: (price) => price * 32.15 * 1.03 },
    { tags: ["gld", "Perth", "bar", "1 kilo"], priceType: "gold", formula: (price) => price * 32.15 * 1.03 },
    { tags: ["gld", "Valcambi", "bar", "1 kilo"], priceType: "gold", formula: (price) => price * 32.15 * 1.03 },
    { tags: ["gld", "pamp", "bar", "1 gram"], priceType: "gold", formula: (price) => price * 0.035 * 1.03 },
    { tags: ["gld", "Perth", "bar", "1 gram"], priceType: "gold", formula: (price) => price * 0.035 * 1.03 },
    { tags: ["gld", "Argor", "bar", "1 gram"], priceType: "gold", formula: (price) => price * 0.035 * 1.03 },
    { tags: ["gld", "Valcambi", "bar", "1 gram"], priceType: "gold", formula: (price) => price * 0.035 * 1.03 },
    { tags: ["gld", "Argor", "bar", "10 gram"], priceType: "gold", formula: (price) => price * 0.35 * 1.03 },
    { tags: ["gld", "Valcambi", "bar", "10 gram"], priceType: "gold", formula: (price) => price * 0.35 * 1.03 },
    { tags: ["gld", "Perth", "bar", "10 gram"], priceType: "gold", formula: (price) => price * 0.35 * 1.03 },
    { tags: ["gld", "pamp", "bar", "10 gram"], priceType: "gold", formula: (price) => price * 0.35 * 1.03 },
    { tags: ["gld", "Valcambi", "bar", "100 gram"], priceType: "gold", formula: (price) => price * 3.5 * 1.03 },
    { tags: ["gld", "Argor", "bar", "100 gram"], priceType: "gold", formula: (price) => price * 3.5 * 1.03 },
    { tags: ["gld", "Perth", "bar", "100 gram"], priceType: "gold", formula: (price) => price * 3.5 * 1.03 },
    { tags: ["gld", "pamp", "bar", "100 gram"], priceType: "gold", formula: (price) => price * 3.5 * 1.03 },
    { tags: ["gld", "pamp", "bar", "20 gram"], priceType: "gold", formula: (price) => price * 0.705 * 1.03 },
    { tags: ["gld", "Perth", "bar", "5 gram"], priceType: "gold", formula: (price) => price * 0.176 * 1.03 },
    { tags: ["slvr", "coin", "1 oz"], priceType: "silver", formula: (price) => price * 1.25 },
     { tags: ["slvr", "bar", "10 oz"], priceType: "silver", formula: (price) => price * 1.25 * 10 }.
    
];

async function getMetalPrices() {
    try {
        const [goldResponse, silverResponse] = await Promise.all([
            axios.get("https://api.gold-api.com/price/XAU"),
            axios.get("https://api.gold-api.com/price/XAG")
        ]);
        return {
            gold: goldResponse.data.price,
            silver: silverResponse.data.price
        };
    } catch (error) {
        console.error("Error fetching metal prices:", error.response?.data || error.message);
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
        console.error("Error fetching products:", error.response?.data || error.message);
        return [];
    }
}

async function updateProductPrice(productId, variants, newPrice, comparePrice) {
    const url = `https://${SHOP_NAME}.myshopify.com/admin/api/2023-10/products/${productId}.json`;

    // Update only the price and compare_at_price for all variants
    const updatedVariants = variants.map((variant) => ({
        id: variant.id,
        price: newPrice.toFixed(2),
        compare_at_price: comparePrice.toFixed(2)
    }));

    const data = {
        product: {
            id: productId,
            variants: updatedVariants
        }
    };

    try {
        await axios.put(url, data, {
            headers: { "X-Shopify-Access-Token": ACCESS_TOKEN }
        });
        console.log(`Updated product ${productId} to price ${newPrice} and compare price ${comparePrice}`);
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error.response?.data || error.message);
    }
}

async function updatePrices() {
    const metalPrices = await getMetalPrices();
    if (!metalPrices) {
        console.log("Unable to fetch metal prices. Exiting.");
        return;
    }

    const allProducts = await getProducts();
    if (allProducts.length === 0) {
        console.log("No products found in the store.");
        return;
    }

    for (const product of PRODUCTS) {
        const metalPrice = metalPrices[product.priceType];
        if (!metalPrice) {
            console.log(`Invalid price type: ${product.priceType}`);
            continue;
        }

        const adjustedPrice = product.formula(metalPrice);
        const comparePrice = (adjustedPrice * 1.09); // 9% higher for compare price
        console.log(`Calculated price for tags [${product.tags.join(", ")}]: ${adjustedPrice}, compare price: ${comparePrice}`);

        // Filter products by tags
        const filteredProducts = allProducts.filter((p) => {
            const productTags = p.tags.split(", ").sort();
            const requiredTags = product.tags.sort();
            return JSON.stringify(requiredTags) === JSON.stringify(productTags);
        });

        if (filteredProducts.length === 0) {
            console.log(`No products found with tags: [${product.tags.join(", ")}]`);
            continue;
        }

        // Update only the filtered products
        for (const p of filteredProducts) {
            await updateProductPrice(p.id, p.variants, adjustedPrice, comparePrice);
        }
    }
}

// Run the script
updatePrices();




