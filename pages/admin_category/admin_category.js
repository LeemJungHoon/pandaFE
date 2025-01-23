// --------------------------------------페이지 로드 시 카테고리 목록 가져오기--------------------------------------------------
window.addEventListener("load", async () => {
  const mainMenuContainer = document.querySelector(".main_menu_container");
  const subCategory = document.querySelector(".sub_menu_container");
  subCategoryAddBtnDisplay();

  //클릭한 카테고리에 active 클래스 부여하기위해 만들어둠
  let activeMainCategory = null;

  //GET 요청으로 카테고리의 데이터를 받아옴
  try {
    const response = await fetch("https://panda-be.vercel.app/api/categories");

    const data = await response.json();
    const categories = data.data;
    subCategoryAddBtnDisplay();
    //받아온 데이터들을 각각 루프로 돌려서 요소를 만들어줌
    categories.forEach((category, index) => {
      const newMainCategory = document.createElement("button");

      newMainCategory.className = "main_menu";
      newMainCategory.textContent = category.name;
      mainMenuContainer.appendChild(newMainCategory);

      if (index === 0) {
        newMainCategory.classList.add("active");
        activeMainCategory = newMainCategory;
      }

      // 클릭한 메인 카테고리의 서브 카테고리 있는지 확인하고 있으면 옆에 보이게하는
      newMainCategory.addEventListener("click", async () => {
        subCategoryAddBtnDisplay();
        deleteCurrentInput();
        //클릭한 메인 카테고리에 active를 부여하는데 이미 부여된게 있으면 없애주고 없으면 active 클래스 부여
        if (activeMainCategory) {
          activeMainCategory.classList.remove("active");
        }
        newMainCategory.classList.add("active");
        activeMainCategory = newMainCategory;
        try {
          const subCategoryResponse = await fetch(
            `https://panda-be.vercel.app/api/subCategories/${category.name}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!subCategoryResponse.ok) {
            throw new Error(
              `HTTP error! Status: ${subCategoryResponse.status}`
            );
          }

          const subCategoryData = await subCategoryResponse.json();
          const subCategories = subCategoryData.data;

          // 서브 카테고리 표시
          updateSubMenu(subCategory, subCategories);
        } catch (error) {
          console.error("Error:", error);
        }
      });
    });
  } catch (error) {
    console.error("카테고리 조회 중 오류 발생", error);
  }
  // -----------------------------------메인 카테고리 추가 로직---------------------------------------------------
  const addButton = document.querySelector(".addMainCategoryBtn");

  addButton.addEventListener("click", () => {
    makeCancelBtn();
    const mainMenuContainer = document.querySelector(".main_menu_container");
    const newMainCategory = document.createElement("button");
    const input = document.createElement("input");

    input.type = "text";

    addButton.style.display = "none";

    // input 요소에서 엔터 키를 누를 때 main_menu 버튼 업데이트
    input.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        if (input.value.trim() !== "") {
          newMainCategory.className = "main_menu";
          newMainCategory.textContent = input.value;
          input.remove();
          addButton.style.display = "flex";

          // 카테고리 이름을 서버로 보내기
          try {
            const response = await fetch(
              "https://panda-be.vercel.app/api/categories",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: input.value,
                }),
              }
            );

            if (response.ok) {
              console.log("카테고리 추가 성공");
            } else {
              console.error("카테고리 추가 실패");
            }
          } catch (error) {
            console.error("카테고리 추가 중 오류 발생", error);
          }
        } else {
          input.remove();
          addButton.style.display = "flex";
        }
        location.reload();
      }
    });

    mainMenuContainer.appendChild(input);
    mainMenuContainer.appendChild(newMainCategory);
    input.focus();
  });

  //------------------------------------------------서브 카테고리 추가 로직------------------------------------------------------------------
  const addSubBtn = document.querySelector(".addSubCategoryBtn");

  addSubBtn.addEventListener("click", () => {
    makeCancelBtn();
    deleteCurrentInput();
    subCategoryAddBtnDisplay();
    const subMenuContainer = document.querySelector(".sub_menu_container");
    const newSubCategory = document.createElement("button");
    const input = document.createElement("input");

    input.type = "text";
    addSubBtn.style.display = "none";

    // input 요소에서 엔터 키를 누를 때 main_menu 버튼 업데이트
    input.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        if (input.value.trim() !== "") {
          let currentMainCategoryName =
            document.querySelector(".active").innerText;
          newSubCategory.className = "sub_menu";
          newSubCategory.textContent = input.value;
          input.remove();
          addSubBtn.style.display = "flex";

          // 카테고리 이름을 서버로 보내기
          try {
            const response = await fetch(
              "https://panda-be.vercel.app/api/subcategories",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  category: currentMainCategoryName,
                  name: input.value,
                }),
              }
            );

            if (response.ok) {
              console.log("서브 카테고리 추가 성공");
            } else {
              console.error("서브 카테고리 추가 실패");
            }
          } catch (error) {
            console.error("서브 카테고리 추가 중 오류 발생", error);
          }
        } else {
          input.remove();
          addSubBtn.style.display = "flex";
        }
        location.reload();
      }
    });

    subMenuContainer.appendChild(newSubCategory);
    newSubCategory.appendChild(input);
    input.focus();
  });

  //------------------------------------------------수정 로직-------------------------------------------------------------------------------
  //수정 버튼 이벤트 추가
  const modifyButton = document.querySelector(".modify_button");

  modifyButton.addEventListener("click", async () => {
    makeCancelBtn();
    deleteCurrentInput();
    subCategoryAddBtnDisplay();
    const activeCategory = document.querySelector(".active");
    const activeSubCategory = document.querySelector(".subActive");
    const input = document.createElement("input");
    input.type = "text";
    addSubBtn.style.display = "none";

    if (activeSubCategory) {
      //현재 active된 카테고리의 text를 input에 넣어둔다.
      input.value = activeSubCategory.textContent;
      activeSubCategory.appendChild(input);
      const subContainer = document.querySelector(".sub_menu_container");
      subContainer.insertBefore(input, activeSubCategory.nextSibling);

      try {
        // 서버로 GET 요청 보내서 name과 일치하는 카테고리의 _id 가져오기
        const response = await fetch(
          "https://panda-be.vercel.app/api/subcategories"
        );
        if (response.ok) {
          const data = await response.json();
          const subcategories = data.data;
          const subCategoryName = subcategories.find(
            (subCategory) => subCategory.name === activeSubCategory.textContent
          );
          console.log(subCategoryName._id);

          // 엔터 키 이벤트 리스너
          input.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
              // 값이 변경된 경우만 요청을 보냄
              if (input.value.trim() !== activeSubCategory.textContent) {
                try {
                  // 서버로 수정 요청 보내기
                  const patchResponse = await fetch(
                    `https://panda-be.vercel.app/api/subcategories/${subCategoryName._id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: input.value,
                      }),
                    }
                  );

                  if (patchResponse.ok) {
                    console.log("서브 카테고리 수정 성공");
                  } else {
                    console.error("서브 카테고리 수정 실패");
                  }
                  location.reload();
                } catch (error) {
                  console.error("서브 카테고리 수정 중 오류 발생", error);
                }
              } else {
                input.remove();
              }
            }
          });
        }
      } catch (error) {
        console.error("서브 카테고리 정보를 가져오는 중 오류 발생", error);
      }
    } else {
      //현재 active된 카테고리의 text를 input에 넣어둔다.
      const mainContainer = document.querySelector(".main_menu_container");
      input.value = activeCategory.textContent;
      mainContainer.insertBefore(input, activeCategory.nextSibling);

      try {
        // 서버로 GET 요청 보내서 name과 일치하는 카테고리의 _id 가져오기
        const response = await fetch(
          "https://panda-be.vercel.app/api/categories"
        );
        if (response.ok) {
          const data = await response.json();
          const categories = data.data;
          const categoryName = categories.find(
            (category) => category.name === activeCategory.textContent
          );
          console.log(categoryName._id);

          // 엔터 키 이벤트 리스너
          input.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
              // 값이 변경된 경우만 요청을 보냄
              if (input.value.trim() !== activeCategory.textContent) {
                try {
                  // 서버로 수정 요청 보내기
                  const patchResponse = await fetch(
                    `https://panda-be.vercel.app/api/categories/${categoryName._id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: input.value,
                      }),
                    }
                  );

                  if (patchResponse.ok) {
                    console.log("카테고리 수정 성공");
                  } else {
                    console.error("카테고리 수정 실패");
                  }
                  location.reload();
                } catch (error) {
                  console.error("카테고리 수정 중 오류 발생", error);
                }
              } else {
                input.remove();
              }
            }
          });
        }
      } catch (error) {
        console.error("카테고리 정보를 가져오는 중 오류 발생", error);
      }
    }
    input.focus();
  });

  //------------------------------------------------삭제 로직-------------------------------------------------------------------------------
  //삭제 버튼 이벤트 추가
  const deleteButton = document.querySelector(".delete_button");

  deleteButton.addEventListener("click", async () => {
    deleteCurrentInput();
    subCategoryAddBtnDisplay();
    const activeCategory = document.querySelector(".active");
    const activeSubCategory = document.querySelector(".subActive");

    if (activeSubCategory) {
      const deleteConfirmed = window.confirm(
        `${activeSubCategory.innerText}을(를) 삭제하시겠습니까?`
      );
      if (deleteConfirmed) {
        try {
          // 서버로 GET 요청 보내서 name과 일치하는 카테고리의 _id 가져오기
          const response = await fetch(
            "https://panda-be.vercel.app/api/subcategories"
          );
          if (response.ok) {
            const data = await response.json();
            const subcategories = data.data;
            const subCategoryName = subcategories.find(
              (subCategory) =>
                subCategory.name === activeSubCategory.textContent
            );
            console.log(subCategoryName._id);

            // 서버로 삭제 요청 보내기
            const patchResponse = await fetch(
              `https://panda-be.vercel.app/api/subcategories/${subCategoryName._id}`,
              {
                method: "DELETE",
              }
            );

            if (patchResponse.ok) {
              console.log("서브 카테고리 삭제 성공");
            } else {
              console.error("서브 카테고리 삭제 실패");
            }
            location.reload();
          }
        } catch (error) {
          console.error("서브 카테고리 정보를 가져오는 중 오류 발생", error);
        }
      }
    } else {
      const deleteConfirmed = window.confirm(
        `${activeCategory.innerText}을(를) 삭제하시겠습니까?`
      );
      if (deleteConfirmed) {
        try {
          // 서버로 GET 요청 보내서 name과 일치하는 카테고리의 _id 가져오기
          const response = await fetch(
            "https://panda-be.vercel.app/api/categories"
          );
          if (response.ok) {
            const data = await response.json();
            const categories = data.data;
            const categoryName = categories.find(
              (category) => category.name === activeCategory.textContent
            );
            console.log(categoryName._id);

            // 서버로 삭제 요청 보내기
            const patchResponse = await fetch(
              `https://panda-be.vercel.app/api/categories/${categoryName._id}`,
              {
                method: "DELETE",
              }
            );

            if (patchResponse.ok) {
              console.log("카테고리 삭제 성공");
            } else {
              console.error("카테고리 삭제 실패");
            }
            location.reload();
          }
        } catch (error) {
          console.error("카테고리 정보를 가져오는 중 오류 발생", error);
        }
      }
    }
  });
});

