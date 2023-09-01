// "use strict";

// /**
//  * order controller
//  */

// const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::order.order");

"use strict";

const { default: Stripe } = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, userName, email } = ctx.request.body;
    try {
      // retrieve item information
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const item = await strapi
            .service("api::item.item")
            .findOne(product.id);

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100,
            },
            quantity: product.count,
          };
        })
      );

      // create a stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        mode: "payment",
        success_url: "http://localhost:3000/checkout/success",
        cancel_url: "http://localhost:3000",
        line_items: lineItems,
      });

      // create the item
      await strapi
        .service("api::order.order")
        .create({ data: { userName, products, stripeSessionId: session.id } });

      // return the session id
      return { id: session.id };
    } catch (error) {
      ctx.response.status = 500;
      return { error: { message: "There was a problem creating the charge" } };
    }
  },
}));

// "use strict";

// const axios = require("axios");

// /**
//  * order controller
//  */

// const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::order.order", {
//   async create(ctx) {
//     const { products, userName, email } = ctx.request.body;

//     try {
//       // Calculate the total amount based on the selected products
//       const totalAmount = products.reduce(
//         (total, product) => total + product.price * product.count,
//         0
//       );

//       // Create an order in your Strapi database
//       const order = await strapi.query("order").create({
//         userName,
//         products,
//         status: "pending",
//       });

//       // Khalti API integration
//       const khaltiConfig = {
//         method: "POST",
//         url: "https://khalti.com/api/v2/payment/initiate/",
//         headers: {
//           Authorization: "Key your_khalti_secret_key_here",
//         },
//         data: {
//           amount: totalAmount * 100, // Convert amount to Paisa (Khalti uses Paisa as currency)
//           mobile: "97798XXXXXXXX", // Customer's mobile number in Nepal format
//           productIdentity: order.id, // Use order ID as the product identity
//           productName: "Your Product Name", // Product name
//           productUrl: "http://your-product-url.com", // URL to your product
//         },
//       };

//       // Initiate the payment with Khalti API
//       const khaltiResponse = await axios(khaltiConfig);

//       // Redirect the user to the Khalti payment URL
//       ctx.response.redirect(khaltiResponse.data.data.url);

//       return { message: "Redirecting to Khalti for payment..." };
//     } catch (error) {
//       console.error("Payment error:", error);
//       ctx.response.status = 500;
//       return {
//         error: { message: "There was a problem initiating the payment" },
//       };
//     }
//   },
// });
