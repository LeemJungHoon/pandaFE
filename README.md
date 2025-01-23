# panda_flower FE

판다꽃 프론트엔드.

꽃 판매 웹사이트 관련 기능을 구현하기 위해 만들어졌습니다.(FE)

## 폴더 구조 DDD(Domain-Driven Design)

폴더 구조는 도메인 계층구조를 따릅니다.

## Git branch strategy

깃 브랜치 전략은 3계층 전략을 사용합니다.

master - develop - feature
- ex) panda_flower - main - 각 기능들 구현
- 각 기능들 구현하고 상위 페이지로 병합하는식으로 진행되겠습니다.

## CSS Selection

Class를 사용합니다.
변수명은 스네이크(언더바_)형태를 따릅니다.

## UI 담당 (기능부분 제외)

효원
회원가입,로그인,마이페이지,
꽃시장,선물,화병
관리자페이지 - 상품관리,관리자페이지 - 카테고리 관리

수환
메인,
장바구니, 주문확인(회원), 주문확인(비회원), 주문내역, 관리자페이지 - 주문관리
관리자페이지 - 전체 사용자 주문내역
관리자 페이지 - 전체 사용자 주문 내역 게시판


정훈
꽃시장 구매화면, 관리자 페이지-상품 상세 정보 수정, 관리자페이지 - 상품추가
주문확인-주문완료, 에러페이지, 등록된 상품 없음, 회원가입 완료페이지
주문내역 - 배송지수정