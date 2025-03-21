import { Wolf } from "../../Actors/enemies/Wolf";
import { BaseLevel } from "../../Levels/base";
import { BaseEnemyFactory } from "./base-enemy-factory";

export class WolfFactory extends BaseEnemyFactory<Wolf> {
    constructor(
        level: BaseLevel,
    ) {
        super(level, Wolf)
    }
    
}