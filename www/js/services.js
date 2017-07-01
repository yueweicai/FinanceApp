var url = "http://www.orilore.cn/finance/";
//var url = "http://localhost/finance/";
angular.module('starter.services', [])
.factory('UserService',['$http',function($http){
  return{
    validate:function(phone){
      return $http.get(url+"checkno.php?phone="+phone);
    },
    login:function(user){
      return $http({
        method:"POST",
        url:url+"login.php",
        data:user,
        cache:false
      })
    },
    regist:function(user){
      return $http({
        method:"POST",
        url:url+"regist.php",
        data:user,
        cache:false
      })
    },
    update:function(user){
      return $http({
        method:"POST",
        url:url+"modify.php",
        data:user,
        headers:{'TOKEN':user.token}
      })
    }
  }
}])

.factory('MemberService',['$http',function($http){
  return{
    getmember:function(id,token){
      return $http({
        method:"GET",
        url:url+"getmember.php",
        params:{id:id},
        headers:{'TOKEN':token}
      })
    },
    getmembers:function(uid,token){
      return $http({
        method:"GET",
        url:url+"getmembers.php",
        params:{uid:uid},
        headers:{'TOKEN':token}
      })
    },
    savemember:function(member,token){
      return $http({
        method:"POST",
        url:url+"savemember.php",
        data:member,
        headers:{'TOKEN':token},
        cache:false
      })
    },
    removemember:function(id,token){
      return $http({
        method:"GET",
        url:url+"removemember.php",
        params:{id:id},
        headers:{'TOKEN':token}
      })
    }
  }
}])

.factory('PayService',['$http',function($http){
  return{
    addpay:function(pay,token){
      return $http({
        method:"POST",
        url:url+"pay.php",
        data:pay,
        headers:{'TOKEN':token}
      })
    },
    getmoneys:function(uid,m,token){
      return $http({
        method:"GET",
        url:url+"getmoneys.php",
        params:{uid:uid,m:m},
        headers:{'TOKEN':token}
      })
    }
  }
}])

.factory('DetailService',['$http',function($http){
  return{
    getpays:function(mid,m,p,c,token){
      return $http({
        method:"GET",
        url:url+"getpays.php",
        params:{mid:mid,m:m,p:p,c:c},
        headers:{'TOKEN':token}
      })
    },
    remove:function(mid,token){
      return $http({
        method:"GET",
        url:url+"removepay.php",
        params:{id:mid},
        headers:{'TOKEN':token}
      })
    }
  }
}]);