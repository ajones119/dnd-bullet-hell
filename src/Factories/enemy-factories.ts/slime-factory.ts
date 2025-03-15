import { Slime } from "../../Actors/enemies/Slime";
import { BaseLevel } from "../../Levels/base";
import { BaseEnemyFactory } from "./base-enemy-factory";

export class SlimeFactory extends BaseEnemyFactory<Slime> {
    constructor(
        level: BaseLevel,
    ) {
        super(level, Slime)
    }

}