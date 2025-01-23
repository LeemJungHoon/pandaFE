// 각 상품 들어갈 카트 리스트 div
const cartListItem = document.getElementsByClassName("cart_list_item")[0];
// 각각의 상품 총 가격
const totalProductPrice = document.getElementsByClassName("total_product_price")[0];
// 우측 전체 상품 가격
const cartPopTotalPrice = document.getElementsByClassName("cart_pop_total_price")[0];
// 선택상품삭제 버튼
const chooseItemDeleteBtn = document.getElementsByClassName("cid")[0];
// 전체상품삭제 버튼
const allItemDeleteBtn = document.getElementsByClassName("aid")[0];
// 주문하기 버튼
const orderBtn = document.getElementsByClassName("obtn")[0];
// 상품 총 가격
let totalPrice = 0;
// 로컬스토리지에 있는 내용 split으로 자른것
let arrProduct = [];


// 페이지 로드 될 때 세션에 있는 상품들 화면에 뿌려주기
window.addEventListener("DOMContentLoaded", async () => {

    // 테스트용 토큰 데이터/

    try{
        if(localStorage.getItem("login-token")){
            //로그인 되어있을 때            
            await cartMemberLogic();
        }else{
            // 로그인 안되어 있을 때
            await cartNonMemberLogic();
        }
    }catch(err){
        console.log(`페이지 로드 에러 : ${err}`);
    }
})

