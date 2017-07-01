angular.module('starter.controllers', [])
.controller('UserCtrl', ['$scope','$timeout','$ionicLoading','UserService',function($scope,$timeout,$ionicLoading,UserService){
  $scope.user = {};
  $scope.user2 = {};
  $scope.isLogin = true;
  //切换登录/注册视图方法
  $scope.toggleView = function(flog){
    $scope.isLogin = flog;
  }
  $scope.validate = function(){
    var regno = /^1[0-9]{10}$/;
    if(!regno.test($scope.user2.phone)){
      document.getElementById("rs-no").style.color="red";
    }else{
      var p = UserService.validate($scope.user2.phone);
      p.success(function(flog){
        if(flog=='true'){
          document.getElementById("rs-no").style.color='green';
          document.getElementById("rs-no").innerHTML='该手机号码可用！';
        }else{
          document.getElementById("rs-no").style.color="red";
          document.getElementById("rs-no").innerHTML = "该手机号码已被注册！";
        }
      });
    }
  }
  //用户注册方法
  $scope.regist = function(){
    var regno = /^1[0-9]{10}$/;
    var regpwd = /^[0-9a-zA-Z]{5,8}$/;
    var regnc = /^[\u4e00-\u9fa5]{2,5}$/;
    var f = true;
    if(!regno.test($scope.user2.phone)){
      document.getElementById("rs-no").style.color="red";
      f = false;
      return;
    }else{
      document.getElementById("rs-no").style.color="green";
      f = true;
    }
    if(!regnc.test($scope.user2.fname)){
      document.getElementById("rs-nc").style.color="red";
      f = false;
      return;
    }else{
      document.getElementById("rs-nc").style.color="green";
      f = true;
    }
    if(!regpwd.test($scope.user2.password)){
      document.getElementById("rs-pw").style.color="red";
      f = false;
      return;
    }else{
      document.getElementById("rs-pw").style.color="green";
      f = true;
    }

    if(f){
      var p = UserService.validate($scope.user2.phone);
      p.success(function(flog){
        if(flog=='true'){
          $ionicLoading.show({
            template: '<div class="item-myicon"><ion-spinner icon="android"></ion-spinner><span></div>'
          });
          var p2 = UserService.regist($scope.user2);
          p2.success(function(data){
            if(data!=null){
              sessionStorage.setItem('user',JSON.stringify(data));
              $ionicLoading.hide();
              location.href = 'index.html#/tab/dash';
            }else{
              $scope.showMessage = true;
              $scope.message = "注册失败，请重试！";
              $timeout(function(){
                $scope.showMessage = false;
              },2000);
              $ionicLoading.hide();
            }
          });
        }else{
          document.getElementById("rs-no").style.color="red";
          document.getElementById("rs-no").innerHTML = "该手机号码已被注册！";
          return false;
        }
      });
    }
  }
  //用户登录方法
  $scope.login = function(){
    var regno = /^1[0-9]{10}$/;
    var regpwd = /^[0-9a-zA-Z]{5,8}$/;
    var f = true;
    if(!regno.test($scope.user.phone)){
      f = false;
      return;
    }else{
      f = true;
    }
    if(!regpwd.test($scope.user.password)){
      f = false;
      return;
    }else{
      f = true;
    }
    if(f){
      $ionicLoading.show({
        template: '<div class="item-myicon"><ion-spinner icon="android"></ion-spinner><span></div>'
      });
      var ck = $scope.user.isChecked;
      var p = UserService.login($scope.user);
      p.success(function(data){

        if(data!=null && data!='null'){
          if(ck){
            localStorage.setItem('user',JSON.stringify(data));
          }else{
            sessionStorage.setItem('user',JSON.stringify(data));
          }
          $ionicLoading.hide();
          location.href = 'index.html#/tab/dash';
        }else{
          $scope.showMessage = true;
          $scope.message = "用户名或密码不正确！";
          $timeout(function(){
            $scope.showMessage = false;
          },2000);
          $ionicLoading.hide();
        }
      });
    }
  }
}])

