import { flowerMarketDetailRender } from "/pages/flower_market_detail/flower_market_detail.js";

export function routerInit() {
  const root = document.body;
  //URL
  const pathname = window.location.pathname;
  const [, ...currentPath] = pathname.split("/");

  if (currentPath && currentPath.length) {
    if (currentPath.length === 3) {
      const path = currentPath[1];
      if (path === "flower_market_detail") {
        //상품 고유 id
        const id = currentPath[2];
        if (id) {
          //페이지 초기화
          root.innerHTML = "";
          flowerMarketDetailRender(root, id);
        }
      }
    }
  }
}
