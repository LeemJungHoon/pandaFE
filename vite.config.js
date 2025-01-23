import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        join: resolve(__dirname, "pages/join/index.html"),
        login: resolve(__dirname, "pages/login/index.html"),
        admin_category: resolve(__dirname, "pages/admin_category/index.html"),
        admin_orderlist: resolve(__dirname, "pages/admin_orderlist/index.html"),
        cart: resolve(__dirname, "pages/cart/index.html"),
        flower_market: resolve(__dirname, "pages/flower_market/index.html"),
        flower_market_detail: resolve(
          __dirname,
          "pages/flower_market_detail/index.html"
        ),
        join_complete: resolve(__dirname, "pages/join_complete/index.html"),
        order_complete: resolve(__dirname, "pages/order_complete/index.html"),
        order_detail: resolve(__dirname, "pages/order_detail/index.html"),
        order_detail_destination_modify: resolve(
          __dirname,
          "pages/order_detail_destination_modify/index.html"
        ),
        ordercheck_member: resolve(
          __dirname,
          "pages/ordercheck_member/index.html"
        ),
        ordercheck_nonemember: resolve(
          __dirname,
          "pages/ordercheck_nonemember/index.html"
        ),
        present: resolve(__dirname, "pages/present/index.html"),
        vase: resolve(__dirname, "pages/vase/index.html"),
        my_page: resolve(__dirname, "pages/my_page/index.html"),
      },
    },
  },
});
