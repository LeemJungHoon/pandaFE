const name_input = document.getElementsByClassName("name_input")[0];
const phone_number_input_startnum = document.getElementsByClassName(
  "phone_number_input_startnum"
)[0];
const phone_number_input_lastnum = document.getElementsByClassName(
  "phone_number_input_lastnum"
)[0];
const address_input = document.getElementsByClassName("address_input")[0];
const email_input_first =
  document.getElementsByClassName("email_input_first")[0];
const email_input_second =
  document.getElementsByClassName("email_input_second")[0];
const email_input_third =
  document.getElementsByClassName("email_input_third")[0];
const password_input = document.getElementsByClassName("password_input")[0];
const password_check_input = document.getElementsByClassName(
  "password_check_input"
)[0];

const join_button = document.getElementsByClassName("join_button")[0];

const cbx_all_agree = document.getElementsByClassName("cbx_all_agree")[0];
const cbx_personal_information_agree = document.getElementsByClassName(
  "cbx_personal_information_agree"
)[0];
const cbx_third_party_agree = document.getElementsByClassName(
  "cbx_third_party_agree"
)[0];

// 모두동의 체크박스 클릭 시 하위 필수 문항 자동으로 선택
cbx_all_agree.addEventListener("click", () => {
  if (cbx_all_agree.checked) {
    cbx_personal_information_agree.checked = true;
    cbx_third_party_agree.checked = true;
  } else {
    cbx_personal_information_agree.checked = false;
    cbx_third_party_agree.checked = false;
  }
});

// 이름,전화번호,주소,이메일,비밀번호,비밀번호 확인 중 하나라도 없을 시 해당 값 문자열로 rtn
// 모두 참일 시 (올바른 데이터일시) true 반환
const inputConfirm = () => {
  let rtnMsg = "";
  // 핸드폰 4자리인지, 숫자형태인지 확인하기위한 정규식
  const phoneNumberRegex = /^(?=.*[0-9]).{4}$/;
  // 비밀번호 데이터 비교를 위한 정규식
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
  // 이메일내 영어 대소문자만 작성했는지 확인하는 정규식
  const emailRegex = /^(?=.*[a-zA-Z0-9]).{1,15}$/;
  try {
    // 회원가입 UI 순서대로 확인하게끔 로직 작성.
    //이름 확인
    name_input.value ? 0 : (rtnMsg += " 이름 ");
    // 전화번호 확인
    phoneNumberRegex.test(phone_number_input_startnum.value) &&
    phoneNumberRegex.test(phone_number_input_lastnum.value)
      ? 0
      : (rtnMsg += " 전화번호 ");
    // 주소 확인
    address_input.value ? 0 : (rtnMsg += " 주소 ");
    // 이메일 확인
    emailRegex.test(email_input_first.value) &&
    emailRegex.test(email_input_second.value) &&
    emailRegex.test(email_input_third.value)
      ? 0
      : (rtnMsg += " 이메일 ");
    // 비밀번호 확인
    passwordRegex.test(password_input.value) ? 0 : (rtnMsg += " 비밀번호 ");
    // 비밀번호확인을 확인
    password_check_input.value === password_input.value
      ? 0
      : (rtnMsg += " 비밀번호확인 ");
    // 모두 동의 체크 확인
    cbx_personal_information_agree.checked && cbx_third_party_agree.checked
      ? 0
      : (rtnMsg += "필수동의");
    // 값 모두 확인 후 rtnMsg 있으면 해당 메세지 rtn 없으면 true 리턴
    return rtnMsg ? rtnMsg + "재확인이 필요합니다." : true;
  } catch (err) {
    return console.error(`inputConfirm error : ${err}`);
  }
};

// 회원가입 버튼 클릭 시
join_button.addEventListener("click", async () => {
  // inputConfirm(데이터 확인)이 true면
  if (inputConfirm() === true) {
    try {
      // 데이터 전달
      //https://panda-be.vercel.app/users/signup
      //https://jsonplaceholder.typicode.com/posts
      await fetch("https://panda-be.vercel.app/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name_input.value,
          phoneNumber: `010-${phone_number_input_startnum.value}-${phone_number_input_lastnum.value}`,
          address: address_input.value,
          email: `${email_input_first.value}@${email_input_second.value}.${email_input_third.value}`,
          password: password_input.value,
          passwordConfirm: password_check_input.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.error(`회원가입 오류: ${error.message}`);
    }

    alert("회원가입 완료");

    location.href = "/pages/login/";
  } else {
    // inputConfirm(데이터 확인)이 하나라도 문제있으면
    // 해당 문자열 alert으로 출력
    alert(inputConfirm());
  }
});
