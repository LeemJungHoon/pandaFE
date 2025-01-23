import { init } from "/pages/common/js/common.js";
import "./flower_market_detail.css";

const orderFetch = (product, quantity) => {
  if (!localStorage.getItem("login-token")) {
    if (!localStorage.getItem("nonMembercartProduct")) {
      localStorage.setItem(
        "nonMembercartProduct",
        `${product.name.split(" ").join("")} ${product.imageUrl} ${
          product.price
        } ${Number(quantity.innerHTML)}`
      );
    } else {
      console.log("hi");
      localStorage.setItem(
        "nonMembercartProduct",
        `${localStorage.getItem("nonMembercartProduct")}/${product.name
          .split(" ")
          .join("")} ${product.imageUrl} ${product.price} ${Number(
          quantity.innerHTML
        )}`
      );
    }
  } else {
    try {
      const accessToken = localStorage.getItem("login-token");

      fetch("http://kdt-sw-6-team10.elicecoding.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${accessToken}`,
        },
        body: JSON.stringify({
          item: product._id, // _id < 아이템 ID
          quantity: Number(quantity.innerHTML), // 수량
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

const getProduct = async (id) => {
  const response = await fetch(
    `http://kdt-sw-6-team10.elicecoding.com/api/items/${id}`,
    {
      method: "GET",
    }
  ).then((res) => res.json());
  if (!response.data) throw new Error("error");

  return response.data;
};

const eventInit = (product) => {
  const { item_id } = product;
  const upBtn = document.querySelector(".up");
  const downBtn = document.querySelector(".down");

  const cartBtn = document.querySelector(".push_cart");

  const orderBtn = document.querySelector(".order_btn");

  //수량
  const quantity = document.querySelector(".count_num");

  // 꽃 한개 금액
  const price = document.querySelector(".price");

  const totalPrice = document.querySelector(".total_price");

  const flowerProductImage = document.querySelector(".flower_product_image");
  const flowerName = document.querySelector(".flower_name");
  const flowerDescription = document.querySelector(".flower_description");

  // 수량 추가 버튼
  upBtn.addEventListener("click", () => {
    quantity.innerHTML = Number(quantity.innerHTML) + 1;

    totalPrice.innerHTML =
      parseInt(price.innerHTML) * parseInt(quantity.innerHTML);
    console.log(product);
  });

  // 수량 감소 버튼 - 최소 1개 이상 선택. 아닐 경우 alert로 경고
  downBtn.addEventListener("click", () => {
    if (Number(quantity.innerHTML) > 1) {
      quantity.innerHTML = Number(quantity.innerHTML) - 1;
      console.log(quantity.innerHTML);

      totalPrice.innerHTML =
        Number(totalPrice.innerHTML) - parseInt(price.innerHTML);
    } else {
      alert("최소 1개 이상 선택해야 주문할 수 있습니다.");
    }
  });

  orderBtn.addEventListener("click", async () => {
    await orderFetch(product, quantity);
  });
  cartBtn.addEventListener("click", async () => {
    await orderFetch(product, quantity);
    alert("장바구니에 상품이 담겼습니다.");
  });
};

export const flowerMarketDetailRender = async (root, id) => {
  const product = await getProduct(id);

  root.innerHTML = `
  <div class="menu_sub_member"></div>
    <div class="logo"></div>
    <div class="menu_main"></div>

    <div class="flower_market_detail">
      <div class="left">
        <img src="http://kdt-sw-6-team10.elicecoding.com/${product.imageUrl}" alt="" />
      </div>

      <div class="right">
        <div class="title">
          <img src="/img/black_flower_small.png"
          " alt="" />
          <h1 class="flower_name">${product.name}</h1>
          <img
            class="flower_product_image"
            src="/img/black_flower_small.png"
            alt=""
          />
        </div>

        <div class="info">
          <p class="price_container">
            금액 : <span class="price">${product.price}</span> 원
          </p>
          <p class="count">
            수량
            <span class="count_num">1</span>
            <span class="count_btn">
              <button type="button" class="up">▲</button>
              <button type="button" class="down">▼</button>
            </span>
          </p>
        </div>
        <div class="total_price_container">
          <p>총 주문 금액 : <span class="total_price">${product.price}</span> 원</p>
        </div>
        <div class="fmd_btn">
          <button type="button" class="push_cart">장바구니에 넣기</button>
          <a href="/pages/cart/index.html" type="button" class="order_btn">주문하기</a>
        </div>
        <div class="more">
          <p class="flower_description">
            ${product.description}
          </p>
        </div>
      </div>
    </div>
    <div class="footer"></div>
  `;

  init();
  eventInit(product);
};
