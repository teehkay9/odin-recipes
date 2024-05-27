// call Adlib.screenshotterEnd() on the last animation code.
// do not delete initAnimation function since this is the first function that will be called after initialization of defaultValues.
// if ever there is a video for this ad, you can use myVideo as the variable to play the video.
// sample tween codes:
// tween.to("#disclaimerWrapper", {opacity:0.99,duration: 1,ease: "power2.out"},"-=1");
// tween.set("#frame1HeadlineWrapper",{opacity:1})
let tween, isFirstClick = false, isSlideInProg = false;
const cHeight=creativeSize.split("x")[1], cWidth=creativeSize.split("x")[0], verticalPos=creativeSize.split("x")[1]/6;
let tickerInitVal = 454, tickerLength, tickerSlide, tickerDur;

function initAnimation() {
     // place all fluid elements before text resize and css attrib.
     // Remove <p class="Y3VzdG9t"> tag
     removeY3VzdG9t(["dateVariable","frame1Headline3","uiElement1","uiElement2","uiElement3","frame1Overlay","frame2Overlay","frame3Overlay","frame4Overlay","ctaColor1","customVariable","customVariable2","customVariable3","customVariable4","customVariable5","animationType","cssAttrib"]);
     initLayout(); // Initial Layout
     Adlib.textResize(); // This is optional if your build doesn't use text resize you can delete this
     Adlib.templateCSS(defaultValues.cssAttrib); // DO NOT DELETE THIS
     alignAdjust(); // Alignment Adjustment
     startAnimation();
}
function startAnimation() {  
     document.querySelector("#mainContent").style.opacity = 1;
     tween = gsap.timeline();
     // Slide Animations
     animateSlides();
}
function animateSlides() {
     // Set frame 1 content to opacity = 0
     tween.set("#content1",{opacity:0})
     // Frame 1
          .from("#content1",{ease:"power3.out",duration:1.5,rotation:0.1,force3D:true,y:verticalPos,
          onStart:()=>{
               if(defaultValues.RMK_condition_1==="Sale") gsap.to("#ticker1",{ease:"none",duration:tickerDur,rotation:0.01,force3D:true,left:tickerSlide});
          }})
          .to("#content1",{ease:"power3.out",duration:1.5,opacity:1,onComplete:takeScreenshot},"<+=0.1")
     // Frame 2-4
     for(var i = 2; i <= 4; i++) {
          if(defaultValues.animationType === "Slide Up") {
               (function (cIndex) {
                    // Frame Exit
                    tween.to(`#content${cIndex - 1}`,{ease:"power3.out",duration:1.5,rotation:0.1,force3D:true,y:-verticalPos}, "+=1.5")
                    // Frame Entry
                         .fromTo(`#frame${cIndex}`,{css:{clipPath:`polygon(0px ${cHeight}px, ${cWidth}px ${cHeight}px, ${cWidth}px ${cHeight}px, 0px ${cHeight}px)`}},{
                              ease:"power3.out",duration:1.5,css:{clipPath:`polygon(0px 0px, ${cWidth}px 0px, ${cWidth}px ${cHeight}px, 0px ${cHeight}px)`},
                              onStart:()=>{
                                   frameNum=cIndex;
                                   if(defaultValues[`RMK_condition_${cIndex}`]==="Sale") gsap.to(`#ticker${cIndex}`,{ease:"none",duration:tickerDur,rotation:0.01,left:tickerSlide,force3D:true});
                              }
                         }, "<+=0.1")
                         .from(`#content${cIndex}`,{ease:"power3.out",duration:1.5,rotation:0.1,force3D:true,y:verticalPos,
                              onComplete:()=>{ 
                                   takeScreenshot();
                                   if(cIndex==4) animationEnd();
                         }}, "<+=0.1")
               })(i);
          } else {
               (function (cIndex) {
                    // Frame Exit
                    tween.to(`#frame${cIndex - 1}`,{ease:"power3.out",duration:1.5,rotation:0.1,force3D:true,xPercent:-100,
                              onStart:()=>{ frameNum=cIndex; }
                         },"+=1.5")
                    // Frame Entry
                         .from(`#frame${cIndex}`,{ease:"power3.out",duration:1.5,rotation:0.1,force3D:true,xPercent:100,
                              onStart:()=>{
                                   if (defaultValues[`RMK_condition_${cIndex}`]==="Sale") gsap.to(`#ticker${cIndex}`,{ease:"none",duration:tickerDur,rotation:0.01,left:tickerSlide,force3D:true});
                              },
                              onComplete:()=>{ 
                                   takeScreenshot();
                                   if(cIndex==4) animationEnd();
                         }}, "<")
               })(i);
          }
     }
}
function animationEnd() {
     // call this function on the very end of the last animation.     
     // takeScreenshot();
     setTimeout(function() {adlibEnd();},1000);
}
function initLayout() {
     // Color Variable
     var logoNikeColor = hexSplit("uiElement1");
     var ctaColor = hexSplit("ctaColor1");
     // Ticker Color
     gsap.set([".sale_txt",".sale_percent"],{color: defaultValues.uiElement3});
     gsap.set(".logo_ticker",{fill:defaultValues.uiElement3});

     for(var i = 1; i <= 4; i++) {
          // Nike Logo Color
          gsap.set(`#logoNike${i}`,{fill:logoNikeColor[i-1]});
          // CTA Color
          gsap.set(`#ctaTxt${i}`,{background: ctaColor[i-1]});
          // Countdown Timer Color
          var cTColor = hexSplit(i===1?"customVariable":`customVariable${i}`);
          gsap.set(`#cDTCont${i}`,{border: `1px solid ${cTColor[0]}`});
          gsap.set(`#cDTCont${i} .time_cont`,{borderTop:`1px solid ${cTColor[0]}`});
          gsap.set(`#cDTCont${i} .time_txt`,{color: cTColor[2]});
          gsap.set(`#cDTCont${i} .time_num`,{color: cTColor[1],background: cTColor[0]});
          // Backgrounds Color 
          if(Adlib.isEmpty(defaultValues[`frame${i}Overlay`])) {
               gsap.set(`#frame${i}`,{background:`linear-gradient(96deg, ${defaultValues[`RMK_background_gradient_a_${i}`]} 0%, ${defaultValues[`RMK_background_gradient_b_${i}`]} 100%)`});
          } else {
               var bgColor = hexSplit(`frame${i}Overlay`);
               gsap.set(`#frame${i}`,{background:`linear-gradient(96deg, ${bgColor[0]} 0%, ${bgColor.length===1?bgColor[0]:bgColor[1]} 100%)`});
          }
          // Product Layout
          if(defaultValues[`RMK_model_type_${i}`] === "Apparel") { 
               gsap.set(`#fw${i}`,{display:"none"}); 
          } else {
               gsap.set(`#app${i}`,{display:"none"});
          }
          if(isAccented(i)) {
               document.querySelector(`#f${i}H`).classList.add("lh_125");
               document.getElementById(`promo${i}`).style.lineHeight = "1.2em";
               gsap.set(`#f${i}HCont`,{paddingTop:0,paddingBottom:6});
               gsap.set(`#f${i}H`,{width:132,maxHeight:64,fontSize:30});
               document.querySelector(`#f${i}HCont .logo_nike`).style.marginTop = "2px";
          }
          // Price Layout
          if(defaultValues[`RMK_condition_${i}`] === "New") {
               // New Layout
               gsap.set(`#priceSale${i}`,{display:"none"});

               // Promo Code Layout
               if(!Adlib.isEmpty(defaultValues.frame1Headline3)) {
                    gsap.set(`#promo${i}`,{display:"block"});
                    gsap.set([`#priceCont${i}`],{display:"none"});
                    gsap.set(`#f${i}Sub2`,{marginTop:4});

                    // Countdown Timer
                    if(!Adlib.isEmpty(defaultValues.dateVariable)) {
                         document.getElementById(`cDTCont${i}`).style.display = "flex";
                         document.getElementById(`subWrap${i}`).style.right = "156px";
                         document.getElementById(`ctaTxt${i}`).style.right = "18px";
                         if(defaultValues[`RMK_model_type_${i}`] === "Footwear") {
                              gsap.set(`#fw${i}`,{left:"270px",width:"120px"});
                              var secondFWImg = document.getElementById(`fw${i}`).querySelectorAll(".fw_imgs_cont");
                              secondFWImg[1].style.display = "none";
                         } else {
                              document.getElementById(`app${i}`).style.left = "227px";
                         }
                         startCountdown(defaultValues.dateVariable, i);
                    }
               } else {
                    gsap.set(`#f${i}Sub2`,{display:"none"});
               }
          } else {
               // Sale Layout
               gsap.set(`#ctaTxt${i}`,{display:"none"});
               gsap.set(`#f${i}Sub2`,{display:"none"});
               gsap.set(`#subWrap${i}`,{right:"102px",paddingTop:"0px"});
               gsap.set(`#app${i}`,{left:"217px"});
               gsap.set(`#fw${i}`,{left:"223px"});
               document.getElementById(`priceReg${i}`).classList.remove('font_hnbold');
               document.getElementById(`priceReg${i}`).classList.add('font_hnreg','strike');

               // Ticker
               gsap.set(`#ticker${i}`,{opacity:1,background:defaultValues.uiElement2});
          }
          // Footwear Images Zoom-in
          if(defaultValues[`RMK_product_gender_${i}`] === "YOUTH") {
               gsap.set([`#fW${i}Img1`,`#fW${i}Img2`],{scale:1.1});
          }
     }
     // Ticker Timer
     tickerLength=defaultValues.lockupHeadline.length - 4;
     tickerSlide = tickerLength > 0 ? `-${tickerInitVal+(34*tickerLength)}px` : `-${tickerInitVal}`;
     tickerDur = 6+(tickerLength/2);
}
// Hex split
function hexSplit(elem) { return defaultValues[elem].split(",").map(e=> { return e.trim(); }); }
// Alignment Adjustments
function alignAdjust() {
     for(var i=1; i<=4; i++) {
          if(!isAccented(i)) {
               if(document.getElementById(`f${i}H`).offsetHeight > 45) {
                    document.getElementById(`f${i}HCont`).style.paddingTop = "0px";
                    document.querySelector(`#f${i}HCont .logo_nike`).style.marginTop = "4px";
               }
          } else {
               if(document.getElementById(`f${i}H`).offsetHeight > 110) document.querySelector(`#f${i}HCont .logo_nike`).style.marginTop = "0px";
          }
     }
}
// Function for Ticker
function createTicker(num) {
     var tickerCont = document.getElementById(`ticker${num}`);
     // Loop to create and append 4 copies of the content
     for (var i = 1; i <= 4; i++) {
          // Create a new ticker element by cloning the original content
          var newTicker = document.createElement('div');
          newTicker.classList.add('ticker_div');
          newTicker.innerHTML = `
               <svg class="logo_ticker" viewBox="0 0 650 228"><use href="#logoPath"/></svg>
               <p id="saleTxt${num}-${i+1}" adlib-text="lockupHeadline" class="sale_txt font_nike"></p>
               <p id="salePer${num}-${i+1}" adlib-text="RMK_sale_percentage_${num}" class="sale_percent font_nike"></p>
          `;
          tickerCont.appendChild(newTicker);
     }
}
// Function for Countdown Timer
function startCountdown(dateVariable, num) {
     var countDownDate = new Date(dateVariable);
     var x = setInterval(function() {
          const deadline = countDownDate.getTime();
          const today = new Date().getTime();
          const total = deadline - today;

          if (total < 0 ) {
               clearInterval(x);
               x = null;
               document.getElementById(`cDTCont${num}`).style.display = "none";
               document.getElementById(`app${num}`).style.left = "191px";
               document.getElementById(`subWrap${num}`).style.right = "187px";
               document.getElementById(`ctaTxt${num}`).style.right = "44px";
               document.getElementById(`fw${num}`).style.cssText = "left:150px; width:240px;";
               document.getElementById(`fw${num}`).querySelectorAll(".fw_imgs_cont")[1].style.display = "flex";
          } else {
               const seconds = String(Math.floor((total / 1000) % 60));
               const minutes = String(Math.floor((total / 1000 / 60) % 60));
               const hours = String(Math.floor((total / (1000 * 60 * 60)) % 24));
               const days = String(Math.floor(total / (1000 * 60 * 60 * 24)));
               let dNum = hNum = "00";
               let metrics1,metrics2;

               if(days > 0) {
                    dNum = days.toString().padStart(2, '0');
                    hNum = hours.toString().padStart(2, '0');
                    metrics1 = "D";
                    metrics2 = "H";
               } else if(hours > 0) {
                    dNum = hours.toString().padStart(2, '0');
                    hNum = minutes.toString().padStart(2, '0');
                    metrics1 = "H";
                    metrics2 = "M";
               } else {
                    dNum = minutes.toString().padStart(2, '0');
                    hNum = seconds.toString().padStart(2, '0');
                    metrics1 = "M";
                    metrics2 = "S";
               }
               // Numbers change
               document.querySelector(`#cDTCont${num} .days p`).textContent = dNum;
               document.querySelector(`#cDTCont${num} .hours p`).textContent = hNum;
               // Metrics change
               document.querySelector(`#cDTCont${num} .metrics1 p`).textContent = metrics1;
               document.querySelector(`#cDTCont${num} .metrics2 p`).textContent = metrics2;
          }
     }, 41.666666666666667);
     // 41.666666666666667 is equivalent of 24 FPS
     // Avoid lowering the interval time, this will affect the browser performance.
}
// Function for Accented Language
function isAccented(num) {
     let accentedLang = ["nl-NL", "da-DK", "de-DE", "de-AT", "de-LU", "de-CH", "fr-FR", "fr-LU", "fr-BE", "fr-CH", "it-CH", "it-IT", "cs-CZ", "sv-SE", "pl-PL", "no-NO", "pt-PT", "es-ES", "ca-ES"],
         lang = [defaultValues.RMK_language_1, defaultValues.RMK_language_2, defaultValues.RMK_language_3, defaultValues.RMK_language_4],
         result = false;
     if (accentedLang.includes(defaultValues[`RMK_language_${num}`])) result = true;
     return result;
}
// Function to Remove <p class="Y3VzdG9t"> tag
function removeY3VzdG9t(elems) { elems.forEach((e) => { defaultValues[e] = defaultValues[e].replace(/<[^>]*>?/gm, ''); }); }