.controller('DetailCtrl', ['$scope','$ionicLoading','$timeout','$stateParams','$ionicActionSheet','DetailService','MemberService',function($scope,$ionicLoading,$timeout,$stateParams,$ionicActionSheet,DetailService,MemberService) {
  var user = sessionStorage.getItem("user");
  if(user==null || user==undefined){
    user = localStorage.getItem("user");
  }
  if(user!=null && user!=undefined){
    $scope.user = JSON.parse(user);
  }else{
    location.href="login.html";
  }

  $scope.ac1 = true;
  $scope.ac2 = false;
  $scope.ac3 = false;
  $scope.ac4 = false;
  $scope.dp = false;
  $scope.cp = 1;//页码
  $scope.pages = 1;//总页数
  $scope.pagecount = 10;//每页显示记录数

  $scope.can_loadmore = function(){
    return $scope.cp<$scope.pages;
  };

  $scope.loadMore = function(){
    $scope.cp++;
    $scope.getpays($scope.m);
  };

  //下拉刷新的方法
  $scope.refreshTasks = function() {
    $scope.cp=1;
    $scope.getpays('m');
  }

  $scope.getmember = function(){
    var mid = $stateParams.chatId;
    mid = parseInt(mid);
    if(mid>0){
      var p2 = MemberService.getmember(mid,$scope.user.token);
      p2.success(function(data){
        $scope.showMember = true;
        $scope.member = data;
        if($scope.member.pic==undefined || $scope.member.pic==null || $scope.member.pic==''){
          $scope.member.pic = "img/bb.png";
        }else{
          $scope.member.pic = url+"images/"+$scope.member.pic;
        }
        $scope.getpays('m');
      });
    }
  }

  //获取支付详情的方法
  $scope.m = 'm';
  $scope.getpays = function(m){
    $scope.m = m;
    if(m=='y'){
      $scope.ac1 = false;
      $scope.ac2 = false;
      $scope.ac3 = true;
      $scope.ac4 = false;
    }else if(m=='s'){
      $scope.ac1 = false;
      $scope.ac2 = true;
      $scope.ac3 = false;
      $scope.ac4 = false;
    }else if(m=='m'){
      $scope.ac1 = true;
      $scope.ac2 = false;
      $scope.ac3 = false;
      $scope.ac4 = false;
    }else{
      $scope.ac1 = false;
      $scope.ac2 = false;
      $scope.ac3 = false;
      $scope.ac4 = true;
    }
    var mid = $stateParams.chatId;
    mid = parseInt(mid);
    if(mid>0){
      var p = DetailService.getpays(mid,m,$scope.cp,$scope.pagecount,$scope.user.token);
      $ionicLoading.show({
          template: '<div class="item-myicon"><ion-spinner icon="android"></ion-spinner><span></div>'
      });
      p.success(function(data){
        if(data.pages>0){
          $scope.dp = true;
          $scope.pages = data.pages;
          $scope.total = data.total;
          $scope.shows = true;
          $scope.pays = data.moneys;
          if($scope.cp>1){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }else{
            $scope.$broadcast('scroll.refreshComplete');
          }
          $ionicLoading.hide();
        }else{
          $ionicLoading.hide();
        }
      });
    }
  }
  //删除支付记录的方法
  $scope.removepay = function(id) {
    $ionicLoading.show({
      template: '<div class="item-myicon"><ion-spinner icon="android"></ion-spinner><span></div>'
    });
    var p = DetailService.remove(id,$scope.user.token);
    p.success(function(flog){
      if(flog){
        for(var i=0;i<$scope.pays.length;i++){
          var ps = $scope.pays[i];
          if(ps.id==id){
            $scope.pays.splice(i,1);
            break;
          }
        }
      }
      $ionicLoading.hide();
    });
  }
}])

