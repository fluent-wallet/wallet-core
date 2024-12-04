## ui层怎么使用 database 中的数据？

rxdb 提供了 observable 的机制，可以方便的将数据库中的数据转换为 observable 流，详情见 [RxQuery](https://rxdb.info/rx-query.html) 与 [RxState](https://rxdb.info/rx-state.html)。
WalletCore 提供了 @cfx-kit/wallet-core-observable，其中提供了对 database中所有数据进行 observe 的方法。