<template>

</template>

<script lang="ts" setup>
import { ref } from 'vue';


const props = defineProps<{
    itemsPerPage: number
    allItems: any[]
}>();

const totalPages = ref(1)
const currentPage = ref(1)
const itemsToDisplay = ref([])

function movePageArrow(page: number) {
  if (page <= 0) return;
  if (page > totalPages.value) return;

  setPage(page);
}

function setPage(page: number) {
  currentPage.value = page;

  totalPages.value = Math.floor(props.allItems.length / props.itemsPerPage);

  if (props.allItems.length % props.itemsPerPage > 0) {
    totalPages.value = totalPages.value + 1;
  }

  const startIndex = (page - 1) * props.itemsPerPage;
  const endIndex = startIndex + (props.itemsPerPage);

  itemsToDisplay.value = props.allItems.slice(startIndex, endIndex);
}
</script>

<style scoped>

</style>