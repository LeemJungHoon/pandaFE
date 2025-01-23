import "./order_detail.css";
import { init } from "../common/js/common";
const target = document.querySelector("body");

const getCardItems = async () => {
  console.log(`bearer ${localStorage.getItem("login-token")}`);
  const response = await fetch("https://panda-be.vercel.app/api/order", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage.getItem("login-token")}`,
    },
  });

  if (!response.ok) throw new Error();

  return await response.json();
};

const cartDetailRender = async () => {
  target.innerHTML = "";

  const cartItems = await getCardItems();

  target.innerHTML = `
  <div class="menu_sub_member"></div>
  <div class="logo"></div>
  <div class="menu_main"></div>
  ${cartItems
    //?쓴 이유는 빈배열을 전달해줘도 에러 안나게 하려고임!
    ?.map(
      (cartItem) => `
    <div class="order_detail">
      <div class="order_detail_list">
        <h1>
          <img src="/img/black_flower_small.png" alt="" />주문번호 : ${
            cartItem.orderNumber
          }
        </h1>
        ${cartItem.items.map(
          (product, index) => `
        <div class="order_detail_item">
              <div class="item_name">
                <h2 class="flower_name">${index + 1}. ${product.item.name}</h2>
              </div>
              <div class="item_content">
                <div class="left">
                  <img
                    class="flower_image"
                    src="https://panda-be.vercel.app/${product.item.imageUrl}"
                    alt=""
                  />
                </div>
                <div class="right">
                  <p class="item_price">금액 : ${product.item.price} 원</p>
                  <p class="item_count">
                    수량 : <span class="count">${product.quantity}</span>
                    <span class="count_btn">
                      <button type="button" id="up_btn">▲</button>
                      <button type="button" id="down_btn">▼</button>
                    </span>
                  </p>
                  <p class="total_price">총 금액 : <span>${
                    product.item.price * product.quantity
                  }</span>원</p>
                </div>
              </div>
            </div>
          `
        )}
      </div>
      <div class="order_detail_pop" data-order-number="${cartItem.orderNumber}">
        <div class="cp_body">
          <h1 class="cp_top">주문금액</h1>
          <h2 class="cp_top2">
            <p>총 주문금액</p>
            <b>${cartItem.items.reduce(
              (acc, cur) => acc + cur.item.price * cur.quantity,
              0
            )} 원</b>
          </h2>
          <h3 class="cp_top3">배송상태 : ${cartItem.deliveryStatus}</h3>
          <div class="cp_order_number">
            <img lass="flower_image" src="/img/black_flower_small.png" alt="" />
            <p>주문번호 : ${cartItem.orderNumber}</p>
          </div>
          <button type="button" id="orderCancleBtn" class="o_c_btn">
            주문취소
          </button>
          <button type="button" id="destinationModifyBtn" class="d_m_btn">
            배송지수정
          </button>
        </div>
      </div>
    </div>
    `
    )
    .join("")}`;

  init();

  const deleteBtnFetch = (orderNumber) => {
    fetch(`https://panda-be.vercel.app/api/order/${orderNumber}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("login-token")}`,
      },
    });
  };

  document.querySelectorAll(".o_c_btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const target = e.currentTarget.closest(".order_detail_pop");
      const orderNumber = target.dataset["orderNumber"];
      await deleteBtnFetch(orderNumber);

      //삭제할 주문내역 감싸는 컨테이너
      const container = e.currentTarget.closest(".order_detail");
      container.remove();
    });
  });
};

cartDetailRender();
