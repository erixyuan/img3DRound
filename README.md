img3DRound
==========

图片3D旋转展示插件


功能：
    实现产品的横向旋转展示，支持鼠标滑动旋转，移动端手指滑动旋转。

使用：
    例子：
      
      /*
      ** canvasId: 遮罩的dom
      ** imgId: 图片的id
      ** basePath: 图片路径，不带图片命名和图片格式
      ** imgPath: 图片的名字，没有序号0,1,2,3。。部分
      ** imgType: 图片格式
      ** imgNum: 图片数量
      */
      var demo = new img3DRound("canvas","img","phone/","","png",57).init();
