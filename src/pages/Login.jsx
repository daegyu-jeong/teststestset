import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "react-query";

import UseInput from "../hooks/UseInput";
import { api } from "../shared/apis/Apis";
import { setCookie } from "../shared/Cookie";

const Login = () => {
  const queryClient = useQueryClient(); // app에 있는데 각 페이지마다 필요한가? 26번이 있을 땐 필요한 건가?
  const navigate = useNavigate();

  const [email, setEmail] = UseInput(null);
  const [password, setPassword] = UseInput(null);

  const onLogin = async () => {
    const data = await api.post("/user/login", {
      email,
      password,
    });
    return data;
  };

  const { mutate: onsubmit } = useMutation(onLogin, {
    onSuccess: (data) => {
      queryClient.invalidateQueries();

      const AccessToken = data.data.token;
      const Accessnickname = data.data.nickname;

      setCookie("token", AccessToken, 10);
      setCookie("nickname", Accessnickname, 10);
      window.alert("로그인성공!!!!");
      navigate("/");
    },
    onError: () => {
      window.alert("엥?아이디, 비번 확인해라잉!");
      return;
    },
  });

  if (Login.isLoading) {
    return null;
  }

  return (
    <>
      <div>
        <input
          type="email"
          label="이메일"
          placeholder="🔑  이메일 형식으로 작성"
          value={email || ""}
          onChange={setEmail}
        />
      </div>
      <div>
        <input
          type="password"
          label="비밀번호"
          value={password || ""}
          placeholder="🔒    영어, 숫자, 특수문자(최소 4자)"
          onChange={setPassword}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onsubmit();
            }
          }}
        />
      </div>
      <button onClick={onsubmit}>로그인</button>
      <Link to="/signup">
        <button>회원가입</button>
      </Link>
    </>
  );
};

export default Login;
