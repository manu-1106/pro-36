var dog,sadDog,happyDog, database,BedRoom,deadDog,dogVaccination;
var Garden,Happy,Injection,Lazy,LivingRoom,Milk,running,runningLeft;
var Vaccination,WashRoom,changeGameState,ReadGameState,foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj,database;

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
BedRoom=loadImage("Images/Bed Room.png")
Garden=loadImage("Images/Garden.png")
WashRoom=loadImage("Images/Wash Room.png")

}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  ReadGameState=database.ref('gameState')
  ReadGameState.on("value",function(data){
    gameState=data.val();
  });
  foodObj = new Food();
fedTime=database.ref('FeedTime')
fedTime.on("value",readStock);
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(addFoods);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

 
}

function draw() {
  background(46,139,87);
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.Garden();
  }else if(currentTime===(lastFed+2)){
    update("Sleeping");
    foodObj.BedRoom();
  }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.WashRoom();
 
  }else{
    update("Hungry");
    foodObj.display();
  }
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 

  fill(255,255,254);
  textSize(15);
  

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}