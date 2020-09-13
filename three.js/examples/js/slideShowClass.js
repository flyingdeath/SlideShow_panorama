
function slideShowClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  slideShowClass.prototype.constructor = slideShowClass;

  /*------------------------------------------------------------------------------------------------*/

  slideShowClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  slideShowClass.prototype.initialize = function(){
    if(this.containerId){
      var c = new canvasClass({'containerId':this.containerId, width:this.width, height:this.height});
      c.initifillImage('#');
    }else{
      var c = 0;
    }
    
    if(this.orderSet){
      var set = this.orderSet;
      var index = 0;
    }else{
      var set = this.textList;
      var index = 0;
    }
    var element = {canvasObj: c, n:index, 'set': set, bit:1, 
                   'title':this.title, interval:this.interval};
    
    if(this.pbtnId){
      var paramSet = {instanceObj:this, 'element':element};
      YAHOO.util.Event.addListener(this.pbtnId, 'click', this.toggleShow, paramSet);
    }

    if(this.orderSet){
      this.timedRunShow_c(element)(); 
    }else{
      this.timedRunShow(element);
    }
    
  }
 
 slideShowClass.prototype.timedRunShow = function(element){
    if(element.n == 0){
      element.interval = this.initInterval*1000;
    }else{
      element.interval = this.interval*1000;
    }
    if(element.bit){
      if(this.orderSet){
       element.timer = setTimeout(this.timedRunShow_c(element),element.interval);
      }else if(this.textList){
       element.timer = setTimeout(this.timedRunShow_objects_c(element),element.interval);
      }
    }
    if( (element.n+1) >= element.set.length){
      if(this.orderSet){
        element.n = 0;
      }else{
        element.n++;
      }
    }else{
      element.n++;
    }
  }
  
 
 slideShowClass.prototype.timedRunShow_objects_c = function(element){
  var iElement = element, instanceObj = this;
  return function(){
      if(element.bit){
        if( (iElement.n) >= iElement.set.length){
          instanceObj.fillObject(iElement.set, iElement.n);
          if(instanceObj.onComplete){
            setTimeout(instanceObj.onComplete,instanceObj.onCompleteDelay*1000);
          }
        }else{
          instanceObj.fillObject(iElement.set, iElement.n);
          instanceObj.timedRunShow(iElement);
        }
      }
    }
  
 }

 
 slideShowClass.prototype.fillObject = function(list,index){
    var h = new helperClass();
    if(index > 0){ 
      h.hide(list[index - 1]);
    }
    if(this.fade){
      h.fadeAnimation({run: true, seconds: this.fadeTime, obj:list[index], start:0.0, finish: 1.0, onStart: function(){
        YAHOO.util.Dom.setStyle(list[index],"opacity",0.0)
        h.show(list[index])
      }});
    }else{
      h.show(list[index])
    }
 }
  
 slideShowClass.prototype.timedRunShow_c = function(element){
  var iElement = element, instanceObj = this;
  return function(){
      if(element.bit){
        instanceObj.fillImage(iElement.canvasObj,instanceObj.imagePrefix+iElement.set[iElement.n]+'.'+ instanceObj.imageExt)
        new helperClass().updateHTML(instanceObj.indexId, parseInt(iElement.n +1) +"/"+iElement.set.length + " "+element.title )
        instanceObj.timedRunShow(iElement);
      }else{
        iElement.n--;
      }
    }
  
 }

 slideShowClass.prototype.fillImage = function(c,src){
    var h = new helperClass();
    h.hide(c.getId());
    c.changeImageSrc(src)
    if(this.fade){
      h.fadeAnimation({run: true, seconds: this.fadeTime, obj:c.getId(), start:0.0, finish: 1.0, onStart: function(){
        YAHOO.util.Dom.setStyle(c.getId(),"opacity",0.0)
        h.show(c.getId())
      }});
    }else{
      h.show(c.getId())
    }
      
 }
 
 
  slideShowClass.prototype.toggleShow = function(eventOBj, paramSet){
   paramSet.instanceObj.toggleShow_p(eventOBj,paramSet.element);
  }
  
  slideShowClass.prototype.toggleShow_p = function(eventOBj, element){
     if(element.bit){
       element.bit = 0 ;
       this.changeImageSrc(this.pbtnId,this.playBtnImage);
       clearTimeout(element.timer)
     }else{
       element.bit = 1;
       if(this.orderSet){
         this.fillImage(element.canvasObj,this.imagePrefix+element.set[element.n]+'.'+ this.imageExt);
       }else{
         this.fillObject(element.set, element.n);
       }
       element.n++;
       this.changeImageSrc(this.pbtnId,this.pauseBtnImage);
       this.timedRunShow(element);
     }
 }


 slideShowClass.prototype.changeImageSrc = function(id,src){
    var domObj = document.getElementById(id);
    if(domObj){
      domObj.src = src;
    }
    new helperClass().deleteDomElement(domObj);
    domObj = null;
 }