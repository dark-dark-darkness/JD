//logo
// img鼠标移入 => i.改变图片ii.移出后执行换回图片
let img = document.querySelector(".logo .logo-img");
let gif = document.querySelector(".logo .logo-gif");
document.querySelector(".logo").onmouseover = function () {
	img.style.opacity = "0";
	gif.style.opacity = "1";
	this.onmouseout = function () {
		img.style.opacity = "1";
		gif.style.opacity = "0";
	};
}

//轮播图
let imgList = document.querySelectorAll(".img-pool .img-list li");
let cur = 0;
let imgNumber = imgList.length;
let points = document.querySelectorAll(".pointer li");
let run = true;

//切换图片
function imgTurn(curIndex, nextIndex, imgList) {
	imgList[curIndex].style.opacity = "0";
	imgList[nextIndex].style.opacity = "1";
	points[curIndex].className = "";
	points[nextIndex].className = "active";
	
}

//自动换图功能
window.setInterval(() => {
	                   if (run) {//如果未暂停
		                   let next = (cur + 1) % imgNumber;
		                   imgTurn(cur, next, imgList);
		                   cur = next;
		                   // console.log(cur);
	                   }
                   },
                   2000
);

//上一个按钮事件
document.querySelector(".img-pool .turn-left").onclick = () => {
	let next = cur === 0 ? imgNumber - 1 : cur - 1;
	imgTurn(cur, next, imgList);
	cur = next;
}

//下一个按钮事件
document.querySelector(".img-pool .turn-right").onclick = () => {
	let next = (cur + 1) % imgNumber;
	imgTurn(cur, next, imgList);
	cur = next;
}

//选中小点切换图片
points.forEach((p, index) => {
	//绑定鼠标移入事件
	p.onmouseover = () => {
		//暂时暂停计时器
		run = false;
		//切换图片
		imgTurn(cur, index, imgList);
		//修改当前位置
		cur = index;
	};
	//绑定移出事件,当鼠标移出时继续计时器
	p.onmouseout = () => run = true;
	// console.log(p, index);
	// console.log(true)
});

//秒杀倒计时

//数字转字符串补0函数
function padNumber(number, fill) {
	let new_number = number * (number > 0 ? 1 : -1),
	    len        = ('' + new_number).length;
	return (number >= 0 ? '' : '-') + (Array(
		fill > len ? fill - len + 1 || 0 : 0
	).join(0) + new_number);
}

//获取time
let time = document.querySelectorAll(".sec-kill-time .time strong");
//每秒-1
window.setInterval(function () {
	let h = Number(time[0].innerHTML);
	let min = Number(time[1].innerHTML);
	let sec = Number(time[2].innerHTML);
	if (sec - 1 >= 0) {
		sec--;
		time[2].innerHTML = padNumber(sec, 2);
		// console.log(time[2].innerHTML);
	} else if (min - 1 >= 0) {
		min--;
		time[1].innerHTML = padNumber(min, 2);
		time[2].innerHTML = "59";
		// console.log(time[1].innerHTML);
	} else if (h - 1 >= 0) {
		h--;
		time[0].innerHTML = padNumber(h, 2);
		time[1].innerHTML = "59";
		time[2].innerHTML = "59";
		// console.log(time[0].innerHTML);
	}
}, 1000);

//动画
let elevator = document.querySelector('.elevator');
let elevatorTotop = document.querySelector('.elevator-totop');
let elevatorList = document.querySelectorAll('.elevator-list li');
let searchBox = document.querySelector(".center-box .search");
let toYList = [
	//京东秒杀位置
	getElementTop(document.querySelector(".sec-kill")),
	1000,
	2000,
	3000,
	4000];
const elevatorOffsetTop = getElementTop(elevator);

//滚动到目标位置动画
function scrollAnimation(currentY, targetY) {
	// 获取当前位置方法
	// const currentY = document.documentElement.scrollTop || document.body.scrollTop
	// 计算需要移动的距离
	let needScrollTop = targetY - currentY
	let _currentY = currentY
	setTimeout(() => {
		// 一次调用滑动帧数，每次调用会不一样
		const dist = Math.ceil(needScrollTop / 10)
		_currentY += dist
		window.scrollTo(_currentY, currentY)
		// 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
		if (needScrollTop > 10 || needScrollTop < -10) {
			scrollAnimation(_currentY, targetY)
		} else {
			window.scrollTo(_currentY, targetY)
		}
	}, 10);
}

//指定元素点击后回到指定位置动画函数
function scrollOnClick(ele, targetY) {
	// console.log(ele);
	ele.onclick = function () {
		scrollAnimation(document.documentElement.scrollTop || document.body.scrollTop, targetY)
	}
}

function getElementTop(element) {
	let actualTop = element.offsetTop;
	let current = element.offsetParent;
	while (current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}

//京东秒杀按钮
scrollOnClick(elevatorList[0], toYList[0]);
//特色优选按钮
scrollOnClick(elevatorList[1], toYList[1]);
//频道广场按钮
scrollOnClick(elevatorList[2], toYList[2]);
//为你推荐按钮
scrollOnClick(elevatorList[3], toYList[3]);
// 点击回到顶部
scrollOnClick(elevatorTotop, 0);

// 监听滚轮事件
window.addEventListener("scroll", function () {
	let currentY = document.documentElement.scrollTop || document.body.scrollTop;
	//如果位置大于toYList[1..=3]设置变红
	for (let index = 0; index < 4; index++) {
		if (currentY >= toYList[index] && currentY < toYList[index + 1]) {
			elevatorList[index].classList.add('elevator-active');
		} else {
			elevatorList[index].classList.remove('elevator-active');
		}
	}
	//如果大于列表所在位置则显示回顶部并且开启绝对定位
	if (currentY >= elevatorOffsetTop) {
		elevator.classList.add('elevator-fixed');
		searchBox.classList.add("search-fixed");
		
		elevatorTotop.style.height = "60px";
	} else {
		elevator.classList.remove('elevator-fixed');
		searchBox.classList.remove("search-fixed");
		elevatorTotop.style.height = "0";
	}
});