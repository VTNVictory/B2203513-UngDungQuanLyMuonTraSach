<template>
  <div>
    <BookList />
  </div>
</template>

<script>
import BookList from "@/components/adminBookList.vue";

export default {
  name: "AdminBooks",
  components: {
    BookList,
  },
};
</script>
