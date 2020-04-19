var hairs = ['Spike', 'Bald', 'Mohawk'];
var colors = ['Black', 'Red', 'Green', 'Blue'];

var app = new Vue({
el: '#app',
data: function(){
return {
	/* GAME CONFIG */
	dev: true,
	title: 'Simple Souls',
	environment: 'realm',
	dialogue: '',
	train: '',
	tutorial: false,
	tutorialEnd: true,
	blackLayer: false,
	mainMenuPopup: false,
	slot: null,
	mainMenuAlert: false,
	loading: true,
	battleStartCount: 3,
	countInterval: null,

	/* GAME DATABASES */
	hairs: hairs,
	colors: colors,
	battles: battles,
	environments: environments,
	dialogues: tutorial_dialogues,

	/* DEFAULT CHARACTER */
	char: defaultChar,
	
	npc: {
		tutorial: {
			name: 'Rùh'
		}
	},
	
	town: {
		name: 'Rootstock'
	},

	enemy_list: [
		{
			id: 1,
			name: 'Dummy Enemy',
			stats: {
				health: 50,
				right_hand_dmg: 6.00,
				left_hand_dmg: 6.00,
				block_chance: 5,
				blocked_dmg: 30,
				dodge_chance: 5,
				critical_chance: 3
			}
		}
	],

	selectedChar: {},
	selectedEnemy: {},
	selectedBattle: {},
	battleResult: {},
	battleLogs: ['*Battle Logs*']
}
},
mounted(){
	var self = this;

	// CHECK SAVED DATA
	if(localStorage.getItem('rootstock-brawler-data')){
		var slot = JSON.parse(localStorage.getItem('rootstock-brawler-data'));
		console.log('SAVED DATA: ', slot);
		self.slot = slot;
		defaultChar = slot.char;
		self.char = slot.char;
	}else{
		console.log('NO SAVED DATA');
		this.tutorial = true;
	}

	// dev only
	// this.selectedChar = JSON.parse(JSON.stringify(defaultChar));
	// this.selectedEnemy = JSON.parse(JSON.stringify(defaultEnemy));
	// this.selectedBattle = battles[0];

	// getReady(self.battleStartCount, self.countInterval, function(interval, ready){
	// 	if(ready){
	// 		self.renderHealthAndStamina(self.selectedChar, self.selectedEnemy);

	// 		clearInterval(interval);
	// 		startBrawling(self.selectedChar, self.selectedEnemy);
	// 	}
	// });
	// ---

	// CHECK TUTORIAL
	if(this.tutorial){
		this.disabledOther();
	}
	if(this.dialogue == 'train'){
		console.log(this.$refs.realm)
		this.$refs.realm.setAttribute('disabled', true);
	}else{
		this.$refs.realm.removeAttribute('disabled');
	}
	this.loading = false;	
},
methods: {
convertToPercent(current, max) {
	return current/max*100;
},
close() {
	this.blackLayer = false;
	this.mainMenuPopup = false;
	this.mainMenuAlert = false;
},
checkSlot() {
	if(this.slot){
		this.mainMenuAlert = true;
	}else{
		this.blackLayer = false;
		this.mainMenuPopup = false;
		this.environment = 'create-char';
		// this.newGame();
	}
},
newGame() {
	if(localStorage.getItem('rootstock-brawler-data')){
		localStorage.removeItem('rootstock-brawler-data');
		this.char = defaultChar;
		this.slot = {};
	}
	this.dialogue = 'prologue';
	this.tutorial = true;
	this.tutorialEnd = false;
	this.blackLayer = false;
	this.mainMenuPopup = false;
	this.mainMenuAlert = false;
	this.environment = null;

	this.saveGame();
},
continueGame() {
	console.log('game continued', this.slot);
	this.char = this.slot.char;
	this.environment = 'town';
	this.blackLayer = false;
	this.tutorial = false;
	this.mainMenuPopup = false;
},
random(min, max){
	return Math.floor(Math.random() * (max - min) + min);
},
createRandom() {
	this.char.hair.style = this.hairs[this.random(0, this.hairs.length)];
	this.char.hair.color = this.colors[this.random(0, this.colors.length)];
},
saveGame() {
	if(!this.tutorial){
		console.log('saving...')
		console.log(this.char)
		this.char.type = 'player';
		var data = {
			char: this.char
		};
		localStorage.setItem('rootstock-brawler-data', JSON.stringify(data));
		var local = localStorage.getItem('rootstock-brawler-data');
		console.log(JSON.parse(local));
		this.slot = JSON.parse(local);
		this.char = this.slot.char;
		this.selectedChar = this.slot.char;
	}else{
		console.log('still tutorial. not saved')
	}
},
showDialogue(dialogue) {
	if(dialogue!='battle-result'){
		this.tutorial = true;
	}
	this.blackLayer = true;
	this.dialogue = dialogue;
},
training(stat) {
	console.log('training '+stat)
	this.train = stat;
	this.environment = 'train-'+stat;
},
/* === BATTLE === */
match(battle) {
	var self = this;

	if(this.dialogue!='first-battle'){
		this.dialogue = '';
	}

	defaultEnemy = battle.enemy;

	this.environment = 'battle';
	this.selectedChar = JSON.parse(JSON.stringify(defaultChar));
	this.selectedEnemy = JSON.parse(JSON.stringify(defaultEnemy));
	this.selectedBattle = battle;

	console.log('start battle', this.selectedBattle, this.selectedChar, this.selectedEnemy);

	getReady(self.battleStartCount, self.countInterval, function(interval, ready){
		if(ready){
			self.renderHealthAndStamina(self.selectedChar, self.selectedEnemy);
			clearInterval(interval);
			startBrawling(self.selectedChar, self.selectedEnemy);
		}
	});
},
renderHealthAndStamina(char, enemy){
	var self = this;
	// console.log('render health and stamina', self.selectedEnemy.health, defaultEnemy.health)

	if(char && enemy){
		self.$refs.charStamina.setAttribute('style', 'height: '+
		self.convertToPercent(char.stamina, defaultChar.stamina)+'%');
		self.$refs.charHealth.setAttribute('style', 'height: '+
		self.convertToPercent(char.health, defaultChar.health)+'%');

		self.$refs.enemyStamina.setAttribute('style', 'height: '+
		self.convertToPercent(enemy.stamina, defaultEnemy.stamina)+'%');
		self.$refs.enemyHealth.setAttribute('style', 'height: '+
		self.convertToPercent(enemy.health, defaultEnemy.health)+'%');
	}else if(char == 'reset'){
		console.log('RESET BAR');
		self.$refs.charStamina.setAttribute('style', 'height: 100%');
		self.$refs.charHealth.setAttribute('style', 'height: 100%');
		self.$refs.enemyStamina.setAttribute('style', 'height: 100%');
		self.$refs.enemyHealth.setAttribute('style', 'height: 100%');
		console.log(self.$refs.enemyHealth, self.$refs.enemyStamina)
	}else{
		console.log('NOT DEFINED')
	}
},
handleBattleResult(result){
	var self = this;
	console.log('battle over. result: ', result);

	self.blackLayer = true;
	setTimeout(function(){
		if(self.tutorial && !self.tutorialEnd && result.winner.name != self.selectedChar.name){
			self.dialogue = 'first-training';
		}else{
			self.dialogue = 'battle-result';
			self.battleResult = result;
		}
	}, 1000);
},
resetBattle() {
	var self = this;
	console.log('RESET BATTLE');
	self.battleStartCount = 3;
	self.selectedChar = defaultChar;
	self.selectedEnemy = defaultEnemy;
	self.selectedBattle = null;
	self.battleResult = null;
	self.battleLogs = ['*Battle Logs*']
	self.renderHealthAndStamina('reset');
},
disabledOther() {
	this.$refs.defense.setAttribute('disabled', true);
	this.$refs.quickness.setAttribute('disabled', true);
	this.$refs.accuracy.setAttribute('disabled', true);
	this.$refs.critical.setAttribute('disabled', true);
},
enableOther() {
	this.$refs.defense.removeAttribute('disabled');
	this.$refs.quickness.removeAttribute('disabled');
	this.$refs.accuracy.removeAttribute('disabled');
	this.$refs.critical.removeAttribute('disabled');
	this.$refs.hermitage.removeAttribute('disabled');
	this.$refs.shop.removeAttribute('disabled');
	this.$refs.tattoo.removeAttribute('disabled');
},
},
watch: {
environment() {
	var self = this;
	if(this.tutorial){
		this.$refs.hermitage.setAttribute('disabled', true);
		this.$refs.shop.setAttribute('disabled', true);
		this.$refs.tattoo.setAttribute('disabled', true);
	}else{
		this.enableOther();
	}
	console.log(this.environment)
	if(this.environment == 'town'){
		self.saveGame();
	}
},
dialogue() {
	console.log(this.dialogue)
	if(this.dialogue == 'first-training'){
		console.log(this.$refs.realm)
		this.$refs.realm.setAttribute('disabled', true);
	}else if(this.dialogue == 'second-battle'){
		this.$refs.training.setAttribute('disabled', true);
	}
	else{
		this.$refs.training.removeAttribute('disabled');
		this.$refs.realm.removeAttribute('disabled');
	}
},
tutorial() {
	if(this.tutorial){
		this.disabledOther();
	}else{
		this.enableOther();
	}
},
tutorialEnd() {
	this.saveGame();
},
battleLogs() {
	// console.dir(this.$refs.battleLog)
	this.$refs.battleLog.scrollTop = this.$refs.battleLog.scrollHeight;
}
}
});