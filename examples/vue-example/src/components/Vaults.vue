<script setup lang="ts">
import { useVaults } from '@cfx-kit/wallet-core-vue-inject/src';
const vaults = useVaults();
</script>

<template>
  <h2>valuts length: {{ Array.isArray(vaults) ? vaults?.length : -1 }}</h2>
</template>
