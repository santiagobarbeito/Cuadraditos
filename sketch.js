let tiempo_cambio=200;
matriz=[];
let lado=0;
let elemento=0;
let frecuencia=1;
let activar_cambio=0;
let j=0;
let note=0;
notas=[0,4,5,7,14,12,16,17,19,21,24,28,29,31,33,36,40,41,43,45,48,52,53,55,57,60,64,65,67,69,72,76];
let carrier; // este es el oscilador que escucharemos, la portadora
let modulator; // este oscilador modulará la frecuencia de la portadora
let modMaxDepth = 150;
let modMinDepth = -150;
let now=0;
let t=0;

class cuadradito{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.R=int(random(0,255));
    this.G=int(random(0,255));
    this.B=int(random(0,255));
  }
  /*diferencia_color(){
    this.dif_R=255-this.R;
    this.dif_G=255-this.R;
    this.dif_B=255-this.R;
  }
  pendiente_color(){
    this.R=this.R+(this.dif_R/tiempo_cambio);
    this.G=this.G+(this.dif_G/tiempo_cambio);
    this.B=this.B+(this.dif_B/tiempo_cambio);
  }
  cambiar_color(){
    this.diferencia_color();
    while (this.R<255 & this.G<255 & this.B<255){
      this.pendiente_color()
    }
  }
  */
  cambiar_color(){
    this.R=int(random(0,255));
    this.G=int(random(0,255));
    this.B=int(random(0,255));
    envelope.setRange(1, 0);
    envelope.play(carrier, 0, 0.1);
    note =notas[int(this.x*32/width)];
    let midiValue = note;
    let freqValue = midiToFreq(midiValue);
    carrier.freq(freqValue);
    modulator.freq((freqValue*(this.y*32/height)*7/31)-4)
    modulator.amp(random(modMinDepth, modMaxDepth));
    envelope.play(modulator, 0, 0.1);
    carrier.freq(modulator);
    now=millis()
    while (millis()-now<100){
      t=t+1;
    }
    
 }

  display(){
    noStroke();
    fill(this.R,this.G,this.B);
    rect(this.x,this.y,lado,lado);
  }
}

function setup() {
  createCanvas(windowHeight, windowHeight);
  lado=width/32;
  for (let i=0; i<1024; i++){
    matriz.push(new cuadradito((i%32)*lado,int(i/32)*lado))
  }

  carrier = new p5.Oscillator('sine');
  envelope = new p5.Env();
  envelope.setADSR(0.00, 0, 0, 0);
  envelope.setRange(1, 0);
  carrier.start(); // empezar a oscilar
  envelope.play(carrier, 0, 0.1);

  // prueba a cambiar el tipo a 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('sine');
  modulator.start();
  envelope.play(modulator, 0, 0.1);
  carrier.freq(modulator);
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

}

function draw() {
  background(255);
  for (let i = 0; i<matriz.length; i++){
    matriz[i].display()
  }
  if((frameCount%frecuencia<1) & activar_cambio<1){
    activar_cambio=1;
    elemento=int(random(0,32));
  }
  if (frameCount%5<1){
    if (activar_cambio==1){
      matriz[(elemento+(j*33))%1024].cambiar_color();
      j=j+1;
      if (j==31){
        activar_cambio=0;
        j=0;
        frecuencia = 1;
      }
    }
  }
}