.controller('PayCtrl', ['$scope','$ionicLoading','$timeout','$filter','$ionicActionSheet','MemberService','PayService',function($scope,$ionicLoading,$timeout,$filter,$ionicActionSheet,MemberService,PayService) {
  var user = sessionStorage.getItem("user");
  $scope.mdate = new Date();
  if(user==null || user==undefined){
    user = localStorage.getItem("user");
  }
  if(user!=null && user!=undefined){
    $scope.user = JSON.parse(user);
  }else{
    location.href="login.html";
  }
  //下拉刷新的方法
  $scope.refreshTasks = function() {
    $scope.getmoneys();
    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1250);
  }
  $scope.show = false;

  $scope.moneys = [];
  //查询所有成员的方法
  $scope.showmembers = function(){
    $scope.pay = {mid:'0'};
    var p = MemberService.getmembers($scope.user.id,$scope.user.token);
    p.success(function(data){
      if(data!=null && data.length>0){
        data.unshift({id:"0",name:"请选择成员"});
        $scope.members = data;
      }
    });
  }
  $scope.mtotal = 0;
  //查询成员开销记录的方法
  $scope.getmoneys = function(){
    var p = PayService.getmoneys($scope.user.id,'all',$scope.user.token);
    $ionicLoading.show({
        template: '<div class="item-myicon"><ion-spinner icon="android"></ion-spinner><span></div>'
    });
    p.success(function(data){
      if(data!=null && data.length>0){
        $scope.showTotal = true;
        var j = 0;
        for(var i=0;i<data.length;i++){
          if(data[i].id==null || data[i].id=='' || data[i].id=='null'){
            continue;
          }
          if(data[i].pic==null || data[i].pic=='' || data[i].pic==undefined){
            data[i].pic = 'img/bb.png';
          }else{
            data[i].pic = url+"images/"+data[i].pic;
          }
          $scope.moneys[j] = data[i];
          if(!isNaN(data[i].money)){
            $scope.mtotal+=parseFloat(data[i].money);
          }
          j++;
        }
        $ionicLoading.hide();
      }
    });
  }
  //添加开销记录的方法
  $scope.addpay = function(){
    var md = document.getElementById("md").value;
    $scope.pay.mdate = md;
    if(md==''){
      document.getElementById("p-rq").style.color="red";
      return false;
    }else{
      document.getElementById("p-rq").style.color="green";
    }

    if($scope.pay.item==undefined){
      document.getElementById("p-xm").style.color="red";
      return false;
    }else{
      document.getElementById("p-xm").style.color="green";
    }

    if($scope.pay.money==undefined || parseFloat($scope.pay.money)<1){
      document.getElementById("p-my").style.color="red";
      return false;
    }else{
      document.getElementById("p-my").style.color="green";
    }

    if($scope.pay.mid==0){
      document.getElementById("p-cy").style.color="red";
      return false;
    }else{
      document.getElementById("p-cy").style.color="green";
    }
    var p = PayService.addpay($scope.pay,$scope.user.token);
    p.success(function(flog){
      $scope.show = true;
      if(flog){
        $scope.message = "数据录入成功，请继续！";
        $scope.pay = {mid:'0'};
      }else{
        $scope.message = "数据录入失败，请重试！";
      }
      $scope.flog = flog;
      $timeout(function(){
        $scope.show = false;
        document.getElementById("p-xm").style.color="#f0f0f0";
        document.getElementById("p-my").style.color="#f0f0f0";
        document.getElementById("p-cy").style.color="#f0f0f0";
        document.getElementById("p-rq").style.color="#f0f0f0";
      },2000);
    });

  }
  //弹出菜单
  $scope.showmenu = function(mid) {
    var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '修改成员' },
          { text: '删除成员' }
        ],
        cancelText: '取消',
        cancel: function() {},
        buttonClicked: function(index) {
          if(index==0){
            location.href = "#/tab/account/"+mid;
          }else if(index==1){
            var p = MemberService.removemember(mid,$scope.user.token);
            p.success(function(flog){
              $scope.showmsg = true;
              if(flog=='true'){
                $scope.moneys = [];
                $scope.getmoneys();
              }else{
                $scope.msg = "该成员支付有记录，不能删除！";
                $scope.fg = false;
              }
              $timeout(function(){$scope.showmsg=false;},2000);
            });
          }
          return true;
        }
    });
    $timeout(function() {
        hideSheet();
    }, 5000);
  };
}])

