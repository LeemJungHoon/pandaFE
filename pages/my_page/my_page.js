// 마이페이지
const accessToken = localStorage.getItem('login-token');
console.log(accessToken);
//회원 아이디 나타내는 부분
window.addEventListener('DOMContentLoaded', () => {
    fetch('http://kdt-sw-6-team10.elicecoding.com/api/users/my', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            const idbox = document.getElementById('myPageBox');
            if (data) {
                idbox.innerHTML = JSON.stringify(data.email);
                // idbox.innerHTML = '아이디 잘 불러와짐';
            } else {
                console.log('아이디 안불러와짐~');
            }
        });
});

//비밀번호 수정 및 주소 수정
const passWord = document.getElementsByClassName('edit_password_input')[0];
const passWordConfirm = document.getElementsByClassName('edit_password_check_input')[0];
const adressInput = document.getElementsByClassName('adress_input')[0];
const saveBtn = document.getElementsByClassName('save_button')[0];

saveBtn.addEventListener('click', () => {
    fetch('http://kdt-sw-6-team10.elicecoding.com/api/users/my', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            password: passWord.value,
            passwordConfirm: passWordConfirm.value,
            address: adressInput.value,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                alert('정보가 성공적으로 수정되었습니다.');
                console.log(data);
            } else {
                alert('정보 수정 실패!!!');
            }
        })
        .catch((err) => {
            console.log('요청실패', err);
        });
});

//계정탈퇴
const deleteBtn = document.querySelector('.delete_account_button');

deleteBtn.addEventListener('click', () => {
    const confirmDelete = confirm('정말로 회원탈퇴 하시겠습니까?');

    if (confirmDelete) {
        try {
            const res = fetch('http://kdt-sw-6-team10.elicecoding.com/api/users/my', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (res) {
                alert('회원탈퇴 성공!');
            } else {
                alert('회원탈퇴 실패 !');
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log('회원탈퇴 취소');
    }
});
