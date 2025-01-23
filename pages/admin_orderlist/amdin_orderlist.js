// 주문 div클릭시

const axios = require("axios").default;
const instance = axios.create({
  baseURL: "https://panda-be.vercel.app/",
});
const ao_num = document.querySelector(".ao_num");
const ao_name = document.querySelector(".ao_name");
const ao_ordernum = document.querySelector(".ao_ordernum");
const ao_product = document.querySelector(".ao_product");
const ao_pay = document.querySelector(".ao_pay");
const ao_status = document.querySelector(".ao_status");
const ao_date = document.querySelector(".ao_date");
//const offset = 4;

// 흐름
// POST request -> login -> respond jwta token
// with jwt token -> we can authorize our authority
// 1. login
// 2. get jwt token when login
// 3. GET request with jwt token
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InMzTTBBenBwTiIsImF1dGgiOnRydWUsImlhdCI6MTY5NzEzMjM4MSwiZXhwIjoxNjk3MTM5NTgxfQ.ipEDfB4fj6CQNPV-dGt7TDdupILM-ok3-1ifm_Zi-Kw"; //로컬스토리지 저장 이름

// 주문번호 검색 input => search 버튼

window.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", searchOrder);

  let orders = fetchOrderData();
  for (let i = 0; i < 4; i++) {
    ao_num[i].innerValue = i + 1;
    ao_name[i].textContent = orders[i].recipient;
    ao_ordernum[i].textContent = orders[i].orderNumber;
    ao_product[i].textContent = orders[i].items[0].name;
    ao_pay[i].textContent = orders[i].totalPrice;
    ao_status[i].textContent = orders[i].deliverySataus;
    ao_date[i].textContent = orders[i].createdAt;
  }
});

function fetchOrderData() {
  instance
    .get("api/admin/orders", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data; // list
      } else {
        throw new Error("can not get orders from server");
      }
    });
}

// 로그아웃

//관리자모드
