import { ActionSequence, Actor, ActorArgs, Collider, CollisionContact, Color, Engine, Font, GameEvent, Label, ParallelActions, Rectangle, RotationType, Shape, Side, Timer, vec, Vector } from "excalibur";

import { Player } from "../players/player";
import { BaseEnemy } from "../enemies/baseEnemy";

export type BaseWeaponProps = ActorArgs & {angle?: Vector, player: Player, level?: number}

export type BASE_WEAPON_STATS = {
    damage: number;
    speed: number;
    knockback: number;
    numberOfWeapons: number;
    cooldown: number;
}

const BASE_WEAPON_MAP: BASE_WEAPON_STATS[] = [
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
    {damage: 20, speed: 1000, knockback: 500, numberOfWeapons: 1, cooldown: 1000},
];

export abstract class BaseWeapon extends Actor {
    player!: Player
    _damage = 20;
    _speed = 2000;
    _numberOfWeapons = 1;
    _cooldown = 1000;
    _knockback = 500;
    level = 1;
    levelUpMap: BASE_WEAPON_STATS[] = BASE_WEAPON_MAP;

    get damage() {
        return this._damage;
    }

    get speed() {
        return this._speed;
    }

    get numberOfWeapons() {
        return this._numberOfWeapons;
    }

    get cooldown() {
        return this._cooldown;
    }

    get knockback() {
        return this._knockback;
    }

    constructor(args: BaseWeaponProps) {
        const {angle, player, level = 1, ...actorArgs} = args
        super({
            ...actorArgs
        })
        this.player = player;
        this.level = level;
        this.levelTo(level);

        this.events.on('exitviewport', () => {
            this.kill()
        })
    }

    override onInitialize(engine: Engine): void {

        
    }

    levelTo(newLevel: number) {
        newLevel = newLevel > BASE_WEAPON_MAP.length ? BASE_WEAPON_MAP.length : newLevel;
        const levelStats = this.levelUpMap[newLevel < 0 ? 0 : newLevel];
        this._damage = levelStats.damage;
        this._speed = levelStats.speed;
        this._numberOfWeapons = levelStats.numberOfWeapons;
        this._cooldown = levelStats.cooldown;
        this._knockback = levelStats.knockback;
    }

    abstract onEnemyCollisionSideEffects: (self: Collider, other: Collider, side: Side, contact: CollisionContact) => void

    override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        if (other.owner instanceof BaseEnemy) {
            const enemy = other.owner;

        // Deal damage
            enemy.takeDamage(this.damage);
            // Compute knockback direction
            const knockbackDir = enemy.pos.sub(this.pos).normalize();

            // Apply impulse for kickback effect
            enemy.vel = knockbackDir.scale(this.knockback);
            this.onEnemyCollisionSideEffects(self, other, side, contact);
        }
    }
}

//nex thing is to add wood score and wolves that patrol the forest