// 회원 로직
const cartMemberLogic = async () => {
console.log("회원로직");
    try{
        await fetch("http://kdt-sw-6-team10.elicecoding.com/api/cart", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("login-token")}`,
          },
        })
          .then((response) => response.json())
          .then((dbData) => {
            dbData.forEach((data) => {
                totalPrice += Number(data.item.price)* Number(data.quantity);
                makeCartProduct(data.item.name, data.item.imageUrl, data.item.price, data.quantity, data.item._id);
            })
            cartPopTotalPrice.innerHTML = totalPrice.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
          });
    }catch(err){
        console.log(err);
    }
}



// 비회원 로직
const cartNonMemberLogic = () => {
    console.log("비회원로직");
    localStorage.getItem("nonMembercartProduct") ? 0 : alert("장바구니에 상품이 없습니다.");
    
    let product = localStorage.getItem("nonMembercartProduct");
    
    arrProduct = product.split("/");

    arrProduct.forEach((item) => {
        const arrItem = item.split(" ");
        makeCartProduct(arrItem[0],arrItem[1],arrItem[2],arrItem[3],0);
        totalPrice += Number(arrItem[2])* Number(arrItem[3]);
    })

    // 전체 가격 설정
    cartPopTotalPrice.innerHTML = totalPrice.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
}

// 선택상품 삭제 눌렀을 때
chooseItemDeleteBtn.addEventListener("click", () =>{

    if(localStorage.getItem("login-token")){
            

        const cbxCartItem = document.getElementsByClassName("cbx_cart_item");

        const cartItem = [];

        for(let i=1; i<=document.querySelectorAll(".cart_item").length; i++){
            if(cbxCartItem[i-1].checked){
                cartItem[i-1] = `${document.querySelectorAll(".cart_item")[i-1].id}`
            }
        }


        fetch("http://kdt-sw-6-team10.elicecoding.com/api/cart", {
        method: "DELETE",
        headers: {            
        "Content-Type": "application/json",            
        Authorization: `bearer ${localStorage.getItem("login-token")}`,
      },
        body: JSON.stringify(cartItem),
    })
      .then((response) => response.json())
      .then((dbData) => {
            console.log(dbData);
      });

      location.reload();

    }else{
        //비회원 로직
        // 이 부분 원래 페이지 로드될 때 최상단에 정의하려고 했었는데..
        // 페이지 로드할때 DOMContentLoaded보다 변수부분을 먼저 정의를 하나봄. 없다고 나와서 여기서 정의해야함
        const cbxCartItem = document.getElementsByClassName("cbx_cart_item");
        
        // 배열 깊은복사 해야 arrProductData값이 바뀌더라도 기존 arrProduct값이 같이 안바뀜
        let arrProductData = JSON.parse(JSON.stringify(arrProduct));
        
        for(let i=1; i<=cbxCartItem.length; i++){
            if(cbxCartItem[i-1].checked){
                //체크가 하나라도 돼있으면 페이지를 리로드해야하므로 일단 가져온 로컬 스토리지 삭제하고
                localStorage.removeItem("nonMembercartProduct");
                // 배열에 해당 인덱스의 값을 삭제 = 해당 상품 div삭제
                arrProductData.splice(i-1,1);
            }
        }

        // 로컬 스토리지에 배열인덱스 돌면서 값 추가.
        // 해당 행동은 이 cart 페이지 전에 상품 세부 페이지(장바구니에 추가하기 ,주문하기 있는 페이지)에서
        //보내는 data와 동일하게 스토리지에 담고, 다시 reload시킴으로써 이 페이지에 다시 들어오는 효과를 기대.
        arrProductData.forEach((item) => {
            const arrItem = item.split(" ");
            
            if(!localStorage.getItem("nonMembercartProduct")){
                localStorage.setItem("nonMembercartProduct", `${arrItem[0]} ${arrItem[1]} ${arrItem[2]} ${arrItem[3]}`);
            }else{
                localStorage.setItem("nonMembercartProduct", `${localStorage.getItem("nonMembercartProduct")}/${arrItem[0]} ${arrItem[1]} ${arrItem[2]} ${arrItem[3]}`);
            }   
        })
        // 삭제 다 되면 페이지 리로드해서 변경 내역 보여주기.
        location.reload();
    }
})

// 전체상품 삭제 눌렀을 때
allItemDeleteBtn.addEventListener("click", async () => {
    
    if(localStorage.getItem("login-token")){

        let del = [];

        for(let i=1; i<=document.querySelectorAll(".cart_item").length; i++){
            del[i-1] = `${document.querySelectorAll(".cart_item")[i-1].id}`
        }

        await fetch("http://kdt-sw-6-team10.elicecoding.com/api/pages/cart", {
        method: "DELETE",
        headers: {            
        "Content-Type": "application/json",            
        Authorization: `bearer ${localStorage.getItem("login-token")}`,
      },
        body: JSON.stringify(del),
    })
      .then((response) => response.json())
      .then((dbData) => {
            console.log(dbData);
      });
      location.reload();
    }else{
        // 모든 카테고리 비워주면 되는거니까
        // 로컬 스토리지 삭제하고 리로드하면 끝남
        localStorage.removeItem("nonMembercartProduct");

        location.reload();
    }
})

// 주문하기 눌렀을 때
orderBtn.addEventListener("click", async () => {
    try{

        if(localStorage.getItem("login-token")){
            
            let cartData = [];

            for(let i=0; i<=document.querySelectorAll(".cart_item").length-1; i++){
                cartData[i] = {"item":`${document.querySelectorAll(".cart_item")[i].id}`,"quantity":`${Number(document.querySelectorAll(".item_count")[i].id)}`};
            }

            console.log(JSON.stringify(cartData));
            await fetch("http://kdt-sw-6-team10.elicecoding.com/api/cart", {
            method: "PATCH",
            headers: {            
            "Content-Type": "application/json",            
            Authorization: `bearer ${localStorage.getItem("login-token")}`,
          },
            body: JSON.stringify(cartData),
        })
          .then((response) => response.json())
          .then((dbData) => {
                console.log(dbData);
          });

          alert("주문완료 되었습니다.");
          location.href="/pages/ordercheck_member/";

        }else{
            //비회원 로직
            location.href="/pages/ordercheck_nonemember/";
        }

        
    }catch(err){
        console.log(err);
    }
})

// 수량 증,감 눌렀을 때
cartListItem.addEventListener("click", (e) => {
    // 클릭을 저 업다운 버튼만 눌리게 처리해야돼서 해당 분기부터 처리함.
    if(!(e.target.innerHTML === "▲") && !(e.target.innerHTML === "▼")){
        return 0;
    }

    if(localStorage.getItem("login-token")){
        const productName = (e.target.closest(".cart_item"));
        // 상품개수
        let pdn = productName.querySelector('.product_num');
        // 상품가격
        let pdp = productName.querySelector('.item_price').id;
        let ttp = productName.querySelector('.total_product_price');
        let prdtp = 0;
        console.log()
        if(e.target.innerHTML === "▲") {
            pdn.innerHTML = Number(pdn.innerHTML) + 1;

            // 우측 총 금액 수정.
            cartPopTotalPrice.innerHTML = (Number(cartPopTotalPrice.innerHTML.split(",").join("")) + Number(pdp)).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
        }else if(e.target.innerHTML === "▼"){
            pdn.innerHTML = Number(pdn.innerHTML) -1;
            if(Number(pdn.innerHTML) == -1){
                pdn.innerHTML = 0;
                pdp=0;
            }

            cartPopTotalPrice.innerHTML = (Number(cartPopTotalPrice.innerHTML.split(",").join("")) - Number(pdp)).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
        }

        // 증감에 따라 개별 상품 금액 수정
        ttp.innerHTML = Number(pdn.innerHTML) * Number(pdp);

    }else{
        localStorage.removeItem("nonMembercartProduct");

        const productName = (e.target.closest(".cart_item > div").id);

        let arrProductData = JSON.parse(JSON.stringify(arrProduct));

        // 추가 버튼눌린거면
        if(e.target.innerHTML === "▲") {
            arrProductData.forEach((item) => {
                const arrItem = item.split(" ");
                // 배열 돌면서 상품명이 클릭한 상품명과 동일하다면
                // 해당 컨테이너 내에 있다는 얘기니까 그 컨테이너에 있는 데이터의 값만 수정해서
                // 다시 스토리지에 넣을거임...
                // 진짜 개복잡ㅎ하다
                arrItem[0] === productName ? arrItem[3] = `${Number(arrItem[3])+1}` : 0;
        
                if(!localStorage.getItem("nonMembercartProduct")){
                    localStorage.setItem("nonMembercartProduct", `${arrItem[0]} ${arrItem[1]} ${arrItem[2]} ${arrItem[3]}`);
                }else{
                    localStorage.setItem("nonMembercartProduct", `${localStorage.getItem("nonMembercartProduct")}/${arrItem[0]} ${arrItem[1]} ${arrItem[2]} ${arrItem[3]}`);
                }   
            })
            
        }else if(e.target.innerHTML === "▼"){
            arrProductData.forEach((item) => {
                const arrItem = item.split(" ");
                arrItem[0] === productName ? arrItem[3] = `${Number(arrItem[3])-1}` : 0;
                
                arrItem[3] == "-1" ? arrItem[3] = 0 : 0;

                //console.log("test",arrItem[3]);

                if(!localStorage.getItem("nonMembercartProduct")){
                    localStorage.setItem("nonMembercartProduct", `${arrItem[0]} ${arrItem[1]} ${arrItem[2]} ${arrItem[3]}`);
                }else{
                    localStorage.setItem("nonMembercartProduct", `${localStorage.getItem("nonMembercartProduct")}/${arrItem[0]} ${arrItem[1]} ${arrItem[2]} ${arrItem[3]}`);
                }   
            })
        }

        //console.log(localStorage.getItem("nonMembercartProduct"));
        // 삭제 다 되면 페이지 리로드해서 변경 내역 보여주기.
        location.reload();
    }
})

// 상품 생성해주는 함수
const makeCartProduct = (productName, productImg, productPrice, productNum, productItem) =>{
    
    const makeCartProductHTML = `
    <div class="cart_item" id=${productItem}>
        <div class="item_name" >
            <input type="checkbox" class="cbx_cart_item" />
            <label for="cart_item" class="prdN" >${productName}</label>
        </div>
        <div class="item_content" id="${productName}">
            <div class="left">
                <img src="http://kdt-sw-6-team10.elicecoding.com/${productImg}" alt="" />
            </div>
            <div class="right">
                <p class="item_price" id="${productPrice}">금액 : ${productPrice.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,")} 원</p>
                <p class="item_count" id="${productNum}">
                    수량 : <span class="product_num" id="pdn">${productNum}</span>
                    <span class="count_btn">
                        <button type="button" class="up_btn">▲</button>
                        <button type="button" class="down_btn">▼</button>
                    </span>
                </p>
                <p class="total_price">총 금액 : 
                    <span class="total_product_price">${(Number(productPrice) * Number(productNum)).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,")}</span>원                
                </p>
            </div>
        </div>
    </div>
`
    cartListItem.innerHTML += makeCartProductHTML;
}


