import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";
/* Editor */
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
/* Toast ColorSyntax 플러그인 */
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
// import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { useMutation, useQuery } from "react-query";
import { apiToken } from "../../shared/apis/Apis";
import styled from "styled-components";
import { getCookie, setCookie } from "../../shared/Cookie";
// import Meiyou2 from "../../public/images/Meiyou.";
/*해야 할 것*/
//1. 여기에 임시글 저장 버튼도 필요함.
//2. 해시태그 post data 안에 key 값 찾아서 넣기
//3. 상세페이지 post로 보낼 때 배열로 보내드릴 것 ( 배열로가 정확히 무슨 뜻일까?)

const ModifyEdit = (props) => {
  const { postId, userId } = props;
  // console.log(postId);
  // console.log(props.postId);
  //## 글 작성 데이터 관련 state
  const [markdown_data, setData] = useState("");
  const [head_data, setHead] = useState(null);
  const [thumbImage, setImage] = useState(null);
  const [tag, setTag] = useState("");
  const [tagList, setTagList] = useState([]);
  const [openModal, setOpenModal] = useState(false); // # 모달
  const [previewImg, setPreviewImg] = useState(thumbImage);

  const hostId = getCookie("userId");
  const editorRef = useRef();
  const navigate = useNavigate();
  // const BeforeTags = detail_data?.Tags;
  // console.log(detail_data?.Tags);
  //## 이미지 미리보기
  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();

    reader.readAsDataURL(fileBlob);
    // console.log(fileBlob); 이 매겨변수는 아래 사진의 onChange 해당
    return new Promise((resolve) => {
      reader.onload = () => {
        setPreviewImg(reader.result);
        resolve();
      };
    });
  };

  //## modal 이벤트
  const onModal = () => {
    setOpenModal(!openModal);
  };

  //## ModifyEdit의 데이터(text->markdown) 이벤트
  const onchange = (e) => {
    const write_data = editorRef.current?.getInstance().getMarkdown();
    // console.log("25", abc);
    setData(write_data); // 이는 위의 head_data 값
    // console.log("27", markdown_data);
  };

  //## 붙혀넣기 금지 이벤트 (ctnrl 키 금지)
  const onKeyDown = (e) => {
    window.onkeydown = (e) => {
      // console.log(e.key);
      if (e.key === "Control") {
        alert("붙혀넣기 금지");
      }
    };
  };
  //## 'Enter'시 태그 추가 이벤트
  const onKeyUp = (e) => {
    if (
      e.target.value.length !== 0 &&
      e.keyCode === 13 &&
      tagList.length < 10
    ) {
      // 새 태그 배열(array) 안에 넣기 < 그래야 map으로 돌릴 수 있음 >
      setTagList([...tagList, tag]);
      setTag(""); // input에 value는 enter 후에 input 창 글 없애기 위함
    }
  };
  //## 'Click'시 태그 삭제 이벤트
  const onClcik_tag = (e) => {
    // console.log(e.target.id);
    setTagList(
      tagList.filter((tag, index) => {
        return index !== +e.target.id; // + 대신 Number(  )해도 숫자형으로 바꿀 수 있다.
      })
    );
  };
  //## 임시저장 이벤트
  const onTemporary = () => {
    setCookie("Temporary_Content", markdown_data, 10);
  };

  const GetDetailtData = async () => {
    const response = await apiToken.get(`/api/paper/users/${userId}/${postId}`);
    // console.log("PaperDetail page", response);
    return response?.data.paper;
  };

  //1. isLoding, error 대신에 status로 한 번에 저 두가지 체크 가능
  //2. isLoding을 안 만들어주면 데이터가 안 왔을 때 처음에 (Undefined를 찍으니)보여지는 값에서 문제가 생길 수 있음
  const { data: detail_data, status } = useQuery(
    "detail_data",
    GetDetailtData
    // { staleTime: Infinity }
  );
  if (status === "loading") {
    return <>loading...</>;
  }

  if (status === "error") {
    return alert("error");
  }
  if (hostId !== userId) {
    navigate("/");
    alert("블로거 주인만 수정할 수 있습니다.");
  }

  // console.log("Modify", detail_data.Tags);

  //   //## useMutation write 데이터 post의 함수
  //   const postfecher = async () => {
  //     let formData = new FormData();
  //     formData.append("image", thumbImage);
  //     // console.log(formData.get("image"));
  //     const image_data = await apiToken.post("/api/paper/image", formData);
  //     console.log(image_data?.data.imageUrl);

  //     const response = await apiToken.post("/api/paper", {
  //       contents: markdown_data,
  //       title: head_data,
  //       thumbnail: image_data?.data.imageUrl,
  //       tags: tagList,
  //     });
  //     console.log(response?.data);
  //     return response?.data.paper;
  //   };
  //   //## useMutation write 데이터 post
  //   const { data: res, mutate: onPost } = useMutation(postfecher, {
  //     onSuccess: (res) => {
  //       console.log(res?.userId);

  //       navigate(`/paper/${res?.userId}`);
  //       alert("post 성공!");
  //     },
  //     // onError: (data === null) => {
  //     //   alert("post 실패!");
  //     // },
  //   });

  return (
    <>
      {openModal ? (
        <div
          style={{
            box_sizing: "border-box",
            border: "solid #5B6DCD 10px",
            height: "800px",
          }}
        >
          <img src={previewImg !== null ? previewImg : null} alt="썸네일" />
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
              encodeFileToBase64(e.target.files[0]);
            }}
          ></input>
          <button
            onClick={() => {
              setOpenModal(!openModal);
            }}
          >
            x
          </button>
          {/* <button onClick={onPost}>click</button> */}
        </div>
      ) : (
        <div
          //## 마우스 오른쪽 클릭 이벤트
          onContextMenu={(e) => {
            e.preventDefault();
            alert("붙혀넣기 금지");
          }}
        >
          {/* 아래 글 제목 */}
          <textarea
            placeholder={detail_data.title}
            onChange={(e) => {
              setHead(e.target.value);
            }}
          ></textarea>
          {/* 아래 해시태그 */}
          <input
            name="HashTagInput"
            type="text"
            value={tag || ""}
            placeholder="Enter를 누르시면 태그가 추가됩니다!"
            maxLength="10"
            onKeyUp={onKeyUp}
            onChange={(e) => {
              setTag(e.target.value);
            }}
          ></input>
          <HashWrapOuter>
            {/* 바로 아래 해시태그 get 기존 것들 넣을 계획이었으나 실패 */}
            {/* {detail_data.Tags.length > 0
              ? detail_data.Tags.map((value, idx) => {
                  return (
                    <div key={value.length} onClick={onClcik_tag}>
                      <p id={idx}>{value}</p>
                    </div>
                  );
                })
              : null} */}
            {tagList.length > 0 ? (
              tagList.map((value, index) => {
                return (
                  <div key={value + index} onClick={onClcik_tag}>
                    <p id={index}>{value}</p>
                  </div>
                );
              })
            ) : (
              <div>태그를 추가하실 수 있습니다.</div>
            )}
          </HashWrapOuter>
          <Editor
            previewStyle="vertical"
            placeholder="Paper에 자신의 생각을 적어주세요..."
            height="900px"
            minHeight="600px"
            initialEditType="markdown"
            initialValue={detail_data.contents}
            ref={editorRef}
            onChange={onchange}
            useCommandShortcut={false}
            onKeydown={onKeyDown}
            usageStatistics={false}
            hooks={{
              addImageBlobHook: async (blob, callback) => {
                // console.log(blob.name.split(".")[0]); // File {name: '.png', ... }

                // 1. 첨부된 이미지 파일을 서버로 전송후, 이미지 경로 url을 받아온다.
                let formData = new FormData();
                formData.append("image", blob);

                const response = await apiToken.post(
                  "/api/paper/image",
                  formData
                );
                console.log(response?.data.imageUrl);
                // console.log(process.env.REACT_APP_S3_URL);

                // 2. 첨부된 이미지를 화면에 표시(경로는 임의로 넣었다.)
                callback(
                  process.env.REACT_APP_S3_URL + `/${response?.data.imageUrl}`,
                  `${blob.name.split(".")[0]}`
                );
              },
            }}

            // plugins={[
            //   [
            //     colorSyntax,
            //     // 기본 색상 preset 적용
            //     {
            //       preset: ["#1F2E3D", "#4c5864", "#ED7675"],
            //     },
            //   ],
            // ]} // colorSyntax 플러그인 적용
          />
          <button onClick={onModal}>Click!</button>
          <button
            onClick={() => {
              navigate(`/paper/${props.userId}`);
            }}
          >
            나가기!
          </button>
          <button onClick={onTemporary}>임시저장!</button>
        </div>
      )}
    </>
  );
};

const HashWrapOuter = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

// const HashInput = styled.input`
//   width: auto;
//   margin: 10px;
//   display: inline-flex;
//   outline: none;
//   cursor: text;
//   line-height: 2rem;
//   margin-bottom: 0.75rem;
//   min-width: 8rem;
//   border: none;
// `;

export default ModifyEdit;
