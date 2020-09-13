
function slideShowClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.element =  this.initialize(); 
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
    var element = {canvasObj: c, n : index, 'set': set, bit:1, 
                   'title':this.title, interval:this.interval};
    
    if(this.pbtnId){
      var paramSet = {instanceObj:this, 'element':element};
      YAHOO.util.Event.addListener(this.pbtnId, 'click', this.toggleShow, paramSet);
    }
    ;
    
    if(this.orderSet){
      this.timedRunShow_c(element)(); 
    }else{
      this.timedRunShow_objects_p(element)
      this.timedRunShow(element);
    }
    return element;
    
  }
  
 slideShowClass.prototype.getElement = function(){
    return this.element;
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
  }
  
 
 slideShowClass.prototype.timedRunShow_objects_c = function(){
  var instanceObj = this;
  return function(){
    instanceObj.timedRunShow_objects_p(instanceObj.element)
  }
  
 }
 
 
 slideShowClass.prototype.timedRunShow_objects_p = function(element){
       if(element.bit){
         if( (element.n) > (element.set.length)){
           this.fillObject(element.set, element.n);
           if(this.onComplete){
             setTimeout(this.onComplete_C(element),this.onCompleteDelay*1000);
           }
         }else{
           this.fillObject(element.set,element.n);
           this.timedRunShow(element);
         }
        if( element.set){
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
      }
      
 }
 slideShowClass.prototype.onComplete_C = function(element){
  var iElement = element, instanceObj = this;
  return function(){
    instanceObj.onComplete(instanceObj);
  }
}
 
 slideShowClass.prototype.fillObject = function(list,index){
    var h = new helperClass();
    if(index >= 0){ 
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
        if( element.set){
          if( (iElement.n+1) >= element.set.length){
            if(this.orderSet){
              iElement.n = 0;
            }else{
              iElement.n++;
            }
          }else{
            iElement.n++;
          }
        }
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
 
 
 
slideShowClass.prototype.changeToDifferentShow_P = function(eventObj, paramSet){
  paramSet.instanceObj.changeToDifferentShow(eventObj,paramSet.el);
}
 
slideShowClass.prototype.changeToDifferentShow = function(eventObj,element){
  clearInterval(element.slide_showObj);
  var targetId = YAHOO.util.Event.getTarget(eventObj).id;
  element.st =0;
  element.tObj[3] =targetId;
  clearTimeout(element.textShow.element.timer)
  for(var x= 0; x<element.textShow.textList.length;x++){
    this.h.hide(element.textShow.textList[x]);
  }
  this.h.show( element.sets[targetId].text_list[0]);
  this.h.hide(element.id,'v');
  if(element.t[0]){
     element.t[0].material.dispose();
    element.scene.remove( element.t[0] );
    element.t[0] = null;
  }
  document.getElementById("myAudio").muted = true;
  var SlideShowTitle = document.getElementById("SlideShowTitle");
  SlideShowTitle.innerHTML =  element.sets[targetId].name + " By,  Brian Spiegel.";
  SlideShowTitle = this.h.deleteDomElement(SlideShowTitle);
  this.render(element);
  element.textShow =  this.h.deleteDomElement(element.textShow);
  element.textShow = new slideShowClass({fade:true,
                                        fadeTime:1.5,
                                        initInterval:element.i,
                                        interval: element.i*2,
                                        'textList': element.sets[targetId].text_list,
                                        onCompleteDelay:element.i/2,
                                        onComplete: function(obj){
                                          obj.changeAduioSrc('myAudio',element.sets[targetId].audio_file);
                                          var domAudioObj =  document.getElementById("myAudio");
                                          domAudioObj.muted = false;
                                          domAudioObj.load();
                                          domAudioObj.play();
                                          domAudioObj = this.h.deleteDomElement(domAudioObj);
                                          obj.h.show("sig");
                                          obj.toggleShow_p({},obj.getElement());
                                          obj.h.show(element.id,'v');
                                          element.tObj[1] = "";
                                          element.currentSlidShowObj.setnewtexture(element.scene, element.sets[targetId].list[0], element.t, element.params, element.tObj, element.st, element.sets[targetId].list.length,element.ft,"new", element.debug, element);
                                          element.st++;
                                          obj.h.updateHTML('index',"1/"+ element.sets[targetId].list.length + "<br/>" + element.sets[targetId].name + " by , <br/> " );
                                          element.tObj[2] =  element.sets[targetId].name;

                  element.slide_showObj = setInterval(
                      element.currentSlidShowObj.slideShowAtl(element.s, element.sets[targetId].list,element.st, element.t, element.p, element.tObj, element.ft, element.debug, element),8000);


                }
                });
  }
 slideShowClass.prototype.changeAduioSrc = function(id,src){
   var domObj = document.getElementById(id);
   if(domObj){
     domObj.children[0].src = src;
   }
   domObj = new helperClass().deleteDomElement(domObj);
 }
 
        slideShowClass.prototype.set_aminte_pulse = function(p,t){
          var param01 = p, ticks = t;
          var flag = false;
          return function(){
              if(param01){
                param01.exposure = Math.sin(ticks*0.01 ) +1;
                render(p);
                if(flag){
                  ticks--;
                }else{
                  ticks++;
                }
                if( ticks == Number.MAX_VALUE){
                 flag = true;
                }
                if( ticks == 0){
                 flag = false;
                }
              }
          }
        }
          //setInterval(function(){ alert("Hello"); }, 3000);
         slideShowClass.prototype.slideShowAtl = function(scene,files,ticks, texture01, params, timerobj, fadeType , debug, element){
          var t0 =  ticks, par = params, texture01, timer = timerobj, ft = fadeType, d = debug, el = element;
          var s = scene, f = files;
          var obj = this;
          return function (){
            obj.setnewtexture(s,f[t0], texture01, par,timer, t0, f.length, ft,false, d, el);
 
 
            t0++;
            if(t0 == f.length){
              t0 = 0;
            }
          }
        }
                /*      */
 
                // audio_file
 
         slideShowClass.prototype.toggleAudio_P = function( element){
           var instanceObj = this, my_el = element;
           return function(eventObj){
                instanceObj.toggleAudio(my_el);
           }
         }
         slideShowClass.prototype.toggleAudio = function( element){
          if(element.audioBit){
             this.changeImageSrc(element.mutebtn,element.muteonBtnImage);
             element.audioBit = 0 ;
            document.getElementById("myAudio").muted = true;
           }else{
             element.audioBit = 1 ;
             this.changeImageSrc(element.mutebtn,element.muteOffBtnImage);
            document.getElementById("myAudio").muted = false;
 
          }
 
        }
         slideShowClass.prototype.toggleShowAtl_P = function(element){
           var instanceObj = this, my_el = element;
           return function(){
                instanceObj.toggleShowAtl(my_el);
           }
         }
        slideShowClass.prototype.toggleShowAtl = function(element){
          if(element.bit){
             this.changeImageSrc(element.pbtnId,element.playBtnImage);
                   clearInterval(element.slide_showObj);
             element.bit = 0 ;
           }else{
             element.bit = 1 ;
             element.st++;
             this.slideShowAtl(element.s,element.sets[element.tObj[3]].list,element.st, element.t, element.p, element.tObj, element.ft, element.debug, element)();
             this.changeImageSrc(element.pbtnId,element.pauseBtnImage);
                   clearInterval(element.slide_showObj);
            element.slide_showObj = setInterval(
                this.slideShowAtl(element.s,element.sets[element.tObj[3]].list,element.st, element.t, element.p, element.tObj, element.ft, element.debug, element),10000)
          }
 
        }
        //var gui = new GUI();
 
        //gui.add( params, 'exposure', 0, 4, 0.01 ).onChange( render );
        //gui.open();
 
       slideShowClass.prototype.setnewtexture = function(scene, filepath, oldmesh, param0, time, index, len, fadeType, isNew,debug, el){
        var broken = filepath.split('.');
        var file_ext = broken[broken.length -1 ];
        var currentObj = this;
 
        if(el.t[0]){
            if (fadeType  == "OutIn"){
            try{
              el.h.fadeAnimation({run: true,
              seconds: 3,
              obj:"dummy3",
              method: YAHOO.util.Easing.easeOutStrong,
              start:1.0,
              finish: 0.0,
              onTween:function(obj1,obj2,obj3){
                if(file_ext){
                  el.params.exposure  = parseFloat(YAHOO.util.Dom.getStyle("dummy3","opacity"))*1.2;
                }else{
                   el.t.material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy3","opacity"));
                }
                currentObj.render(el);
              },
              onComplete:function(){
                el.params.exposure  = 0;
                currentObj.render(el);
                el.scene.remove( el.t[0] );
                currentObj.render(el);
                currentObj.setMesh(filepath,el.id,el.params, el.timerObj, time, el.t, index, len, fadeType, isNew,debug, el, el.THREE);
 
 
              },
              onStart: function(){
              YAHOO.util.Dom.setStyle("dummy3","opacity",1.0)
              //h.show(renderer.domElement);
              }});
            }catch(error){
              debugger;
            }
          }else{
                this.setMesh(filepath,el.id,el.params, el.timerObj, time, el.t, index, len, fadeType, isNew,debug, el, el.THREE);
          }
        }else{
          this.setMesh(filepath,el.id,el.params, el.timerObj, time, el.t, index, len, fadeType, isNew,debug, el, el.THREE);
        }
 
 
      }
 
 
       slideShowClass.prototype.setMesh = function(filepath,id0,params, t, timerObj, texture_mesh, index, len,fadeType, isNew,debug, el, THREE){
        var broken = filepath.split('.');
        var file_ext = broken[broken.length -1 ];
        var currentObj = this;
 
        var setImage = function ( texture, textureData ) {
                 //   try{
 
                      //console.log( textureData );
                      //console.log( texture );
 
                      var material = new el.THREE.MeshBasicMaterial( { map: texture } );
                      if(textureData){
                        el.renderer.gammaOutput = true;
                         var quad = new el.THREE.PlaneBufferGeometry( 1.5 * textureData.width / textureData.height, 1.5 );
                      }else{
                        el.renderer.gammaOutput = false;
                         var quad = new el.THREE.PlaneBufferGeometry( 1.5 * texture.image.width / texture.image.height, 1.5 );
 
                      }
                        var mesh = new el.THREE.Mesh( quad, material );
 
                        el.scene.add(mesh);
                            try{
                        if(!isNew &&  fadeType !== "OutIn"){
                            mesh.material.opacity = 1.0;
                            mesh.material.transparent = false;
                          if(textureData){
                            el.params.exposure  = 1.2;
                          }else{
                            el.params.exposure  = 1;
                          }
                        }
 
                        if(el.t[0]   &&  fadeType !== "OutIn"){
                          el.t[0].material.transparent = true;
                          el.t[0].material.opacity = 1.0;
                        }
 
                             }catch(error){
                               debugger;
                            }
                      if( "OutIn" == fadeType){
                        if(el.t[0]){
                          el.t[0] = mesh;
                        }
                         el.params.exposure  = 0;
                        el.h.fadeAnimation({run: true, seconds:3,
                          obj:"dummy3",
                          start:0.0,
                          finish: 1.0,
                          method: YAHOO.util.Easing.easeInStrong,
                          onTween:function(obj1,obj2,obj3){
                              if(textureData){
                                el.params.exposure  = parseFloat(YAHOO.util.Dom.getStyle("dummy3","opacity"))*1.2;
                              }else{
                                mesh.material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy3","opacity"));
                              }
                              currentObj.render(el);
                          },
                          onComplete:function(){
                            el.t[0] = mesh;
                            currentObj.render(el);
                          },
                          onStart: function(){
                            if( Number.isInteger(index)){
                              el.h.updateHTML('index', parseInt(index+1) +"/"+len + "<br/>"+timerObj[2] +" By, <br/> " );
                            }
                            YAHOO.util.Dom.setStyle("dummy3","opacity",0.0);
                          }});
                      }else if("crossFade" == fadeType){
                        mesh.material.opacity = 0.0;
                        mesh.material.transparent = true;
 
                        //  method: YAHOO.util.Easing.easeOutStrong,
                        if(texture_mesh[0]){
                          el.h.fadeAnimation({run: true, seconds:3,
                            obj:"dummy2",
                            start:1.0,
                            finish: 0.0,
                            onComplete:function(){
                              timerObj[1] = "done";
                            },
                            onTween:function(obj1,obj2,obj3){
                              if(timerObj[1] !== "done"){
                                //debug.output(parseFloat(YAHOO.util.Dom.getStyle("dummy2","opacity")))
                                //render();
                              }
                            },
                            onStart: function(){
                              timerObj[1] = "";
                              el.t[0].opacity = 1.0;
                              el.t[0].transparent = true;
 
                              if(textureData){
                                el.params.exposure  = 1.2;
                              }else{
                                el.params.exposure  = 1;
                              }
 
 
                              el.t[0].material.opacity =   1.0;
                              if( Number.isInteger(index)){
                                el.h.updateHTML('index', parseInt(index+1) +"/"+len + "<br/>"+timerObj[2] + " By, <br/> " );
                              }
                              YAHOO.util.Dom.setStyle("dummy2","opacity",1.0);
                            }});
                        }
                      //method: YAHOO.util.Easing.easeInStrong,
 
                        el.h.fadeAnimation({run: true, seconds:3,
                          obj:"dummy",
                          start:0.0,
                          finish: 1.0,
                          onTween:function(obj1,obj2,obj3){
                            //params.exposure  = parseFloat(YAHOO.util.Dom.getStyle("dummy","opacity")*1.2);
                            if(timerObj[1] !== "done"){
                              if(el.t[0]){
                                el.t[0].material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy2","opacity"));
                              }
                              mesh.material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy","opacity"));
                              currentObj.render(el);
                            }
                          },
                            onComplete:function(){
                              if(el.t[0]){
                                el.scene.remove( el.t[0] );
                              }
                              //params.exposure  = 1.2;
                              mesh.material.opacity = 1.0;
                              timerObj[1] = "done";
                              currentObj.render(el);
                                el.t[0] = mesh;
 
 
 
                            },
                          onStart: function(){
                            //params.exposure  = 0.0;
                            params.exposure  = 1.2;
                            mesh.material.opacity =   0.0;
                            if( Number.isInteger(index)){
                              el.h.updateHTML('index', parseInt(index+1) +"/"+len + "<br/>"+timerObj[2] +" By, <br/> " );
                            }
                            YAHOO.util.Dom.setStyle("dummy","opacity",0.0);
                            currentObj.render(el);
                          }});
                      }else{
 
                        mesh.material.opacity = 1.0;
                        mesh.material.transparent = false;
                          if(textureData){
                            el.params.exposure  = 1.2;
                          }else{
 
                            el.params.exposure  = 1;
                          }
 
                        if(texture_mesh[0]){
                          el.scene.remove( el.t[0] );
 
                        }
                        el.h.updateHTML('index', parseInt(index + 1) +"/"+len + "<br/>"+timerObj[2] +"  By, <br/> " );
                        currentObj.render(el);
                        el.t[0] = mesh;
                      }
              //      }catch(error){
              //        debugger;
             //       }
 
                    //  clearInterval(timerObj[0]);
                    //  timerObj[0] =null;
                    // timerObj[0] = setInterval(set_aminte_pulse(params, t), 1);
          }
 
 
 
 
        switch(file_ext){
          case 'hdr':
             new el.RGBELoader()
              .setDataType( THREE.UnsignedByteType ) // alt: FloatType, HalfFloatType
              .load( filepath, setImage );
              break;
          default:
            el.THREE.ImageUtils.loadTexture(filepath, {}, setImage);
            break;
 
 
 
 
        }
 
      }
 
         slideShowClass.prototype.render = function(element) {
  
           element.renderer.toneMappingExposure = element.params.exposure;
  
           element.renderer.render( element.scene, element.camera );
  
        }
        slideShowClass.prototype.onWindowResize_P = function (eventObj,paramSet ){
          paramSet.instanceObj.onWindowResize(paramSet.el);
        }
        slideShowClass.prototype.onWindowResize = function(element){
 
          var aspect = window.innerWidth / window.innerHeight;
 
          var frustumHeight = camera.top - camera.bottom;
 
          element.camera.left = - frustumHeight * aspect / 2;
          element.camera.right = frustumHeight * aspect / 2;
 
          element.camera.updateProjectionMatrix();
 
          element.renderer.setSize( window.innerWidth -30, window.innerHeight-30 );
 
          this.render();
 
        }
 
      

