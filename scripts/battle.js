// config
var battleStartCount = 3;
var countInterval;
var autoAttackInterval;
var battleLog = {
	punch: {
		left: 0,
		right: 0
	}
};

// Start
function getReady(count, interval, callback){
	interval = setInterval(function(){
		count--;
		if(count<=0){
			callback(interval, true);
		}else{
			callback(interval, false);
		}
		app.battleStartCount = count;
		console.log('count: ', count)
		// document.getElementById('count').innerHTML = count;
	}, 500);
}
function startBrawling(player, enemy){
	console.log('START!')
	app.battleStartCount = 'START!';
	console.log(app.battleStartCount)

	// activate battle control
	activateBattleControl();

	// auto-start enemy attack
	autoAttack(enemy, player, function(result){
		// console.log('auto attack result: ', result);
		handleBattleResult(result);
	});
}

// Control
function activateBattleControl(){
	console.log('battle control activated');
	window.addEventListener('keypress', windowKeypressHandler, true);
}
function deactivateBattleControl(){
	console.log('deactivating battle control', window);
	window.removeEventListener('keypress', windowKeypressHandler, true);
}

// Auto Attack
function autoAttack(attacker, target, callback){
	console.log(attacker, 'auto attack activated');
	var result = null;
	autoAttackInterval = setInterval(function(){
		console.log('auto attack! speed: '+attacker.speed);
		app.battleLogs.push(attacker.name + ' attacking')
		attack(attacker, target, function(result){
			clearInterval(autoAttackInterval);
			callback(result);
		});
	}, attacker.speed);
}
function stopAutoAttack(){
	console.log('stop auto attack')
	clearInterval(autoAttackInterval);
}

// Attacks
function punch(hand, attacker, target, callback){
	console.log(hand+' hand punch');
	app.battleLogs.push(attacker.name + ' ' + hand +' hand punch')

	attack(attacker, target, function(result){
		callback(result);
	});
}
function attack(attacker, target, callback){
	var result = null;
	// console.log(target)
	// console.log('RENDER HEALTH AND STAMINA', app)
	if(attacker.stamina > 0){
		target.health -= attacker.damage;
		attacker.stamina--;
	}else{
		deactivateBattleControl();
	}

	if(attacker.name == app.selectedChar.name){
		// console.log('PLAYER ATTACK', attacker.stamina, target.health)
		app.selectedChar = attacker;
		app.selectedEnemy = target;
		app.renderHealthAndStamina(attacker, target);
	}else{
		// console.log('ENEMY ATTACK', attacker.stamina, target.health)
		app.selectedEnemy = attacker;
		app.selectedChar = target;
		app.renderHealthAndStamina(target, attacker);
	}

	if(target && target.health<=0 || target.health.toString() == 'NaN'){
		result = {
			winner: attacker,
			loser: target
		}
		callback(result);
	}
}

// Result Handler
function handleBattleResult(result){
	if(result){
		deactivateBattleControl();
		stopAutoAttack();
		result.log =  battleLog;
		app.handleBattleResult(result);
	}
}

// Module
function windowKeypressHandler(e){
	// console.log(e.key, e.keyCode);
	// 'e' = 101 | 'q' = 113
	var player = app.selectedChar;
	var enemy = app.selectedEnemy;
	if(e.keyCode === 101){
		// console.log(app)
		battleLog.punch.right++
		punch('right', player, enemy, function(result){
			// console.log('punch result: ', result);
			handleBattleResult(result);
		});
	}else if(e.keyCode === 113){
		battleLog.punch.left++
		punch('left', player, enemy, function(result){
			// console.log('punch result: ', result);
			handleBattleResult(result);
		});
	}
}