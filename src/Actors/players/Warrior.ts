import { Engine, vec, Vector } from "excalibur";

import { WeaponFactory } from "../../Factories/weapon-factories.ts/base-weapon-factory";
import { DaggerFactory } from "../../Factories/weapon-factories.ts/dagger-factory";

import { Player } from "./player";

export class Warrior extends Player {
  //base
    facingAngle: Vector = vec(1, 1);
    health = 100;
    magneticSpeed = 100;
    knockback = 100;
    attack = 10;
    speed = 100;
    weapons: WeaponFactory<any>[] = [];
    xp = 0;

  //bonus multiplier
    xpBonus = 100;
    speedBonus = 0;
    knockBackBonus = 0;
    maxHealthBonus = 0;
    attackBonus = 0;



    constructor(engine: Engine, startingPosition: Vector) {
        super(engine, startingPosition);
        this.weapons = [new DaggerFactory(this, engine.currentScene)]
    }
}
