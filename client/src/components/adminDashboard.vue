<template>
  <div class="dashboard">
    <div class="stats-card books">
      <div class="icon">📚</div>
      <div>
        <h3>Tổng số sách</h3>
        <p>{{ totalBooks }}</p>
      </div>
    </div>
    <div class="stats-card loans">
      <div class="icon">📖</div>
      <div>
        <h3>Số lượt mượn</h3>
        <p>{{ totalLoans }}</p>
      </div>
    </div>
    <div class="stats-card users">
      <div class="icon">👤</div>
      <div>
        <h3>Tổng người dùng</h3>
        <p>{{ totalUsers }}</p>
      </div>
    </div>
    <div class="stats-card overdue">
      <div class="icon">⏰</div>
      <div>
        <h3>Sách quá hạn</h3>
        <p>{{ overdueBooks }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      totalBooks: 1200,
      totalLoans: 350,
      totalUsers: 500,
      overdueBooks: 20,
    };
  },
};
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin: 20px;
}

.stats-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.icon {
  font-size: 2.5rem;
}

h3 {
  margin: 0;
  font-size: 16px;
  color: #555;
}

p {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.books {
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
}

.loans {
  background: linear-gradient(135deg, #f1f8e9, #dcedc8);
}

.users {
  background: linear-gradient(135deg, #ede7f6, #d1c4e9);
}

.overdue {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
}

.books p {
  color: #00796b;
}

.loans p {
  color: #558b2f;
}

.users p {
  color: #6a1b9a;
}

.overdue p {
  color: #c62828;
}
</style>
