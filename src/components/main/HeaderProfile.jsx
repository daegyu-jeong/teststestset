import React from "react";
import "../../css/modal.css";
import styled from "styled-components";
import { deleteCookie } from "../../shared/Cookie";
import { useNavigate } from "react-router-dom";

const HeaderProfile = (props) => {
  const { open, close, header, username, nickname, login } = props;
  const navigate = useNavigate();

  const onLogout = (e) => {
    deleteCookie("token");
    //deleteCookie("profileUrl");
    deleteCookie("username");

    deleteCookie("nickname");
    deleteCookie("userId");
    close();
    login(false);
    navigate("/");
  };

  return (
    <>

      <div className={open ? "openModal modal" : "modal"}>
        {open ? (
          <section>
            <header>
              {header}
              <button className="close" onClick={close}>
                &times;
              </button>
            </header>
            <main>
              {/* <ProfileImg src={profileImg} /> */}
              <Nick style={{ fontWeight: "bolder", marginBottom: "10px" }}>
                {nickname}
              </Nick>
              <Nick>{username}</Nick>
            </main>
            <footer>
              <button
                className="close"
                onClick={onLogout}
                style={{ backgroundColor: "rgb(74,21,75)" }}
              >
                ๋ก๊ทธ์์
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    </>
  );
};
export default HeaderProfile;

// const ProfileImg = styled.img`
//   width: 300px;
//   height: 300px;
//   margin: 0 0 20px 55px;
//   border-radius: 34px;
//   align-items: center;

// `
const Nick = styled.div`
  text-align: center;
  font-size: 20px;
`;