// 서브 카테고리 표시하는 함수
function updateSubMenu(subCategory, subCategories) {
  // 기존 서브 카테고리 제거
  const existingSubMenus = subCategory.querySelectorAll(".sub_menu");

  existingSubMenus.forEach((subMenu) => {
    subCategory.removeChild(subMenu);
  });

  // 새로운 서브 카테고리 생성
  subCategories.forEach((subcategory) => {
    const subMenuButton = document.createElement("button");

    subMenuButton.className = "sub_menu";
    subMenuButton.innerText = subcategory.name;
    subCategory.appendChild(subMenuButton);

    //서브 카테고리 active 클래스 추가
    subMenuButton.addEventListener("click", () => {
      let activeSubCategory = document.querySelector(".subActive");
      if (activeSubCategory) {
        activeSubCategory.classList.remove("subActive");
      }
      subMenuButton.classList.add("subActive");
      activeSubCategory = subMenuButton;
    });
  });
}

//서브 카테고리 버튼 display 설정
function subCategoryAddBtnDisplay() {
  const subCategoryAddBtn = document.querySelector(".addSubCategoryBtn");
  let activatedBtn = document.querySelector(".active");
  if (!activatedBtn) {
    subCategoryAddBtn.style.display = "none";
  } else {
    subCategoryAddBtn.style.display = "flex";
  }
}

//input있으면 input 삭제하는 로직
function deleteCurrentInput() {
  const currentInput = document.querySelector("input");
  if (currentInput) {
    currentInput.remove();
  }
}

//취소 버튼 로직
function makeCancelBtn() {
  const cancelBtn = document.createElement("button"); // 추가: 취소 버튼
  cancelBtn.classList.add("cancel_button");
  cancelBtn.innerText = "취소";
  const editCategory = document.querySelector(
    ".category_edit_button_container"
  );

  editCategory.insertBefore(cancelBtn, null);

  cancelBtn.addEventListener("click", () => {
    const input = document.querySelector("input");
    const addButton = document.querySelector(".addMainCategoryBtn");
    const addSubBtn = document.querySelector(".addSubCategoryBtn");
    input.remove();
    cancelBtn.remove();
    addButton.style.display = "flex";
    addSubBtn.style.display = "flex";
  });
}
