import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardDetail.css";

function BoardDetail({user}) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null); //해당 글 id로 요청한 글 객체
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false); //수정화면 출력 여부
  const {id} = useParams(); //app.js의 board/:id id파라미터 받아오기
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

 //특정 글 id로 글 1개 요청하기
  const loadPost = async()=>{ 
    try {
      setLoading(true);
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data); //특정글 id객체를 등록
      setTitle(res.data.title); //원본글 제목 불러오기
      setContent(res.data.content); //원본글 내용 불러오기
    } catch(err) {
      console.error(err);
      setError("존재하지 않는 글입니다")
      
    } finally {
      setLoading(false);
    }
  };

 //글 삭제
const handleDelete = async() => {
  if(!window.confirm("정말 삭제하시겠습니까?")) { //확인누르면 true, 취소누르면 false
    return;
  }
    try{
      const res = await api.delete(`/api/board/${id}`); 
      alert("글 삭제 성공")
      navigate("/board")
    } catch(err){
       console.error(err);
       if(err.response.status == 403) {
          alert("삭제 권한이 없습니다")
       } else {
        alert("삭제 실패")
       }
       }}

  // 글 수정
  const handleUpdate = async()=>{
    if(!window.confirm("정말 수정하시겠습니까?")) { //확인누르면 true, 취소누르면 false
    return;
  }
    try {
      const res = await api.put(`/api/board/${id}`,{title, content});
      alert("게시글이 수정되었습니다")
      setPost(res.data)//수정된 글로 post값 변경
      setEditing(false); //상세보기 화면으로 전환
    } catch(err){
       console.error(err);
       if(err.response.status == 403) {
          alert("수정 권한이 없습니다")
       } else {
        alert("수정 실패")
       }
       }};


  useEffect(()=>{
    loadPost();
  },[id]);

  if(loading) return <p>게시글 로딩중...</p>;
  if(error) return <p style={{color:"red"}}>{error}</p>
  if(!post) return <p style={{color:"red"}}>해당게시글이 존재하지 않습니다</p>
  //로그인 상태이면서 로그인한 유저와 글을쓴 유저가 같을때 참

  const isAuthor = user && user === post.author.username; 

  return (
    <div className="detail-container">
      {editing ? (   //참이면 앞에꺼, 거짓이면 뒤에꺼
        <div className="edit-form">
          <h2>글 수정하기</h2>
          <input type="text" value={title}
          onChange={(e)=>setTitle(e.target.value)} />
          <textarea value={content} 
          onChange={(e)=>setContent(e.target.value)} />
          <div className="button-group">
            <button className="edit-button" onClick={()=>handleUpdate(false)} >저장</button>
            <button className="delete-button" onClick={()=>setEditing(false)}>취소</button>
          </div>
        </div>
      ):(
        <>
        <h2>{post.title}</h2>
        <p className="author">작성자 : {post.author.username}</p>
        <div className="content">{post.content}</div>

        <div className="button-group">
            <button className="list-button" onClick={()=>navigate("/board")}>글목록</button>
            {/* 로그인한 유저 본인이 쓴 글만 삭제 수정 가능 */}
            {isAuthor && (
              <>   
                <button className="edit-button" onClick={()=>setEditing(true)}>수정</button>  {/*수정버튼 누르면 setditing에 true가 담겨서호출 */}
                <button className="delete-button" onClick={handleDelete}>삭제</button>
              </>
              )}    
        </div>
        </>
      )} 
    </div>
  );
}

export default BoardDetail;
