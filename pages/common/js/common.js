//메뉴 위에 로그인부분
//비회원인 경우
const menu_sub_nonmemberEl = `
<div class="menu_sub_nonmember">
  <div class="lnb">
    <ul>
      <li><a href="/pages/login/">로그인</a></li>
      <li><a href="/pages/join/">회원가입</a></li>
      <li><a href="/pages/order_detail/">주문내역</a></li>
      <li class="cart_menu"><a href="/pages/cart/"><img src="/img/cart.png" alt="" defer></a></li>
    </ul>
  </div>
</div>
`;

//메뉴 위에 로그인부분
//회원인 경우
const menu_sub_memberEl = `
<div class="menu_sub_member">
  <div class="lnb">
    <ul>
      <li><a href="/">로그아웃</a></li>
      <li><a href="/pages/my_page/">마이페이지</a></li>
      <li><a href="/pages/order_detail/">주문내역</a></li>
      <li class="cart_menu"><a href="/pages/cart/"><img src="/img/cart.png" alt="" defer></a></li>
    </ul>
  </div>
</div>
`;

//메뉴 위에 로그인부분
//관리자인 경우
const menu_sub_adminEl = `
<div class="menu_sub_admin">
  <div class="lnb">
    <ul>
      <li><a href="/">로그아웃</a></li>
      <li class="admin_menu">관리자모드</li>
      <img src="/img/panda_small.png" alt="" defer>
    </ul>
  </div>
</div>
`;

//메뉴 가운데 카테고리
//FlowerMarket, Present, Vase 부분
const menu_mainEl = `
<div class="menu_main">
    <div class="container">
        <ul>
            <li class="menu_main_flower_market"><a href="/pages/flower_market/"><span>Flower Market</span></a></li>
            <li class="menu_main_present"><a href="/pages/present/"><span>Present</span></a></li>
            <li class="menu_main_vase"><a href="/pages/vase/"><span>Vase</span></a></li>
        </ul>
    </div>
</div>
`;

//로고 사진 부분
const logoEl = `
  <a href="/">
    <div class="logo">
        <img src="/img/logo.png" alt="로고" defer>
    </div>
  </a>
`;

//페이지 최하단 copyright부분
const footerEl = `
<div class="footer">
    <p>COPYRIGHT(c) 2023 PandaFlower ALL RIGHTS RESERVED.</p>
  </div>
`;

const menu_sub_nonmember = () => {
  const element = document.getElementsByClassName("menu_sub_nonmember")[0];
  return element
    ? (element.innerHTML = menu_sub_nonmemberEl)
    : 0;
};

const menu_sub_member = () => {
  const element = document.getElementsByClassName("menu_sub_member")[0];
  return element
    ? (element.innerHTML = menu_sub_memberEl)
    : 0;
};

const menu_sub_admin = () => {
  const element = document.getElementsByClassName("menu_sub_admin")[0];
  return element
    ? (element.innerHTML = menu_sub_adminEl)
    : 0;
};

const menu_main = () => {
  const element = document.getElementsByClassName("menu_main")[0];
  return element
    ? (element.innerHTML = menu_mainEl)
    : 0;
};

const logo = () => {
  const element = document.getElementsByClassName("logo")[0];
  return element
    ? (element.innerHTML = logoEl)
    : 0;
};

const footer = () => {
  const element = document.getElementsByClassName("footer")[0];
  return element
    ? (element.innerHTML = footerEl)
    : 0;
};

const init = () => {
  menu_sub_nonmember();
  menu_sub_member();
  menu_sub_admin();
  menu_main();
  logo();
  footer();
};

init();

export { init };
