const pageNumBtn = document.getElementsByClassName("button_page_container")[0];
const totalPageBtn = document.getElementsByClassName("button_container")[0];
const allPresentContainer = document.getElementsByClassName(
  "all_present_container"
)[0];

const searchImage = document.getElementsByClassName("search_image")[0];
const searchInput = document.getElementsByClassName("search_input")[0];

const catagoryDetailBtn = document.getElementsByClassName(
  "catagory_detail_btn"
)[0];

let catagoryDetailName = "";

// 페이지네이션을 위한 현재 페이지 기본값 =1페이지
let current_page_num = 1;

// 페이지네이션을 위한 페이지에 보여줄 상품 개수. 기본값 = 8개
const show_product_num = 8;

// 페이지 로드 될 때 시작.
window.addEventListener("DOMContentLoaded", () => {
  // 페이지 로드될 때 다른페이지에서 검색했던 serarchProduct 삭제
  // sub카테고리도 삭제
  localStorage.removeItem("searchProduct");
  localStorage.removeItem("subCatagory");

  try {
    // 페이지 로딩되면 무조건1페이지니까
    // 쿼리스트링 page=1로 불러서 1페이지에 들어갈 상품값을 불러옴.
    fetch("https://panda-be.vercel.app/api/items/category/Present/?page=1", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((dbData) => {
        //console.log(dbData.data);
        makePresentProduct(dbData.data);
        makePageNumber(dbData.endIndex);
      });
  } catch (error) {
    console.error(`페이지 로딩 오류: ${error.message}`);
  }
});

searchImage.addEventListener("click", () => {
  // 처음에 클릭하면 이전에 검색했던 데이터 초기화
  // 해당 값으로 버튼 눌렀을 때 검색한 것의 데이터가 2페이지인지 그냥 총 페이지에서 2페이지인지 확인
  //  ex) 빅 으로 검색한 데이터가 2페이지 이상 됐을 때 빅으로 검색한 데이터의 2페이지인지
  //  ex) 아니면 Present에 있는 총 물품의 2페이지인지를 확인하기 위해 사용
  localStorage.removeItem("searchProduct");
  // 위의 이유에 따라서 검색 데이터인지 총 물품인지 구분해야하므로 페이지 버튼도 초기화 해야함
  pageNumBtn.innerHTML = "";
  // 이후에 스토리지에 검색 데이터가 있다고 담고
  localStorage.setItem("searchProduct", searchInput.value);
  try {
    // 검색한 데이터 전달
    fetch(
      `https://panda-be.vercel.app/api/items/search/?name=${searchInput.value}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((dbData) => {
        makePresentProduct(dbData.data);
        makePageNumber(dbData.endIndex);
      });
  } catch (error) {
    console.error(`검색 오류 : ${error.message}`);
  }
});

// 페이지 버튼 뭐 클릭했는지 알려주는 함수
totalPageBtn.addEventListener("click", (e) => {
  try {
    // 현재 페이지가 몇 페이지인지?
    current_page_num = Number(e.target.innerHTML);
    let pageUrl = `https://panda-be.vercel.app/api/items/category/Present/?page=${current_page_num}`;
    const searchProduct = localStorage.getItem("searchProduct");
    const subCatagory = localStorage.getItem("subCatagory");
    const searchPageUrl = `https://panda-be.vercel.app/api/items/search/?name=${searchProduct}&page=${current_page_num}`;
    const subPageUrl = `https://panda-be.vercel.app/api/items/subCategory/${subCatagory}/?page=${current_page_num}`;
    // 검색한 데이터가 있으면 searchPageUrl에 있는 데이터를, 그렇지 않으면 일반 데이터를 호출
    // if문 순서 중요함 일부러 이렇게 배치..
    if (subCatagory) {
      pageUrl = subPageUrl;
    }

    if (searchProduct) {
      pageUrl = searchPageUrl;
    }

    // 데이터 전달
    fetch(pageUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((dbData) => {
        makePresentProduct(dbData.data);
      });
  } catch (error) {
    console.error(`totalPageBtn 오류: ${error.message}`);
  }
});

// 세부 카테고리 클릭 시
catagoryDetailBtn.addEventListener("click", (e) => {
  catagoryDetailName = e.target.innerHTML;

  pageNumBtn.innerHTML = "";

  localStorage.removeItem("subCatagory");

  localStorage.setItem("subCatagory", catagoryDetailName);

  fetch(
    `https://panda-be.vercel.app/api/items/subCategory/${catagoryDetailName}/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((dbData) => {
      makePresentProduct(dbData.data);
      makePageNumber(dbData.endIndex);
    });
});

// 페이지 넘버 버튼 생성하는 함수
const makePageNumber = (endIndex) => {
  for (let i = 1; i <= endIndex; i++) {
    pageNumBtn.innerHTML += `<button class="number_btn"> ${i} </button>`;
  }
};

const makePresentProduct = (data) => {
  try {
    // 페이지네이션할때 이전에 있었던 이미지는 초기화시켜주고
    allPresentContainer.innerHTML = "";
    // data로 받은 상품의 개수만큼 반복문 돌면서
    // (최대 8개로 보여줄것이므로 기본 8개임)
    for (
      // 프론트에서는 무조건 포문 1부터 시작함
      // 왜냐면 백단에서 page 넘버에 따라서 데이터를 알아서 걸러서 주기때문에
      // 데이터를 내가 갖고있는게 아니라 주는 데이터의 순서대로 보여주기만 하면 됨.
      // 원래는 이런 식
      //let i = show_product_num * (current_page_num - 1) + 1;
      let i = 1;
      i <= show_product_num * (current_page_num - 1) + 8 && i <= data.length;
      i++
    ) {
      // 이제 html을 innerhtml로 넣기위한 작업
      const makePresentProductEl = `
      <a href="/pages/flower_market_detail/${data[i - 1].item_id}">
        <div class="present_container">
          <div class="image"><img src="https://panda-be.vercel.app/${
            data[i - 1].imageUrl
          }" /></div>
          <span class="present_name">${data[i - 1].name}</span>
          <span class="present_price">${data[i - 1].price}</span>
        </div>
      </a>
    `;
      allPresentContainer.innerHTML += makePresentProductEl;
    }
  } catch (err) {
    console.log("makePresentProduct 에러 :", err);
  }
};
