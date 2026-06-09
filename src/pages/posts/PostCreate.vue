<script setup>
import { useRouter } from 'vue-router';
import MyButton from '../../components/buttons/MyButton.vue';
import { usePostCreateStore } from '../../store/post/usePostCreateStore.js';
import { useFileStore } from '../../store/file/useFileStore.js'; //

const router = useRouter();
const poststore = usePostCreateStore();
const fileStore = useFileStore();

// 1. 이미지 파일이 선택됐을 때 (선착순 업로드)
// PostCreate.vue 내부의 onFileChange 함수
const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 서버에서 받아온 결과물(uploadedUrl)
  const uploadedUrl = await fileStore.postImage(file);
  
  if (uploadedUrl) {
    // 💡 만약 uploadedUrl이 객체라면, 여기서 알맹이만 쏙 빼서 저장!
    // (스토어에서 이미 res.data.data.fileUri를 반환했다면 그냥 uploadedUrl만 넣으면 돼)
    poststore.image = typeof uploadedUrl === 'string' ? uploadedUrl : uploadedUrl.data.fileUri;
  }
};

// 2. 최종 작성하기 버튼을 눌렀을 때
const writePost = async () => {
  try {
    // 글 내용과 방금 받아둔 이미지 URL이 함께 서버로 날아감!
    const isSuccess = await poststore.createPost(); 

    if (isSuccess) {
      alert('게시글이 성공적으로 작성되었습니다!');
      poststore.content = '';
      poststore.image = '';
      router.push('/posts'); 
    }
  } catch (error) {
    alert('작성 실패!'); // (에러 세부 처리는 기존 코드처럼 하면 돼)
  }
};
</script>


<template>
  <form @submit.prevent="writePost">
    <div class="container">
      <textarea v-model="poststore.content" placeholder="내용을 입력하세요"></textarea>

      <input type="file" accept="image/*" @change="onFileChange">
      
      <p v-if="poststore.image" style="color: blue;">이미지가 성공적으로 첨부되었습니다.</p>

    <MyButton
    :btn-type="'submit'"
    :color="'gray'"
    :size="'middle'"
    :content="'Write'"
   ></MyButton>

    </div>
  </form>
</template>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

textarea {
  width: 800px;
  height: 500px;
  font-size: 20px;
}
</style>
