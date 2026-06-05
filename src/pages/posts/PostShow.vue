<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostShowStore } from '../../store/post/usePostShowStore';
import { useAuthStore } from '../../store/auth/useAuthStore';

const route = useRoute();
const router = useRouter();
const postShowStore = usePostShowStore();
const authStore = useAuthStore();

onBeforeMount(async () => {
  try {
    await postShowStore.getPost(route.params.id);
  } catch(error) {
    const msg = error?.response?.data.data ? error?.response?.data.data : "포스트 획득 실패";
    alert(msg);
    router.replace('/');
  }
});
onBeforeUnmount(postShowStore.clearPostShow);
</script>


<!-- v-if 절만 넣으면 HTML 요소가 사라지니 사라진 요소를 채우기 위해서 v-else로 빈 요소 하나를 넣어 채운다. -->
<template>
<div class="container" v-if="postShowStore.post">
  <div class="image"  :style="{backgroundImage: `url(${postShowStore.post.image})`}"></div>
  <div class="option-box">
    <div 
    class="delete-icon"
    v-if="postShowStore.post.userId === authStore.userInfo.id"
    ></div>
    <div v-else></div>  
    <div class="like-box">
      <span>1919</span>
      <div class="like-icon"></div>
    </div>
  </div>
  <p class="content">{{ postShowStore.post.content}}</p>

</div>
</template>

<style scoped>

.container {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image {
  padding-top: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.option-box {
  display: flex;
  justify-content: space-between;
}

.like-box {
  display: flex;
  padding: 0 15px;
  gap: 10px;

}

.delete-icon {
  width: 40px;
  height: 50px;
  background-image: url('/icons/trash-can.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.like-icon {
  width: 40px;
  height: 40px;
  background-image: url('/icons/heart-fill.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.content {
  white-space: pre-wrap;
}
</style>
