  function panoSlideShow(THREE, FileReader, initOptions){
  
    this.element = {};
    
    this.element.bit = 1;
    this.element.n = 0;
    this.element.container = document.getElementById( 'container' );
    this.element.index = initOptions.listIndex;
    this.element.setsOflists = initOptions.setsOflists;
    this.element.interval = initOptions.interval;
    this.element.indexId = initOptions.indexId;
    this.element.title = initOptions.title; 
    this.element.pbtnId = initOptions.pbtnId;
    this.element.playBtnImage = initOptions.playBtnImage;
    this.element.pauseBtnImage = initOptions.pauseBtnImage;
    this.element.THREE = THREE;
    this.element.FileReader = FileReader;
    this.element.showIds= initOptions.showIds;
    this.element.backId= initOptions.backId;
    this.element.forwardId= initOptions.forwardId;
    this.element.oldN = 0;
    this.element.runningFlag = "done";
    
    this.element.isUserInteracting = false;
    this.element.onMouseDownMouseX = 0;
    this.element.onMouseDownMouseY = 0;
    this.element.lon = 0;
    this.element.onMouseDownLon = 0;
    this.element.lat = 0
    this.element.onMouseDownLat = 0;
    this.element.phi = 0;
    this.element.theta = 0;

    this.inti(THREE);
    this.animate();
    this.change_image(this.element.THREE, this.element.setsOflists[this.element.index].list[this.element.n]);
    new helperClass().updateHTML(this.element.indexId, parseInt(this.element.n +1) +"/"+
                                this.element.setsOflists[this.element.index].list.length + " "+
                                this.element.setsOflists[this.element.index].title )

    this.timedRunShow();
    //  setTimeout(this.change_image_P('./Panos/carmel panos/JPG 12000/Untitled_Panorama2_1.jpg'), 5000);


  }
  
  
  panoSlideShow.prototype.inti = function(THREE){
  
    this.element.camera        = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    this.element.scene         = new THREE.Scene();
    this.element.renderer      = new THREE.WebGLRenderer();
    this.element.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.element.geometry      = new THREE.SphereBufferGeometry( 500, 60, 40 );
    this.element.geometry.scale( - 1, 1, 1 );
  
    this.element.renderer.setPixelRatio( window.devicePixelRatio );
    this.element.renderer.setSize( window.innerWidth, window.innerHeight );
    this.element.container.appendChild( this.element.renderer.domElement );
    
    document.addEventListener( 'touchmove',  this.onPointerMove_C(), false ); 
    document.addEventListener( 'touchstart', this.onPointerStart_C(), false );
    document.addEventListener( 'mousemove',  this.onPointerMove_C(), false );
    document.addEventListener( 'mousedown',  this.onPointerStart_C(), false ); 
    
    
    YAHOO.util.Event.addListener(document, 'mouseup',   this.onPointerUp_P, this);
    YAHOO.util.Event.addListener(document, 'wheel',     this.onDocumentMouseWheel_P, this);
    YAHOO.util.Event.addListener(document, 'touchend',  this.onPointerUp_P, this);
    YAHOO.util.Event.addListener(document, 'dragover',  this.dragover, this);
    YAHOO.util.Event.addListener(document, 'dragenter', this.dragenter, this);
    YAHOO.util.Event.addListener(document, 'dragleave', this.dragleave, this);
    YAHOO.util.Event.addListener(document, 'dragenter', this.dragenter_P, this);
    YAHOO.util.Event.addListener(document, 'drop',      this.drop_P, this);
    YAHOO.util.Event.addListener(window,   'resize',    this.onWindowResize_P, this);
    YAHOO.util.Event.addListener(this.element.pbtnId, 'click', this.toggleShow_P() );
    YAHOO.util.Event.addListener(this.element.showIds, 'click', this.changeToDifferentShow_P, this);
    YAHOO.util.Event.addListener(this.element.backId, 'click', this.changeImageNow_P, this);
    YAHOO.util.Event.addListener(this.element.forwardId, 'click', this.changeImageNow_P, this);
          
          
  }
  
   
  panoSlideShow.prototype.changeToDifferentShow_P = function(eventObj, instanceObj){
    instanceObj.changeToDifferentShow(eventObj);
  }
   
  panoSlideShow.prototype.changeToDifferentShow = function(eventObj){
    clearTimeout(this.element.timer);
    this.element.index = parseInt(YAHOO.util.Event.getTarget(eventObj).id.split("_")[1]);
    this.element.n =0;
     this.change_image(this.element.THREE, this.element.setsOflists[this.element.index].list[this.element.n]);
      new helperClass().updateHTML(this.element.indexId, parseInt(this.element.n +1) +"/"+
                                   this.element.setsOflists[this.element.index].list.length + " "+
                                   this.element.setsOflists[this.element.index].title );
     this.timedRunShow();
    
    
    
    
  }
  
  
  
     
    panoSlideShow.prototype.changeImageNow_P = function(eventObj, instanceObj){
      instanceObj.changeImageNow(eventObj);
    }
     
    panoSlideShow.prototype.changeImageNow = function(eventObj){
      if( this.element.runningFlag == "done"){
        clearTimeout(this.element.timer);
        var btnId =YAHOO.util.Event.getTarget(eventObj).id;
        this.element.n = this.element.oldN;

        if(btnId == this.element.forwardId){
          if( (this.element.n+1) >= this.element.setsOflists[this.element.index].list.length){
              this.element.n = 0;
          }else{
            this.element.n++;
          }
        }else{
          if( (this.element.n-1) <= 0){
              this.element.n = (this.element.setsOflists[this.element.index].list.length -1);
          }else{
              this.element.n--;
            }

        }
         this.change_image(this.element.THREE, this.element.setsOflists[this.element.index].list[this.element.n]);
          new helperClass().updateHTML(this.element.indexId, parseInt(this.element.n +1) +"/"+
                                       this.element.setsOflists[this.element.index].list.length + " "+
                                       this.element.setsOflists[this.element.index].title + " by " );
         this.timedRunShow();
      }
      
      
      
    }
    
  
   
        panoSlideShow.prototype.toggleShow_P = function(){
          var instanceObj = this;
          return function(){
               instanceObj.toggleShow();
          }
        }
        panoSlideShow.prototype.toggleShow = function(){
          if(this.element.bit){
             this.changeImageSrc(this.element.pbtnId, this.element.playBtnImage);
             clearTimeout(this.element.timer);
             this.element.bit = 0 ;
           }else{
             this.element.bit = 1 ;
            this.change_image(this.element.THREE, this.element.setsOflists[this.element.index].list[this.element.n]);
             new helperClass().updateHTML(this.element.indexId, parseInt(this.element.n +1) +"/"+
                                          this.element.setsOflists[this.element.index].list.length + " "+
                                          this.element.setsOflists[this.element.index].title + " by " )
            this.changeImageSrc(this.element.pbtnId,this.element.pauseBtnImage);
            clearTimeout(this.element.timer);
            this.timedRunShow();
          }
    
        }
   
   
    panoSlideShow.prototype.changeImageSrc = function(id,src){
       var domObj = document.getElementById(id);
       if(domObj){
         domObj.src = src;
       }
       new helperClass().deleteDomElement(domObj);
       domObj = null;
}
   
   panoSlideShow.prototype.timedRunShow = function(){
      if(this.element.bit){
        if(this.element.setsOflists[this.element.index].list){
         this.element.timer = setTimeout(this.timedRunShow_c(),this.element.interval);
        }
      }
    }
    
 panoSlideShow.prototype.timedRunShow_c = function(){
  var instanceObj = this;
  return function(){
      if(instanceObj.element.bit){
        
        if(instanceObj.element.n !== (1 + instanceObj.element.oldN)){
          if((instanceObj.element.oldN +1) >= instanceObj.element.setsOflists[instanceObj.element.index].list.length){
            instanceObj.element.n =0;
          }else{
            instanceObj.element.n =instanceObj.element.oldN +1;
          }
        }
        
        instanceObj.change_image(instanceObj.element.THREE, instanceObj.element.setsOflists[instanceObj.element.index].list[instanceObj.element.n]);
        new helperClass().updateHTML(instanceObj.element.indexId, parseInt(instanceObj.element.n +1) +"/"+instanceObj.element.setsOflists[instanceObj.element.index].list.length + " "+instanceObj.element.setsOflists[instanceObj.element.index].title+ " by " );
        
        if( (instanceObj.element.n+1) >= instanceObj.element.setsOflists[instanceObj.element.index].list.length){
            instanceObj.element.n = 0;
        }else{
          instanceObj.element.n++;
        }
        instanceObj.timedRunShow();
        
      }else{
        iElement.n--;
      }
    }
  
 }
    
  
  
  panoSlideShow.prototype.change_image_P = function(oFilname){
    var instanceObj = this, f = oFilname;
    return function(){
      instanceObj.change_image(instanceObj.element.THREE, f);
    }
  }
  
  panoSlideShow.prototype.change_image = function(THREE, oFilename){
          this.element.textureNew = new THREE.TextureLoader().load( oFilename, 
                                                                    this.imageLoadedOnComplete_C(), 
                                                                    this.imageLoadedOnProgress_C(), 
                                                                    this.imageLoadedOnError_C() );
          this.element.materialNew = new THREE.MeshBasicMaterial( { map:  this.element.textureNew } );
          this.element.meshNew = new THREE.Mesh( this.element.geometry, this.element.materialNew );
          if( this.element.mesh){
            this.element.mesh.material.transparent =   true;
            this.element.mesh.material.opacity =   1.0;
          }
            this.element.meshNew.transparent = true;
            this.element.meshNew.material.transparent =   true;
            this.element.meshNew.material.opacity =   0.0;
        this.element.scene.add( this.element.meshNew );
            this.element.meshNew.material.transparent =   true;
            this.element.meshNew.material.opacity =   0.0;
        this.element.oldN = this.element.n;
          
  }
  panoSlideShow.prototype.imageLoadedOnProgress_C = function(){
   var instanceObj = this;
   return function(){;
          if( instanceObj.element.mesh){
            instanceObj.element.mesh.material.transparent =   true;
            instanceObj.element.mesh.material.opacity =   1.0;
          }
            instanceObj.element.meshNew.transparent = true;
            instanceObj.element.meshNew.material.transparent =   true;
            instanceObj.element.meshNew.material.opacity =   0.0;
   }
  }
  panoSlideShow.prototype.imageLoadedOnError_C = function(){
   var instanceObj = this;
   return function(){;
          if( instanceObj.element.mesh){
            instanceObj.element.mesh.material.transparent =   true;
            instanceObj.element.mesh.material.opacity =   1.0;
          }
            instanceObj.element.meshNew.transparent = true;
            instanceObj.element.meshNew.material.transparent =   true;
            instanceObj.element.meshNew.material.opacity =   0.0;
   }
  }
  
  panoSlideShow.prototype.imageLoadedOnComplete_C = function(){
   var instanceObj = this;
   return function(){;
      instanceObj.imageLoadedOnCompleteCrossFade();
   }
  }
  panoSlideShow.prototype.imageLoadedOnCompleteFadeOutThenIn = function(){
      var instanceObj = this;
      
      instanceObj.element.runningFlag = "";
        
         new helperClass().fadeAnimation({run: true, seconds:3,
          obj:"dummy2",
          start:1.0,
          finish: 0.0,
        onTween:function(obj1,obj2,obj3){
            if(instanceObj.element.mesh){
              instanceObj.element.mesh.material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy2","opacity"));
               instanceObj.element.renderer.render(  instanceObj.element.element.scene,  instanceObj.element.camera );
            }
          },
          onComplete:function(){
            
                   new helperClass().fadeAnimation({run: true, seconds:3,
                    obj:"dummy",
                    start:0.0,
                    finish: 1.0,
                    onTween:function(obj1,obj2,obj3){
                        instanceObj.element.meshNew.material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy","opacity"));
                       instanceObj.element.renderer.render(  instanceObj.element.element.scene,  instanceObj.element.camera );
                    },
                      onComplete:function(){
                          if(instanceObj.element.mesh){
                            instanceObj.element.material.dispose();
                            instanceObj.element.scene.remove( instanceObj.element.mesh );       
                          }
                          instanceObj.element.texture = instanceObj.element.textureNew;
                          instanceObj.element.material = instanceObj.element.materialNew;
                          instanceObj.element.mesh = instanceObj.element.meshNew;
                           instanceObj.element.textureNew = null;
                           instanceObj.element.materialNew = null;
                           instanceObj.element.meshNew = null;
                           
                 
                        instanceObj.element.mesh.material.opacity = 1.0;
                        instanceObj.element.runningFlag = "done";
                        instanceObj.element.renderer.render(  instanceObj.element.element.scene,  instanceObj.element.camera );
                      },
                    onStart: function(){
                      instanceObj.element.renderer.render(  instanceObj.element.element.scene,  instanceObj.element.camera );
                  }});
  
  
          },
          onStart: function(){
            instanceObj.element.runningFlag = "";
            instanceObj.element.mesh.opacity = 1.0;
            instanceObj.element.mesh.material.transparent =   true;
            instanceObj.element.mesh.transparent = true;
            instanceObj.element.mesh.material.opacity =   1.0;
            instanceObj.element.meshNew.material.transparent = true;
            instanceObj.element.meshNew.material.opacity =   0.0;
            YAHOO.util.Dom.setStyle("dummy2","opacity",1.0);
            YAHOO.util.Dom.setStyle("dummy","opacity",0.0);
          }});
      
   
  
  }
  
  
  panoSlideShow.prototype.imageLoadedOnCompleteCrossFade = function(){
      var instanceObj = this;
        
         new helperClass().fadeAnimation({run: true, seconds:3,
          obj:"dummy2",
          start:1.0,
          finish: 0.0,
          onComplete:function(){
            instanceObj.element.runningFlag= "done";
          },
          onStart: function(){
            instanceObj.element.runningFlag = "";
            instanceObj.element.mesh.opacity = 1.0;
            instanceObj.element.mesh.material.transparent =   true;
            instanceObj.element.mesh.transparent = true;
            instanceObj.element.mesh.material.opacity =   1.0;
            instanceObj.element.meshNew.material.transparent = true;
            instanceObj.element.meshNew.material.opacity =   0.0;
            YAHOO.util.Dom.setStyle("dummy2","opacity",1.0);
            YAHOO.util.Dom.setStyle("dummy","opacity",0.0);
          }});
      
   
       new helperClass().fadeAnimation({run: true, seconds:3,
        obj:"dummy",
        start:0.0,
        finish: 1.0,
        onTween:function(obj1,obj2,obj3){
          if(instanceObj.element.runningFlag !== "done"){
            if(instanceObj.element.mesh){
              instanceObj.element.mesh.material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy2","opacity"));
            }
            instanceObj.element.meshNew.material.opacity =  parseFloat(YAHOO.util.Dom.getStyle("dummy","opacity"));
            instanceObj.element.renderer.render(  instanceObj.element.element.scene,  instanceObj.element.camera );
          }
        },
          onComplete:function(){
              if(instanceObj.element.mesh){
                instanceObj.element.material.dispose();
                instanceObj.element.scene.remove( instanceObj.element.mesh );       
              }
              instanceObj.element.texture = instanceObj.element.textureNew;
              instanceObj.element.material = instanceObj.element.materialNew;
              instanceObj.element.mesh = instanceObj.element.meshNew;
               instanceObj.element.textureNew = null;
               instanceObj.element.materialNew = null;
               instanceObj.element.meshNew = null;
               
     
            instanceObj.element.mesh.material.opacity = 1.0;
            instanceObj.element.runningFlag = "done";
             instanceObj.element.renderer.render(  instanceObj.element.element.scene,  instanceObj.element.camera );
          },
        onStart: function(){
          instanceObj.element.renderer.render(  instanceObj.element.element.scene,  instanceObj.element.camera );
      }});
  
  
  }
  
  
  
  
  
          panoSlideShow.prototype.dragover = function ( event ) {
  
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
  
          }
          panoSlideShow.prototype.dragenter = function () {
          
                    document.body.style.opacity = 0.5;
          
          }
          panoSlideShow.prototype.dragleave = function () {
          
                    document.body.style.opacity = 1;
          
          }
          panoSlideShow.prototype.loader_C = function () {
            
            var instanceObj = this;
            return function(event){
              instanceObj.loader(event);
            }
          }
          panoSlideShow.prototype.loader = function ( event ) {
            
              this.element.material.map.image.src = event.target.result;
             this.element.material.map.needsUpdate = true;
            
            }
          panoSlideShow.prototype.drop_P = function ( event, instanceObj ) {
            instanceObj.dragleave(event);
          }
            
          panoSlideShow.prototype.drop = function ( event ) {
  
            event.preventDefault();
  
            var reader = new this.element.FileReader();
            reader.addEventListener( 'load',this.loader_C(), false );
            reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
  
            document.body.style.opacity = 1;
  
        }
        panoSlideShow.prototype.onWindowResize_P = function ( event, instanceObj ) {
            instanceObj.onWindowResize(event);
        }
        
       panoSlideShow.prototype.onWindowResize= function() {

        this.element.camera.aspect = window.innerWidth / window.innerHeight;
        this.element.camera.updateProjectionMatrix();

        this.element.renderer.setSize( window.innerWidth, window.innerHeight );

      }
        panoSlideShow.prototype.onPointerStart_P = function ( event ,instanceObj) {
            instanceObj.onPointerStart(event);
        }
        panoSlideShow.prototype.onPointerStart_C = function ( ) {
            var instanceObj = this;
            return function(event){
              instanceObj.onPointerStart(event);
            }
        }
        

       panoSlideShow.prototype.onPointerStart= function( event ) {

        this.element.isUserInteracting = true;

        var clientX = event.clientX || event.touches[ 0 ].clientX;
        var clientY = event.clientY || event.touches[ 0 ].clientY;

        this.element.onMouseDownMouseX = clientX;
        this.element.onMouseDownMouseY = clientY;

        this.element.onMouseDownLon = this.element.lon;
        this.element.onMouseDownLat = this.element.lat;

      }
        panoSlideShow.prototype.onPointerMove_P = function ( event, instanceObj ) {
            instanceObj.onPointerMove(event);
        }
        panoSlideShow.prototype.onPointerMove_C = function ( ) {
            var instanceObj = this;
            return function(event){
              instanceObj.onPointerMove(event);
            }
        }
        

       panoSlideShow.prototype.onPointerMove= function( event ) {

        if ( this.element.isUserInteracting === true ) {

          var clientX = event.clientX || event.touches[ 0 ].clientX;
          var clientY = event.clientY || event.touches[ 0 ].clientY;

          this.element.lon = ( this.element.onMouseDownMouseX - clientX ) * 0.1 + this.element.onMouseDownLon;
          this.element.lat = ( clientY - this.element.onMouseDownMouseY ) * 0.1 + this.element.onMouseDownLat;

        }

      }
        panoSlideShow.prototype.onPointerUp_P = function ( event, instanceObj ) {
            instanceObj.onPointerUp(event);
        }
        

       panoSlideShow.prototype.onPointerUp= function() {

        this.element.isUserInteracting = false;

      }
        panoSlideShow.prototype.onDocumentMouseWheel_P = function ( event, instanceObj ) {
            instanceObj.onDocumentMouseWheel(event, instanceObj.element.THREE);
        }
        


       panoSlideShow.prototype.onDocumentMouseWheel= function( event, THREE) {

        var fov = this.element.camera.fov + event.deltaY * 0.05;

        this.element.camera.fov = THREE.Math.clamp( fov, 10, 75 );

        this.element.camera.updateProjectionMatrix();

      }
        panoSlideShow.prototype.animate_P = function (  ) {
        var instanceObj = this;
          return function(){
              instanceObj.animate();
          }
        }

       panoSlideShow.prototype.animate= function() {

        requestAnimationFrame( this.animate_P() );
        this.update(this.element.THREE);

      }

       panoSlideShow.prototype.update= function(THREE) {

        if ( this.element.isUserInteracting === false ) {

          this.element.lon += 0.1;

        }

        var lat = Math.max( - 85, Math.min( 85, this.element.lat ) );
        var phi = THREE.Math.degToRad( 90 - lat );
        var theta = THREE.Math.degToRad( this.element.lon );

         this.element.camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
         this.element.camera.target.y = 500 * Math.cos( phi );
         this.element.camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

        this.element.camera.lookAt( this.element.camera.target );

        /*
        // distortion
        camera.position.copy( camera.target ).negate();
        */

         this.element.renderer.render( this.element.scene, this.element.camera );

      }