const fs = require('fs')

const path = require('path')
const solc = require('solc')

//自动修正需要编译文件的路径
const contractPath = path.resolve(__dirname,'../contracts/imooc.sol')

//获取合约的内容
const source = fs.readFileSync(contractPath,'utf-8')
//编译
const ret = solc.compile(source)
console.log(ret)
if(Array.isArray(ret.errors) && ret.errors.length > 0){
    //出错
    console.log(ret.errors[0])
}else{
    //将编译的文件写成JSON文件
    Object.keys(ret.contracts).forEach(name => {
        const contractName = name.slice(1)
        const filepath = path.resolve(__dirname, `../src/compiled/${contractName}.json`)
        fs.writeFileSync(filepath, JSON.stringify(ret.contracts[name]))
        console.log(`${filepath} bingo`)
    })
}

