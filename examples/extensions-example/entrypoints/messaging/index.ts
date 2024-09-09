import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  addMnemonicVault: any;
  backupMnemonicVault: any;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export default {
  sendMessage,
  onMessage,
};
