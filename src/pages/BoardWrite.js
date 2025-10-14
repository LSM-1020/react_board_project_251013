import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function BoardWrite({user}) {
  const [title, setTitle] = useState(""); //제목은 공백문자열
  const [content, setContent] = useState(""); //내용도 공백문자열
  const navigate = useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault({title,content}); //이벤트함수에서 무조건 넣어줌, 안넣으면 이벤트 실행시 페이지 새로고침됨
    //로그인한 유저만 글쓰기 허용
    if(!user) {//참이면 로그인하지 않은경우
      alert("로그인 후 사용가능합니다")
      return;
    }
    try {
      await api.post("/api/board",{title,content});
      alert("글작성 완료")
      navigate("/board")
    } catch(err) {
      console.error(err);
      alert("글쓰기 실패")
    }
  }


  return (
    <div className="write-container">
      <h2>글쓰기</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="제목" value={title} 
        onChange={(e)=>setTitle(e.target.value)}/>
        <textarea placeholder="내용" value={content} 
        onChange={(e)=>setContent(e.target.value)}/>
        <div className="button-group">
          <button type="submit">등록</button>
          <button type="button" onClick={()=>navigate("/board")}>취소</button> {/*취소버튼()에 navi넣어라, 눌리면 navigate호출되는데 /board로 */}
        </div>
      </form>
    </div>
  );
}

export default BoardWrite;
