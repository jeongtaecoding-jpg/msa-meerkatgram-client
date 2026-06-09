import { defineStore } from "pinia";
import { ref } from "vue"; 
import myAxios from "../../api/myAxios";

export const usePostCreateStore = defineStore('postCreateStore', () => {
  // 1. State (상태)
  const content = ref('');
  const image = ref('');

  // 2. Actions (Getters가 아님! 상태를 바꾸거나 API를 쏘는 함수)
  const createPost = async () => {
    try {
      const token = localStorage.getItem('accessToken'); 

      const response = await myAxios.post('/api/posts/create', {
        content: content.value,
        image: image.value
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

      // 백엔드에서 정상 처리(code: "00")가 오면 true를 반환
      if (response.data.code === '00') {
        return true; 
      }
      return false;

    } catch (error) {
      // Pinia에서 직접 alert를 띄우지 않고, 에러를 컴포넌트로 던져버림 (중요!)
      throw error; 
    }
  };

  // 3. 컴포넌트에서 쓸 수 있도록 반드시 return!
  return { 
    content, 
    image, 
    createPost 
  };
});
