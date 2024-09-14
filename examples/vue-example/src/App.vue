<script setup lang="ts">
import Vaults from './components/Vaults.vue';
import wallet from './wallet';
</script>

<template>
  <Vaults />

  <button @click="wallet.methods.addMnemonicVault()">addMnemonicVaultCreate</button>
  <button @click="wallet.methods.addMnemonicVault({ mnemonic: 'tag refuse output old identify oval major middle duck staff tube develop', source: 'import' })">
    addMnemonicVaultImported
  </button>
</template>
