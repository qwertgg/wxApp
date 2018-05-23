
var app = getApp();

var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
var nth = 0;// 设置活动菜单的index

Page({
  data: {
    idCache: {},
    selectIndexs: [],
    swiper: {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 300,
      current: 0
    },
    isAnalyze: false,
    cardList: [],
    currentQuestionId: null,
    currentSelectIndex: 10,
    indexArray: ["A", "B", "C", "D", "E"],
    rightAnswers: '',
    currentAnswers: '',
    isClick: false,
    radioItems: [],
    // diff: 0,
    checkeds: "",
    item: {
      index: 1,
      title: '',
      count: 0,
      currentQuestionId: null
    },
    type: 0,
    hidden: false,
    hiddenmodalput: true//可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框          
  },
  onLoad: function (options) {



    this.setData({
      idCache: { subject_id: options.subject_id, chapter_id: options.chapter_id, unit_id: options.unit_id, sortType: options.sortType }
    })
    console.log(this.data.idCache);

    this.getCardList()

    console.log('type' + options.type);
    if (options.type) {
      this.setData({
        type: options.type
      });

    }


  },

  // 获取题库列表
  getCardList: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log('http://tk.qikeya.com/api/subject/getCardS/subject_id/' + this.data.idCache.subject_id + '/chapter_id/' + this.data.idCache.chapter_id + '/unit_id/' + this.data.idCache.unit_id)
    wx.request({
      url: 'http://tk.qikeya.com/api/subject/getCardS/subject_id/' + this.data.idCache.subject_id + '/chapter_id/' + this.data.idCache.chapter_id + '/unit_id/' + this.data.idCache.unit_id,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        wx.hideLoading()

        if (res.data.data.num == 0) {
          return;
        }


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
            count: tmpCardList.length,
            currentQuestionId: tmpCardList[0].id
          }
        }, () => {
          this.getCurrentQuestion()
        })
        // debugger
        // for (var j = 0; j < this.data.cardList.length; j++) {
        //   var obj = this.data.cardList[j]
        //   this.setData({
        //     currentQuestionId: obj
        //   })
        //   this.getCurrentQuestion()
        // }
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
        // debugger
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
  onShow: function (options) {






    var currentMySelect = wx.getStorageSync("currentMySelect")
    if (currentMySelect > 0) {
      console.log('hahha')
      this.setData({
        'swiper.current': currentMySelect - 1,
        currentQuestionId: this.data.cardList[currentMySelect - 1].id,
        'item.index': currentMySelect,
        'item.currentQuestionId': this.data.cardList[currentMySelect - 1].id,
        isClick: false,
      })
      wx.removeStorageSync('currentMySelect')
      if (!this.data.cardList[this.data.swiper.current].choices) {

        this.getCurrentQuestion(currentMySelect - 1);

      } else {
        console.log(this.data.cardList[currentMySelect - 1])

        this.setData({

          questionC: this.data.cardList[currentMySelect - 1],
          rightAnswers: this.data.cardList[currentMySelect - 1].answer,

        })
      }
    }


  },
  changeSwiper: function (e) {
    // debugger
    this.setData({
      'swiper.current': e.detail.current,
      currentQuestionId: this.data.cardList[e.detail.current].id,
      'item.index': e.detail.current + 1,
      'item.currentQuestionId': this.data.cardList[e.detail.current].id,
      isClick: false,
      // index: e.detail.current,
    }, () => {
      if (!this.data.cardList[this.data.swiper.current].choices) {

        console.log(e.detail.current);
        this.getCurrentQuestion(e.detail.current);

      } else {
        console.log(this.data.cardList[e.detail.current])
        this.setData({

          questionC: this.data.cardList[e.detail.current],
          rightAnswers: this.data.cardList[e.detail.current].answer,

        })
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
  lookResult: function (e) {
    this.setData({
      isAnalyze: !this.data.isAnalyze
    })
  },
  lookCard: function (e) {
    var that = this;
    var selectModel = JSON.stringify(that.data.idCache)

    wx.navigateTo({
      url: '../answercard/answercard?selects=' + that.data.selectIndexs + '&idCache=' + selectModel,
      success: res => {

      }
    })




  },
  collectTap: function () {

    wx.request({
      url: 'http://tk.qikeya.com/api/question/putCollect/question_id/' + this.data.currentQuestionId + '/user_id/3',
      success: res => {
        console.log('收藏成功')
      }
    })
  },
  radioChange: function (e) {
    var that = this;




    console.log(e);

    var checked = e.detail.value;
    console.log(checked);

    var select = { index: that.data.item.index, type: that.data.item.title };

    that.data.selectIndexs.push(that.data.currentQuestionId);

    var answers = ['A', 'B', 'C', 'D', 'E']

    this.data.currentAnswers = checked - 10;
    var URL = 'http://tk.qikeya.com/api/question/putAnswer/question_id/' + this.data.currentQuestionId + '/answer/' + answers[this.data.rightAnswers] + '/user_id/1/user_answer/' + answers[this.data.currentAnswers] + '/from/' + this.data.idCache.sortType;

    wx.request({
      url: URL,
      success: res => {
        console.log(res.data);
      }
    })


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