


/*
** canvasId: 遮罩的dom
** imgId: 图片的id
** basePath: 图片路径，不带图片命名和图片格式
** imgPath: 图片的名字，没有序号0,1,2,3。。部分
** imgType: 图片格式
** imgNum: 图片数量
*/
function img3DRound(maskId,imgId,basePath,imgPath,imgType,imgNum){

	this.imgLength = 0;		//这是距离参数（图片长度），这个距离转化为图片的index，初始化为0，也就是第一张图片
	this.lastImgLength = 0;		//上次的图片长度
	this.imgDom = document.getElementById(imgId);			//img的dom
	this.mask = document.getElementById(maskId);	 	   //遮罩的dom
	this.imgList = this.mask.getElementsByTagName('img');	//图片列表
	this.lastImg = this.imgDom;	//保存上一个img对象，做切换时候使用
	this.iSpeed=0;	//速度
	this.timer=null;	//定时器，用来减速的

	this.imgNum = imgNum;
	this.basePath = basePath;	//图片路径，不带图片命名和图片格式
	this.imgPath = imgPath;		//图片的名字，没有序号0,1,2,3。。部分
	this.imgType = imgType;		//图片格式
}

//初始化
img3DRound.prototype.init = function() {
	// 缓存生成所有的图片集合
	this.createImg(this.imgNum,this.basePath,this.imgPath,this.imgType);

	//绑定鼠标事件
	this.bindMouseEvent();

	//绑定touch事件
	this.touchMouseEvent();

};

img3DRound.prototype.createImg = function(imgNum,basePath,imgPath,imgType) {
	// 缓存生成所有的图片集合
	var that = this;
	for (var i = 1; i < imgNum; i++) {
		(function (oNewImg){
			var tempImg=new Image();

			tempImg.onload=function ()
			{
				oNewImg.src=this.src;
			};
			tempImg.src=basePath+i+'.'+imgType;	//组装图片链接

			oNewImg.style.display='none';

			that.mask.appendChild(oNewImg);
		})(document.createElement('img'));
	};
};


img3DRound.prototype.bindMouseEvent = function(){

	var that = this;

	that.mask.onmousedown = function(e){
		var e = e || event;
		var disX = e.clientX-that.imgLength;

		clearInterval(that.timer);	//关闭定时器，避免重复

		that.mask.onmousemove = function(e){
			console.info('move');
			var e = e || event;
			that.imgLength = e.clientX - disX;

			that.imgMove(that);	//图片转动

			that.iSpeed =  that.imgLength - that.lastImgLength;	//计算出速度
			that.lastImgLength = that.imgLength;				//保存瞬时位置，做下次计算
			return false;	//避免选中图片

		}


		document.onmouseup = function(){
			console.info('up');
			that.mask.onmousemove=null;
			that.mask.onmouseup=null;
			that.timer=setInterval(function (){

				// S：缓冲运动
				that.imgLength+=that.iSpeed;						//计算瞬时位置
				if(that.iSpeed>0){
					that.iSpeed--;	//如果速度为整数，就递减
				}else if(that.iSpeed<0){
					that.iSpeed++;	//如果速度为整数，就递增
				}else if(that.iSpeed==0){
					clearInterval(that.timer);
				}
				// End
				that.imgMove(that);	//图片转动

			}, 30);
		}

		return false;	//避免选中图片
	}

}

img3DRound.prototype.touchMouseEvent = function(){

	var that = this;
	that.mask.ontouchstart = function(e){
		var e = e || event;
		var touch = e.touches[0];
		var disX = touch.clientX-that.imgLength;
		clearInterval(that.timer);	//关闭定时器，避免重复

		that.mask.ontouchmove = function(e){
			var e = e || event;
			var touch = e.touches[0];
			that.imgLength = touch.clientX - disX;
			that.imgMove(that);	//图片转动

			that.iSpeed =  that.imgLength - that.lastImgLength;	//计算出速度
			that.lastImgLength = that.imgLength;				//保存瞬时位置，做下次计算

			return false;
		}

		that.mask.ontouchend = function(){
			that.timer=setInterval(function (){

				// S：缓冲运动
				that.imgLength+=that.iSpeed;						//计算瞬时位置
				if(that.iSpeed>0){
					that.iSpeed--;	//如果速度为整数，就递减
				}else if(that.iSpeed<0){
					that.iSpeed++;	//如果速度为整数，就递增
				}else if(that.iSpeed==0){
					clearInterval(that.timer);
				}
				// End
				that.imgMove(that);	//图片转动

			}, 30);
		}
		return false;
	}
}



img3DRound.prototype.imgMove = function(obj){
	//obj 为传过来的img3dRound对象，为了获取他的属性
	// S:解决如果index为负数的情况,反转为负号
	// 例如当positionX为20的时候，currentIndex为-2
	var imgIndex = parseInt(-obj.imgLength/20);//控制速度，10像素才切换一张图片

	if (imgIndex > 0) {
		imgIndex = imgIndex%obj.imgNum;
	}else{
		imgIndex = imgIndex+(-Math.floor(imgIndex/obj.imgNum)*obj.imgNum);
	}
	// END:
	if(obj.lastImg != obj.imgList[imgIndex]){
		obj.lastImg.style.display = 'none';
		obj.imgList[imgIndex].style.display = 'block';
		obj.lastImg = obj.imgList[imgIndex];
	}

}