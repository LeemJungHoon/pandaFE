//주문확인 - 회원 페이지
let orderNum = "";

const accessToken = localStorage.getItem("login-token");
const orderCheckMemberName = document.getElementById("ordercheck_member_name");
const orderCheckMemberNumber = document.getElementById(
  "ordercheck_member_number"
);
const orderCheckMemberaddr = document.getElementById(
  "ordercheck_member_address"
);
const payBtn = document.getElementById("payBtn");
const correctMemberInfoBtn = document.querySelector(".correct_info");
const totalPrice = document.querySelector(".cp_total_price");
const orderCheckMemberList = document.querySelector(".ordercheck_member_list");
const itemsToPurchase = [];
let cpTotalPrice = 0;

window.addEventListener("DOMContentLoaded", () => {
  try {
    fetch("https://panda-be.vercel.app/api/cart", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          const itemImgURL = data[i].item.imageUrl;
          const itemName = data[i].item.name;
          const itemPrice = data[i].item.price;
          const itemQuantity = data[i].quantity;
          const itemTotalPrice = itemPrice * itemQuantity;
          console.log(itemTotalPrice);
          cpTotalPrice += itemTotalPrice;

          itemsToPurchase.push({
            item: data[i].item._id,
            quantity: itemQuantity,
          });
          console.log(itemsToPurchase);
          const orderCheckMemberItemBody = `
                        <div class="left">
                            <img src="https://panda-be.vercel.app/${itemImgURL}" alt="">
                        </div>
                        <div class="right">
                            <h2 class="omi_name">${itemName}</h2>
                            <h3 class="omi_info">
                                <p class="omi_info_2">금액 : ${itemPrice} 원</p>
                                <p class="omi_info_3">수량 : ${itemQuantity}</p>
                            </h3>
                            <h4 class="omi_total">총 금액 : ${itemTotalPrice} 원</h4>
                        </div>
                    `;
          const orderCheckMemberItem = document.createElement("div");
          orderCheckMemberItem.classList.add("ordercheck_member_item");
          orderCheckMemberItem.innerHTML += orderCheckMemberItemBody;
          orderCheckMemberList.append(orderCheckMemberItem);
        }
        totalPrice.innerHTML = cpTotalPrice;
      })
      .catch((err) => {
        console.log("패치안에 캐치에러", err);
      });
  } catch (err) {
    console.log("try,catch에 catch에러");
  }
});

//주문금액

//회원정보와일치 클릭시 API - 완
correctMemberInfoBtn.addEventListener("click", () => {
  fetch("https://panda-be.vercel.app/api/users/my", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data.name);
      console.log(data.phoneNumber);
      console.log(data.address);
      orderCheckMemberName.value = data.name;
      orderCheckMemberNumber.value = data.phoneNumber;
      orderCheckMemberaddr.value = data.address;
    })
    .catch((err) => {
      console.log("에러뜸", err);
    });
});

//최종 결제하기 눌렀을때 API
payBtn.addEventListener("click", () => {
  const orderCheckData = {
    recipient: orderCheckMemberName.value,
    contact: orderCheckMemberNumber.value,
    shippingAddress: orderCheckMemberaddr.value,
    totalPrice: cpTotalPrice,
    items: itemsToPurchase,
  };

  fetch("https://panda-be.vercel.app/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderCheckData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        console.log(data);
        orderNum += data.orderNumber;
        // console.log(data.orderNumber);
        console.log(orderNum);
        localStorage.setItem("order-number", orderNum);
      } else {
        alert("정보 수정 실패!!!");
      }
      location.href = "/pages/order_complete/";
    })
    .catch((err) => {
      console.log("요청실패", err);
    });
});
