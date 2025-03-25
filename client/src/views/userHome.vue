<template>
  <div>
    <BookOverview
      :selectedBooks="selectedBooks"
      @select-book="addBook"
      @deselect-book="removeBook"
    >
      <!-- Slot nút mượn sách -->
      <template #footer>
        <div class="btn-inner">
          <button
            class="btn-borrow"
            @click="borrowBooks"
            :disabled="selectedBooks.length === 0"
          >
            Mượn sách ({{ selectedBooks.length }})
          </button>
        </div>
      </template>
    </BookOverview>
  </div>
</template>

<script>
import axios from "axios";
import BookOverview from "@/components/userOverview.vue";
import { getUserDataFromToken } from "@/services/getUserData.service";

export default {
  components: {
    BookOverview,
  },
  data() {
    return {
      selectedBooks: [],
    };
  },
  methods: {
    addBook(book) {
      this.selectedBooks.push(book);
    },
    removeBook(book) {
      this.selectedBooks = this.selectedBooks.filter(
        (b) => b.MASACH !== book.MASACH
      );
    },
    async borrowBooks() {
      try {
        const user = await getUserDataFromToken();
        const borrowData = this.selectedBooks.map((book) => ({
          MADOCGIA: user._id,
          MASACH: book._id,
        }));

        await axios.post("http://localhost:3000/api/theodoi", borrowData);

        alert("Mượn sách thành công!");
        this.selectedBooks = [];
        window.location.reload();
      } catch (error) {
        console.error("Error borrowing books:", error);
      }
    },
  },
};
</script>

<style scoped>
.btn-borrow {
  padding: 10px 20px;
  background-color: #89b7e8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn-borrow:disabled {
  background-color: #d6d6d6;
  cursor: not-allowed;
}

.btn-borrow:hover:enabled {
  background-color: #0056b3;
}
</style>
