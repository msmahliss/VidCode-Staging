
$( document ).ready(function() {

  $('.learnMore').hide();

    var delay=1000//1 seconds
    setTimeout(function(){
var media = document.getElementById('myvideo');
    seriously = new Seriously(),
    video = seriously.source('#myvideo'), // get video element by CSS selector
    target = seriously.target('#canvas'), // output canvas
    effects = {
    vignette: seriously.effect('vignette'),
    blur: seriously.effect('blur'),
    filmgrain: seriously.effect('filmgrain')
    };
var active_film = active_blur = active_vig = 0;
effects.vignette.source = video;
effects.blur.source = effects.vignette;
effects.filmgrain.source = effects.blur;
effects.filmgrain.amount = effects.blur.amount = effects.vignette.amount = 0;
target.source = effects.filmgrain;

seriously.go();

   $(".runbtn").text(media.paused ? "Play" : "Pause");

        var editor_text = 
"\
  \n\
  function showEffect() {\n\
    movie.play();\n\
    movie.interval(1000, blackAndWhiteProcessing);\n\
  }\n\
  \n\
  effects = {\n\
      blur: seriously.effect('blur'),\n\
      vignette: seriously.effect('vignette'),\n\
      filmgrain: seriously.effect('filmgrain')\n\
      };\n\
    ";

            var glossary = {
                'function':
'In vidcode, a function is a block of code which executes a certain behavior.\
 * You can \"call\" on a function to complete its behavior in other parts of your code (and as many times as you want).\
 * Our vidcode has 3 functions: pixelate(), blackandWhiteProcessing(), and scrubProcessing().',
                'play' :
' * \"Play\" is a function which can be applied to an object.  In our code the object is \"movie\".\
 * To apply a function to an object you place it directly after the object with a period in between.',
                'foreach' :
' * foreach allows you to cycle through all the pixels in your video.  The computer reads each of your pixels in list form (a really loooong list), then paints them on the screen.  This is the secret to video processing!',
                'effects' :
' * effects is an object that contains information about each filter you add to your video.'
            };

            var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codemirror'),  {
                  value: "function myScript(){return 100;}\n",
                  mode:  "javascript",
                  theme: "solarized light",
                  lineWrapping: true,
                  lineNumbers: true
                });

            function GetScrubVals(){

            $(".cm-keyword:contains('function')")
                .addClass('vc-glossary')
                .attr('title', glossary.function)
                .data('toggle', 'tooltip')
                .data('placement', 'bottom')
                .tooltip();

            $(".cm-variable:contains('foreach')")
                .addClass('vc-glossary')
                .attr('title', glossary.foreach)
                .data('toggle', 'tooltip')
                .data('placement', 'bottom')
                .tooltip();

            $(".cm-variable:contains('pixelate()')")
                .addClass('vc-glossary')
                .attr('title', 'This is a method or function, same thing.')
                .data('toggle', 'tooltip')
                .data('placement', 'right')
                .tooltip();

            $(".cm-variable:contains('effects')")
                .addClass('vc-glossary')
                .attr('title', glossary.effects)
                .data('toggle', 'tooltip')
                .data('placement', 'right')
                .tooltip();

            $("pre:contains('effects.filmgrain.amount')")
                .addClass('scrub-film');            

                console.log("got this far");

            $("pre:contains('effects.blur.amount')")
                .addClass('scrub-blur');  

            $("pre:contains('effects.vignette.amount')")
                .addClass('scrub-vig');

            $(".scrub-film").find('.cm-number').attr('id','num-film'); 
            $(".scrub-blur").find('.cm-number').attr('id','num-blur');
            $(".scrub-vig").find('.cm-number').attr('id','num-vig');  
            
              var matches = document.querySelectorAll(".cm-number");
              
              for (var i = 0; i < matches.length; i++)
              {
                var match = matches[i];
                new Scrubbing ( 
                  match, {adapter: VigArr, driver : [ Scrubbing.driver.Mouse,
                   Scrubbing.driver.MouseWheel,
                   Scrubbing.driver.Touch
                   ]});
                 if ($(match).attr('id')=='num-film'){
                  effects.filmgrain.amount = parseInt($('#num-film').text())/10;
                 } else if ($(match).attr('id')=='num-blur'){
                  effects.blur.amount = parseInt($('#num-blur').text())/100;
                 }else if ($(match).attr('id')=='num-vig'){
                  effects.vignette.amount = Math.round(parseInt($('#num-vig').text()));              
              }
            }



            }


 $("#image").hover($('#greeting').modal());


  $(".runbtn btn btn-danger pullRight hidden").hover(function () { 
  $('#code').modal()
  });

//$("#play").hover($('#pause').modal());

//$("#image").hover($('#greeting').modal());

var VigArr = {

    init : function ( element ) {
      element.node.dataset.value =  4;
    },
  
    start : function ( element ){  
      return parseInt ( element.node.dataset.value, 10 );
    }, 
    
    change : function ( element, valin ) { 
      // valout = valin > 0 ? valin : 0;
      valout = Math.floor(valin/20);
      element.node.dataset.value = valout;
      element.node.textContent = valout;
      if ((valin>=0)&&(valin%20)==0) {GetScrubVals()};
    },
    
    end : function () {}
}; 

    $(".tabs-2").droppable({
        drop: function( event, ui ) {

          if(ui.draggable.attr("id") =="filmdrag"){
            if (active_film) {
            active_film = 0;
            ui.draggable.text("Film Grain");
            ui.draggable.css("background-color","#319665");
            effects.filmgrain.amount = 0;
            $(".scrub-film").remove();
          } else{
            active_film = 1;          
            myCodeMirror.setValue( editor_text + '\n\    effects.filmgrain.amount = 0;');
            ui.draggable.text("Remove Film Grain");
            ui.draggable.css("background-color","red");
            GetScrubVals();
            $( ".scrub-film" ).effect("highlight",2000);
          }
          } else if (ui.draggable.attr("id") =="blurdrag"){
            $( ".scrub-blur" ).effect("highlight",2000);
                // myCodeMirror.setSelection(CodeMirror.Pos(12,0),CodeMirror.Pos(13,0))
          } else if(ui.draggable.attr("id") =="vigdrag"){
            $( ".scrub-vig" ).effect("highlight",2000);
                // myCodeMirror.setSelection(CodeMirror.Pos(13,0),CodeMirror.Pos(14,0))
          }           
        }
});

    $( "#filmdrag" ).draggable({
       helper: "clone",
       revert: "invalid"
    });

    $( "#vigdrag" ).draggable({
      helper: "clone",
      revert: "invalid",
    });

    $( "#blurdrag" ).draggable({
      helper: "clone",
      revert: "invalid"
    });

    $( "#expdrag" ).draggable({
      connectToSortable: "#sortable",
      helper: "clone",
      revert: "invalid",
      stop: function( event, ui ) {
        // editor.setValue(editor_text);
      }
    });


    $(".tab2").click(function(){
        $(".tabs-2").removeClass("hidden");
    });

    $(".tab1").click(function(){
        $(".tabs-1").removeClass("hidden");
        $(".tabs-2").addClass("hidden");
    });

    $(".layer1").click(function(){
        $(".displaysecond").animate({
            "margin-left": 0}, "ease", function(){
                $(".displayfirst").addClass("hidden2");
            });
        $(".tabs-1").removeClass("hidden");
    });

    $(".uploadfirst").click(function(){
        $(".popup").removeClass("hidden");
    });

    $(".uploadbtn").click(function(){
        $(".popup").addClass("hidden");
        $(".video2").removeClass("hidden");
        $(".uploadfirst").addClass("hidden");
        $(".clearHover").addClass("hidden");
        $(".buttons").addClass("hidden");
        $(".runbtn").removeClass("hidden");
    });

    $(".runbtn").click(function(){
        $(".video2").removeClass("hidden");
        $(".buttons").addClass("hidden");
         if (media.paused) {
          media.play();
          $(this).text('Pause');
        } else {
          media.pause();
          $(this).text('Play');
      }
    });

    $('.switchlearn').click(function(){
      $('.switchlearn').removeClass('active');
      $('.switcheffect').addClass('active');
      $('.methods').hide();
      $('.learnMore').fadeIn();
    });

    $('.switcheffect').click(function(){
      $('.switcheffect').removeClass('active');
      $('.switchlearn').addClass('active');
      $('.learnMore').hide();
      $('.methods').fadeIn();
    });

    $('.arrowli').click(function(){
      var img = $(this).find("img")
      if( $(this).hasClass('active') ){
        $(this).next().fadeOut();
        $(this).removeClass('active');
        img.attr("src","img/btnright.png");
      }
      else{
        $(this).next().fadeIn();
        $(this).addClass('active');
        img.attr("src","img/btndown.png");
      }
    });


    $( "ul, li" ).disableSelection();
    GetScrubVals();
       },delay)
});