.controller('DashCtrl', ['$scope','$ionicLoading','$timeout','PayService',function($scope,$ionicLoading,$timeout,PayService) {
  var user = sessionStorage.getItem("user");
  if(user==null || user==undefined){
    user = localStorage.getItem("user");
  }
  if(user!=null && user!=undefined){
    $scope.user = JSON.parse(user);

  }else{
    location.href="login.html";
  }

  //支出统计数据查询的方法
  $scope.ac1 = true;
  $scope.ac2 = false;
  $scope.ac3 = false;
  $scope.ac4 = false;
  $scope.state = function(m){
    $ionicLoading.show({
        template: '<div class="item-myicon"><ion-spinner icon="android"></ion-spinner><span></div>'
    });
    var title = "";
    if(m=='y'){
      title = '本年度财务支出情况统计图';
      $scope.ac1 = false;
      $scope.ac2 = false;
      $scope.ac3 = true;
      $scope.ac4 = false;
    }else if(m=='s'){
      title = '本季度财务支出情况统计图';
      $scope.ac1 = false;
      $scope.ac2 = true;
      $scope.ac3 = false;
      $scope.ac4 = false;
    }else if(m=='m'){
      title = '本月财务支出情况统计图';
      $scope.ac1 = true;
      $scope.ac2 = false;
      $scope.ac3 = false;
      $scope.ac4 = false;
    }else{
      title = '历史财务支出情况统计图';
      $scope.ac1 = false;
      $scope.ac2 = false;
      $scope.ac3 = false;
      $scope.ac4 = true;
    }
    var p = PayService.getmoneys($scope.user.id,m,$scope.user.token);
    p.success(function(data){
      var names = [];
      var moneys = [];
      for(i=0;i<data.length;i++){
        names[i] = data[i].name;
        moneys[i] = data[i].money;
      }
      var mdiv = document.getElementById('main');
      var h = screen.availHeight-205;
      mdiv.style.height = h+"px";
      var myChart = echarts.init(mdiv);


      option = {
          title: {text:title,left:'center'},
          color: ['#EE6363'],
          tooltip : {
              trigger: 'axis',
              axisPointer : {type:'shadow'}
          },
          grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true},
          xAxis : [{
            type : 'category',
            data : names,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis : [{type : 'value'}],
          series : [{
            name:'',type:'bar',barWidth: '60%',data:moneys
          }]
      };
      myChart.setOption(option);
      $ionicLoading.hide();
    });
  }
  $scope.state('all');
}])

.controller('CenterCtrl', ['$scope','$ionicLoading','$timeout','UserService',function($scope,$ionicLoading,$timeout,UserService) {
  var user = sessionStorage.getItem("user");
  if(user==null || user==undefined){
    user = localStorage.getItem("user");
  }
  if(user!=null && user!=undefined){
    $scope.user = JSON.parse(user);
  }else{
    location.href="login.html";
  }
  //更新用户信息的方法
  $scope.update = function(){
    $ionicLoading.show({
        template: '<div class="item-myicon"><ion-spinner icon="android"></ion-spinner><span></div>'
    });
    var regnc = /^[\u4e00-\u9fa5]{2,5}$/;
    var regpw = /^[0-9a-zA-Z]{5,8}$/;
    if(!regnc.test($scope.user.fname)){
      document.getElementById("rs-nc").style.color="red";
      return false;
    }else{
      document.getElementById("rs-nc").style.color="green";
    }
    if(!regpw.test($scope.user.password)){
      document.getElementById("rs-pw").style.color="red";
      return false;
    }else{
      document.getElementById("rs-pw").style.color="green";
    }
    var uid = $scope.user.id
    if($scope.user!=null && uid!=undefined && parseInt(uid)>0){
      var p = UserService.update($scope.user);
      p.success(function(data){
        $scope.show = true;
        if(data!=null){
          $scope.message = "数据更新成功！";
          $scope.flog = true;
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          sessionStorage.setItem("user",JSON.stringify($scope.user));
          localStorage.setItem("user",JSON.stringify($scope.user));
          document.getElementById("rs-nc").style.color="#eee";
          document.getElementById("rs-pw").style.color="#eee";
        }else{
          $scope.message = "数据更新不成功，请重试！";
          $scope.flog = false;
        }
        $ionicLoading.hide();
        $timeout(function(){$scope.show=false;},2000);
      });
    }
  }
  $scope.logout = function(){
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    location.href="login.html";
  }
}])

.controller('MemberCtrl', ['$scope','$ionicHistory','$timeout','$stateParams','$cordovaCamera','$ionicActionSheet','$ionicPopup','MemberService',function($scope,$ionicHistory,$timeout,$stateParams,$cordovaCamera,$ionicActionSheet,$ionicPopup,MemberService) {
  var user = sessionStorage.getItem("user");
  if(user==null || user==undefined){
    user = localStorage.getItem("user");
  }
  if(user!=null && user!=undefined){
    $scope.user = JSON.parse(user);
  }else{
    location.href="login.html";
  }
  $ionicHistory.clearHistory();
  $scope.member = {uid:0};
  if($scope.member.pic==undefined){
    $scope.img = "img/bb.png";
  }else{
    $scope.img = url+"images/"+$scope.member.pic;
  }

  //定义选择照片的函数
  $scope.showMenu = function() {
      $ionicActionSheet.show({
          buttons: [
              { text: '拍照' },
              { text: '从相册选择' }
          ],
          titleText: '选择照片',
          cancelText: '取消',
          cancel: function() {
          },
          buttonClicked: function(index) {
              var options = {
                destinationType:Camera.DestinationType.FILE_URI,
                allowEdit:true, //出现裁剪框
                targetWidth:200,//图片裁剪高度
                targetHeight:200//图片裁剪高度
              };
              if(index == 0){
                  options.sourceType = Camera.PictureSourceType.CAMERA;
              }else if(index == 1){
                  options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
              }
              $cordovaCamera.getPicture(options).then(
  　　　　　　　function(imageURI) {
                  $scope.img = imageURI;
                  $scope.member.pic = imageURI;
                  $scope.$apply();
                },
                function (err) {}
              );
              return true;
          }
      });
  }

  $scope.getmember = function(){
    var mid = $stateParams.mid;
    if(mid!=undefined && parseInt(mid)>0){
      var p = MemberService.getmember(mid,$scope.user.token);
      p.success(function(data){
        $scope.member = data;
        if($scope.member.pic==undefined || $scope.member.pic=='' || $scope.member.pic==null){
          $scope.img = "img/bb.png";
        }else{
          $scope.img = url+"images/"+$scope.member.pic;
        }
      });
    }
  }

  $scope.upload = function(){
    var stamp = new Date().getTime();
    var fname = $scope.user.id+"-"+stamp+".jpg";
    var options = new FileUploadOptions();
    options.fileKey = "pic";
    options.fileName = fname;
    options.mimeType = "image/jpeg";
    options.params = {token:$scope.user.token};
    options.chunkedMode = false;
    var ft = new FileTransfer();
    ft.upload(
        $scope.member.pic,
        encodeURI(url+'upload.php'),
        uploadSuccess,
        uploadFailed,
        options
    );
    function uploadSuccess(data){
      if(data.response){
        $scope.member.pic = fname;
        $scope.member.uid = $scope.user.id;
        $scope.savemember();
      }else{
        $scope.show = true;
        $scope.flog = false;
        $scope.message = "成员保存失败，请重试！";
        $timeout(function(){$scope.show=false;},3000);
      }
    }

    function uploadFailed(error){
      $scope.show = true;
      $scope.flog = false;
      $scope.message = "成员保存失败，请重试！";
      $timeout(function(){$scope.show=false;},3000);
    }
  }

  $scope.savemember = function(){
    var regnc = /^[\u4e00-\u9fa5]{2,5}$/;
    if(user!=null && regnc.test($scope.member.name)){
      var p = MemberService.savemember($scope.member,$scope.user.token);
      p.success(function(flog){
        $scope.show = true;
        $scope.flog = flog;
        if(flog){
          $scope.message = "成员保存成功，请继续！";
          $scope.member.name = '';
          $scope.member.id = 0;
          $scope.img = "img/bb.png";
        }else{
          $scope.message = "成员保存失败，请重试！";
        }
        $timeout(function(){$scope.show=false;},3000);
      });
    }
  }
}]);
