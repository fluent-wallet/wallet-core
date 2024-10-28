import type WalletClass from "../index";
import browser from "webextension-polyfill";
import type { EXTENSION_TYPE } from "../index";

export type UnknownTarget = Record<string, PropertyDescriptor["value"]>;

/**
 * Proxy wallet methods, if it's popup, we send message to background to execute the method.
 * @param fns
 * @param extensionType
 * @returns
 */
export function backgroundMethodWhenPopup<
	T extends Record<string | symbol, any>,
>(fns: T, extensionType: EXTENSION_TYPE): T {
	return new Proxy(fns, {
		get: (target, prop) => {
			return async (...args: any[]) => {
				/**
				 * if this is popup, we send message to background to execute the method.
				 */
				if (extensionType === "popup") {
					const response = await browser.runtime.sendMessage({
						method: prop,
						args,
					});
					return response;
				}
				/**
				 * if this is not popup, just call the original method
				 */
				return target[prop](...args);
			};
		},
	});
}
