const emailInput = document.querySelector(".email_input");
const passwordInput = document.querySelector(".password_input");
const loginButton = document.querySelector(".login_button");

//이메일 형식 검사
function emailCheck(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (emailPattern.test(email)) {
    return true; //이메일 올바르게 입력
  } else {
    alert("이메일 형식이 올바르지 않습니다.");
    return false; // 이메일 올바르지 않게 입력
  }
}

//비밀번호 형식 검사
function passwordCheck(password) {
  // 8자 이상인지 검사
  if (password.length < 8) {
    alert("비밀번호는 8자 이상이어야 합니다.");
    return false;
  }

  // 영어(대소문자 상관 없음)가 1개 이상 포함됐는지 검사
  if (!/[a-zA-Z]/.test(password)) {
    alert("비밀번호에 영문자가 최소 1개 포함되어야 합니다.");
    return false;
  }

  // 특수문자가 1개 이상 포함됐는지 검사
  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
    alert("비밀번호에 특수문자가 최소 1개 포함되어야 합니다.");
    return false;
  }

  // 숫자가 1개 이상 포함됐는지 검사
  if (!/\d/.test(password)) {
    alert("비밀번호에 숫자가 최소 1개 포함되어야 합니다.");
    return false;
  }

  // 모든 조건을 만족하는 경우
  return true;
}

const loginfetch = () => {
  //이메일 형식검사, 비밀번호 형식검사 만족했다면
  if (emailCheck(emailInput.value) && passwordCheck(passwordInput.value)) {
    fetch("http://kdt-sw-6-team10.elicecoding.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        //reponse 뒤에 ?는 accessToken이 존재하지 않을때 undefined를 넣어주기 위함임! ? 넣어주지 않으면 accessToken이 없을 때 에러날 수 있음
        const token = response?.accessToken;
        if (token) {
          loginButton.href = "/pages/index.html/";
          localStorage.setItem("login-token", response.accessToken);
        } else {
          alert("로그인에 실패");
        }
      });
  }
};

loginButton.addEventListener("click", loginfetch);
