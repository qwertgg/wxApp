
var app = getApp();

var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
var nth = 0;// 设置活动菜单的index

Page({
  data: {
    aaa:''       
  },
  onLoad: function (options) {
      this.setData({
        aa:'aa'
      })


  },
  clickbtn1:function(){
   wx.navigateTo({
     url: '../test/aaa',
   })
  },
  clickbtn:function(){
    this.setData({
      aa: 'bb'
    })
  },

  clickback:function(){
    wx.redirectTo({
      url: '',
    })
  },
  // 获取题库列表
  getCardList: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: 'http://tk.qikeya.com/api/subject/getCard',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        wx.hideLoading()
        let tmpCardList = []
        if (Object.keys(res.data.data.List).length > 0) {
          Object.keys(res.data.data.List).forEach((questionName) => {
            res.data.data.List[questionName].forEach((question) => {

              if (question.type == this.data.type || this.data.type == 0) {

                tmpCardList.push(question);
              }

            })
          })
        }
        this.setData({
          cardList: tmpCardList,
          currentQuestionId: tmpCardList[0].id,
          item: {
            index: this.data.item.index,
            title: this.data.item.title,
            count: tmpCardList.length
          }
        }, () => {
          this.getCurrentQuestion()
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })

        //显示出加载中的提示
        this.setData({ loadHidden: true })
      }
    })
  },

  // 获取当前题目数据
  getCurrentQuestion: function () {

    console.log();

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: 'https://tk.qikeya.com/api/question/getQuestionSingle/id/' + this.data.currentQuestionId,
      success: res => {
        wx.hideLoading()

        if (!res.data) {
          this.setData({ toastHidden: false })
          return false
        }


        // debugger
        for (var i = 0; i < this.data.indexArray.length; i++) {

          var item = this.data.indexArray[i];
          if (res.data.data.answer == item) {
            this.data.rightAnswers = i;
            break;
          }
        }

        var typeStr = "";
        var type = res.data.data.type;
        console.log("type" + type);
        if (type == 1) {
          typeStr = "A1";
        } else if (type == 2) {
          typeStr = "A2";

        } else if (type == 3) {
          typeStr = "A3/A4";
        } else {
          typeStr = "B1";
        }

        this.setData({
          questionC: res.data.data,
          rightAnswers: this.data.rightAnswers,
          'item.title': typeStr
        })
        this.setData({
          cardList: this.data.cardList.map((item) => {
            if (res.data && item.id == this.data.currentQuestionId) {
              item = res.data.data
            }
            return item
          }),
          toastHidden: false
        })



        // 本地缓存
        try {
          wx.setStorageSync('key', res.data.data.id)
        } catch (e) {
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })

        //显示出加载中的提示
        this.setData({ loadHidden: true })
      }
    })
  },

  changeSwiper: function (e) {
    this.setData({
      'swiper.current': e.detail.current,
      currentQuestionId: this.data.cardList[e.detail.current].id,
      'item.index': e.detail.current + 1
    }, () => {
      if (!this.data.cardList[this.data.swiper.current].choices) {

        console.log(e.detail.current);
        this.getCurrentQuestion(e.detail.current);
      }
    })
  },

  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      confirmColor: "#3ea5ff",
      hiddenmodalput: true,
      jsInput: function (e) {
        this.setData({ inpval: e.detail.value })
      }

    })
  },
  radioChange: function (e) {
    console.log(e);
    var that = this;
    var checked = e.detail.value;
    console.log(checked);
    this.data.currentAnswers = checked - 10;
    that.setData({
      currentAnswers: this.data.currentAnswers,
      isClick: true,
    })
    that.setData({
      currentSelectIndex: checked,
      currentAnswers: this.data.currentAnswers,
    })
  }
})