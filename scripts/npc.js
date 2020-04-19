
var defaultChar = new NPC('Dofault', 100, 10, 10, 10);
defaultChar.coin = {
	silver: 10,
	gold: 0
};
defaultChar.level = 10;
defaultChar.type = 'npc';
var jembut = new NPC('jembut', 100, 10, 10, 10);
var joni = new NPC('joni', 150, 10, 10, 10);
var bryan = new NPC('bryan', 200, 15, 15, 10);

function NPC(name, health, damage, stamina, speed){
	this.name = name;
	this.health = health;
	this.damage = damage;
	this.stamina = stamina;
	this.raw_speed = speed;
	this.speed = cspd(speed);
}

// convert inputed speed into milisecond
function cspd(speed){
	return 100/speed*100;
}