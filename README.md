1. truffle相当于create-react-app或者vue-cli
2. 一开始用没什么问题，但是想要进阶需要自己配置webpack

1. 使用JS测试合约，测试驱动开发

需要外部调用声明 所以函数类型声明为public

solc[https://github.com/ethereum/solc-js]
solc 编译.sol文件 变为JSON文件（后面需要编译部署的数据）
 1. bytecode
    1. 部署合约用的数据
 2. interface
    1. 测试使用

1. 每次compile清空文件 重新生成 （使用rimraf模块)
2. 报错信息打印
3. 最好能监听 自动compile
    1. 使用onchange模块

1. 课程列表
    1. 每一个课程是单独一个合约
    2. 使用CourseList来控制课程的合约

测试 使用mocha
断言使用node自己的assert
本地部署环境ganeche-cli虚拟环境

课程：
    owner：课程创建者
    name：课程名
    content：课程简介
    target：课程目标是募资多少  wei  ETH
    fundingPrice：众筹价格
    price：上线价格
    img：课程图片
    video：视频
    count：多少人支持
    isOnline：是否上线

wei finney szabo ether
1 ether == 10^3 finney
1 ether == 10^6 szabo
1 ether == 10^18 wei

##部署

助记词
oblige ski mother bird milk weekend raccoon scout daring cream crowd major

主网
本地ganache 没有办法在公网访问

ropsten 和主网一样的逻辑，只不过币不值钱

2.部署
3.infura.io 部署服务
    1.https://ropsten.infura.io/v3/af524170465044288643458fb2a80afe 
4.安装 npm install web3 truffle-hdwallet-provider@0.0.3 --save


1.课程名
2.详情 课程具体介绍
3.架构图
4.众筹的目标 10ETH
5.众筹价格  1ETH
6.上线价格 2ETH

QmQsCAz6CZ8gWNv2TWJZdWfs32TPvDEsAcf9rSdaQTxMT7

余额

CEO: 7.995855  1成 8.075855
讲师1: 1999984  => 2.999984  9成  3.719984
学生1: 1  =>  0.4999999
学生2: 3  =>  2.4999999
学生3: 4  =>  3.1999999 


以太坊存储ipfs的hash 一个问题存一个
基本所有的数据 都以JSON存储在ipfs之上

node0:mdj960728   0x796a93F8040096Fd9f38eC7B4C05F4B000518774 节点启动命令：geth --identity "node0" --rpc --rpcport "8121" --rpccorsdomain "*" --datadir ./node0 --port "2001" --nodiscover --rpcapi "db,eth,net,web3,personal"

node1:mote2720    0xf7AA6073C5279B258EfCDC9E8bb706d2464E5B0d 节点启动命令：geth --identity "node1" --rpc --rpcport "8122" --rpccorsdomain "*" --datadir ./node1/data --port "2001" --nodiscover --rpcapi "db,eth,net,web3,personal"

node2:mote2721    0x534775a6Ac6219B3Dd547c99dd8bE155ffb4FE4a 节点启动命令：geth --identity "node2" --rpc --rpcport "8123" --rpccorsdomain "*" --datadir ./node2/data --port "2001" --nodiscover --rpcapi "db,eth,net,web3,personal"