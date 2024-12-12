# pipelines

WalletCore 建立关联表的关联数据时，并不是在 function 中一次性写入，而是通过 pipeline 的方式 异步写入。

比如创建一个 account 时，会在所有 chain 下创建对应的 address。这个过程不会再 addAccount 中完成，而是在 addAddressOfAccountPipeline 中异步完成。

## 优势

<br />
<br />

## 劣势

<br />
<br />

## 如何解决劣势