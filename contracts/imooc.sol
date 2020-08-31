pragma solidity ^0.4.24;

contract CourseList{
    address public ceo;
    address[] public courses;
    bytes23[] public questions;
    constructor() public{
        ceo = msg.sender;
    }

    //新建
    function createQa(bytes23 _hash1, bytes23 _hash2) public{
        questions.push(_hash1);
        questions.push(_hash2);
    }

    function getQa() public view returns(bytes23[]){
        return questions;
    }

    function updateQa(uint _index, bytes23 _hash1, bytes23 _hash2) public{
        questions[_index*2] = _hash1;
        questions[_index*2+1] = _hash2;
    }

    function removeQa(uint _index) public{
        uint index = _index*2;
        uint len = questions.length;
        for(uint i = index; i < len-2;i = i+2){
            questions[i] = questions[i+2];
            questions[i+1] = questions[i+3];
        }
        delete questions[len-1];
        delete questions[len-2];
        questions.length = questions.length-2;
    }

    function createCourse(string _name, string _content,uint _target,uint _fundingPrice, uint _price, string _img) public{
        address newCourse = new Course(ceo, msg.sender, _name, _content, _target, _fundingPrice, _price, _img);
        courses.push(newCourse);
    }

    //获得所有课程
    function getCourse() public view returns(address[]){
        return courses;
    }

    function removeCourse(uint _index) public{
        //只有CEO能够删除
        require(msg.sender == ceo);
        //根据索引来删除
        require(_index<courses.length); 
        //将地址数组往前移，删除最后一个地址
        uint len = courses.length;
        for(uint i=_index;i<len-1;i++){
            courses[i] = courses[i+1];
        }
        delete courses[len-1];
        courses.length--;
    } 

    function isCEO() public view returns(bool){ 
        return msg.sender == ceo;
    } 
}

contract Course{
    address public ceo;
    address public owner;
    string public name;
    string public content;
    uint public target;
    uint public fundingPrice;
    uint public price;
    string public img;
    string public video;
    bool public isOnline;
    uint public count;
    mapping(address=>uint) public users;

    constructor(address _ceo, address _owner, string _name, string _content,uint _target,uint _fundingPrice,uint _price,string _img) public{
        ceo = _ceo;
        owner = _owner;
        name = _name;
        content = _content;
        target = _target;
        fundingPrice = _fundingPrice;
        price = _price;
        img = _img;
        video = '';
        isOnline = false;
        count = 0;
    }

    function addVideo(string _video) public{
        require(msg.sender == owner);
        require(isOnline == true);
        video = _video;
        }

    //众筹或者购买
    function buy() public payable{
        //1.用户没购买过
        require(users[msg.sender] == 0);
        if(isOnline){
            //如果上线了，需要用上线价格购买
            require(price == msg.value);
        }else{
            //如果没上线，使用众筹价格购买
            require(fundingPrice == msg.value);
        }
        users[msg.sender] = msg.value;
        count += 1;
        if(target <= count*fundingPrice){
            //钱超出目标
            if(isOnline){
                //上线之后购买,需要分成
                uint value= msg.value;
                ceo.transfer(value/10);
                owner.transfer(value-value/10);
            }else{
                isOnline = true;
                owner.transfer(count*fundingPrice);
            }
        }
    }

    function getDetail() public view returns(string,string,uint,uint,uint,string,string,uint,bool,uint){
        uint role;
        //是否是创建者
        if(owner == msg.sender){
            role = 0;
        }else if(users[msg.sender]>0){
            role = 1; //已经购买
        }else{
            role = 2; //未购买
        }

        return(
            name,
            content,
            target,
            fundingPrice,
            price,
            img,
            video,
            count,
            isOnline,
            role
        );

    }
}