 const path = require('path')
 const assert = require('assert')
 const Web3 = require('web3')
 const ganache = require('ganache-cli')
 const BigNumber = require('bignumber.js')

 //构建web3的实例
 const web3 = new Web3(ganache.provider())
   //引入合约的JSON
 const CourseList = require(path.resolve(__dirname, '../src/compiled/CourseList.json'))
 const Course = require(path.resolve(__dirname, '../src/compiled/Course.json'))

 //定义几个全局的变量，所有测试都需要
 let accounts
   //实例
 let courseList
 let course

 describe('测试课程的合约', () => {
     before(async() => {
       //测试前数据初始化
       accounts = await web3.eth.getAccounts()
         //1.虚拟部署一个合约
       courseList = await new web3.eth.Contract(JSON.parse(CourseList.interface))
         .deploy({
           data: CourseList.bytecode
         })
         .send({
           //最后一个是创建折
           from: accounts[9],
           gas: '5000000'
         })

     })

     it('测试合约部署成功', async() => {
       assert.ok(courseList.options.address)
     })

     it('测试添加课程', async() => {
       const oldaddress = await courseList.methods.getCourse().call()
       assert.equal(oldaddress.length, 0)
       await courseList.methods.createCourse(
           'Mote的课程',
           'react+redux+reactrouter4招聘App开发',
           web3.utils.toWei('8'),
           //众筹价格
           web3.utils.toWei('2'),
           web3.utils.toWei('4'),
           '图片的hash'
         )
         .send({
           from: accounts[0],
           gas: '5000000'
         })
       const address = await courseList.methods.getCourse().call()
       assert.equal(address.length, 1)
     })

     it('测试课程的属性', async() => {
       const [address] = await courseList.methods.getCourse().call()
         //添加课程合约的地址
       course = await new web3.eth.Contract(JSON.parse(Course.interface), address)
       const name = await course.methods.name().call()
       const content = await course.methods.content().call()
       const target = await course.methods.target().call()
       const fundingPrice = await course.methods.fundingPrice().call()
       const price = await course.methods.price().call()
       const img = await course.methods.img().call()
       const count = await course.methods.count().call()
       const isOnline = await course.methods.isOnline().call()
       assert.equal(name, 'Mote的课程')
       assert.equal(content, 'react+redux+reactrouter4招聘App开发')
       assert.equal(target, web3.utils.toWei('8'))
       assert.equal(fundingPrice, web3.utils.toWei('2'))
       assert.equal(price, web3.utils.toWei('4'))
       assert.equal(img, '图片的hash')
       assert.ok(!isOnline)
       assert.equal(count, 0)
     })

     it('测试只能CEO能删', async() => {
       await courseList.methods.createCourse(
           'Mote的Vue课程',
           'Vue也是一个好框架',
           web3.utils.toWei('8'),
           //众筹价格
           web3.utils.toWei('2'),
           web3.utils.toWei('4'),
           '图片的hash1')
         .send({
           from: accounts[0],
           gas: '5000000'
         })
       const address = await courseList.methods.getCourse().call()
       assert.equal(address.length, 2)

       //1.CEO才能删
       //2.索引正确才能删
       try {
         await courseList.methods.removeCourse(1).send({
           from: accounts[1],
           gas: '5000000'
         })
         assert.ok(false)
       } catch (e) {
         assert.equal(e.name, 'o')
       }
       try {
         await courseList.methods.removeCourse(2).send({
           from: accounts[9],
           gas: '5000000'
         })
         assert.ok(false)
       } catch (e) {
         assert.equal(e.name, 'o')
       }

     })

     it('是否是CEO', async() => {
       const isCEO1 = await courseList.methods.isCEO().call({
         from: accounts[9]
       })
       const isCEO2 = await courseList.methods.isCEO().call({
         from: accounts[1]
       })
       assert.ok(isCEO1)
       assert.ok(!isCEO2)
     })

     it('金钱转换', () => {
       assert.equal(web3.utils.toWei('2'), '2000000000000000000')
     })

     it('课程购买', async() => {
       await course.methods.buy().send({
         from: accounts[2],
         value: web3.utils.toWei('2')
       })
       const value = await course.methods.users(accounts[2]).call()
       const count = await course.methods.count().call()
       assert.equal(value, web3.utils.toWei('2'))
       assert.equal(count, 1)

       const detail = await course.methods.getDetail().call({
         from: accounts[0]
       })
       assert.equal(detail[9], 0)
       console.log(detail)

       const detail2 = await course.methods.getDetail().call({
         from: accounts[2]
       })
       assert.equal(detail2[9], 1)

       const detail3 = await course.methods.getDetail().call({
         from: accounts[5]
       })
       assert.equal(detail3[9], 2)
     })

     it('还没上线，购买的课不入账', async() => {
       const oldBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))
       await course.methods.buy().send({
         from: accounts[3],
         value: web3.utils.toWei('2')
       })
       const newBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))
       const diff = newBlance.minus(oldBlance)
       assert.equal(diff, 0)
     })

     it('还没上线，不能上传视频', async() => {
       try {
         await course.methods.addVideo('video的hash')
           .send({
             from: accounts[0],
             gas: '5000000'
           })
         assert.ok(false)
       } catch (e) {
         assert.equal(e.name, 'o')
       }
     })

     it('不能重复购买', async() => {
       try {
         await course.methods.buy().send({
           from: accounts[2],
           value: web3.utils.toWei('3')
         })
         assert.ok(false)
       } catch (e) {
         assert.equal(e.name, 'o')
       }
     })

     it('课程必须是众筹价格', async() => {
       try {
         await course.methods.buy().send({
           from: accounts[4],
           value: web3.utils.toWei('3')
         })
         assert.ok(false)
       } catch (e) {

         assert.equal(e.name, 'o')
       }
     })

     it('众筹上线，钱到账', async() => {
       const oldBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))

       //8 众筹价是2  买4次就上线
       await course.methods.buy().send({
         from: accounts[4],
         value: web3.utils.toWei('2')
       })
       await course.methods.buy().send({
         from: accounts[5],
         value: web3.utils.toWei('2')
       })
       const count = await course.methods.count().call()
       const isOnline = await course.methods.isOnline().call()
       assert.equal(count, 4)
       assert.ok(isOnline)
       const newBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))
       const diff = newBlance.minus(oldBlance)
       assert.equal(diff, web3.utils.toWei('8'))
     })

     it('课程必须是线上的价格', async() => {
       try {
         await course.methods.buy().send({
           from: accounts[6],
           value: web3.utils.toWei('2')
         })
         assert.ok(false)
       } catch (e) {

         assert.equal(e.name, 'o')
       }
     })

     it('课程必须是线上的价格2', async() => {
       await course.methods.buy().send({
         from: accounts[6],
         value: web3.utils.toWei('4')
       })
       const count = await course.methods.count().call()
       assert.equal(count, 5)
     })

     it('上线之后购买，有分成收益', async() => {
       //ceo的分成
       const oldCeoBlance = new BigNumber(await web3.eth.getBalance(accounts[9]))
         //课程的创建者
       const oldOwnerBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))

       await course.methods.buy().send({
         from: accounts[7],
         value: web3.utils.toWei('4')
       })
       const newCeoBlance = new BigNumber(await web3.eth.getBalance(accounts[9]))
       const newOwnerBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))

       const diffCeo = newCeoBlance.minus(oldCeoBlance)
       const diffOwner = newOwnerBlance.minus(oldOwnerBlance)
       assert.equal(diffCeo, web3.utils.toWei('0.4'))
       assert.equal(diffOwner, web3.utils.toWei('3.6'))
     })

     it('上线之后可以传视频', async() => {
       await course.methods.addVideo('video的hash')
         .send({
           from: accounts[0],
           gas: '5000000'
         })
       const video = await course.methods.video().call()
       assert.equal(video, 'video的hash')
     })
   }


 )
