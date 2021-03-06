import { Loader } from "../core/loader";
import { AtlasSprite } from "../core/sprites";
import { Vector } from "../core/vector";
import { SOUNDS } from "../platform/sound";
import { StaticMapEntityComponent } from "./components/static_map_entity";
import { Entity } from "./entity";
import { enumLayer, GameRoot } from "./root";

export const defaultBuildingVariant = "default";

export class MetaBuilding {
    /**
     *
     * @param {string} id Building id
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Returns the id of this building
     */
    getId() {
        return this.id;
    }

    /**
     * Returns the edit layer of the building
     * @returns {enumLayer}
     */
    getLayer() {
        return enumLayer.regular;
    }

    /**
     * Should return the dimensions of the building
     */
    getDimensions(variant = defaultBuildingVariant) {
        return new Vector(1, 1);
    }

    /**
     * Returns whether the building has the direction lock switch available
     */
    getHasDirectionLockAvailable() {
        return false;
    }

    /**
     * Whether to stay in placement mode after having placed a building
     */
    getStayInPlacementMode() {
        return false;
    }

    /**
     * Should return additional statistics about this building
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        return [];
    }

    /**
     * Whether to flip the orientation after a building has been placed - useful
     * for tunnels.
     */
    getFlipOrientationAfterPlacement() {
        return false;
    }

    /**
     * Whether to rotate automatically in the dragging direction while placing
     * @param {string} variant
     */
    getRotateAutomaticallyWhilePlacing(variant) {
        return false;
    }

    /**
     * Returns the placement sound
     * @returns {string}
     */
    getPlacementSound() {
        return SOUNDS.placeBuilding;
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        return [defaultBuildingVariant];
    }

    /**
     * Returns a preview sprite
     * @returns {AtlasSprite}
     */
    getPreviewSprite(rotationVariant = 0, variant = defaultBuildingVariant) {
        return Loader.getSprite(
            "sprites/buildings/" +
                this.id +
                (variant === defaultBuildingVariant ? "" : "-" + variant) +
                ".png"
        );
    }

    /**
     * Returns a sprite for blueprints
     * @returns {AtlasSprite}
     */
    getBlueprintSprite(rotationVariant = 0, variant = defaultBuildingVariant) {
        return Loader.getSprite(
            "sprites/blueprints/" +
                this.id +
                (variant === defaultBuildingVariant ? "" : "-" + variant) +
                ".png"
        );
    }

    /**
     * Returns whether this building is rotateable
     * @param {string} variant
     * @returns {boolean}
     */
    isRotateable(variant) {
        return true;
    }

    /**
     * Returns whether this building is unlocked for the given game
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return true;
    }

    /**
     * Should return a silhouette color for the map overview or null if not set
     */
    getSilhouetteColor() {
        return null;
    }

    /**
     * Creates the entity without placing it
     * @param {object} param0
     * @param {GameRoot} param0.root
     * @param {Vector} param0.origin Origin tile
     * @param {number=} param0.rotation Rotation
     * @param {number} param0.originalRotation Original Rotation
     * @param {number} param0.rotationVariant Rotation variant
     * @param {string} param0.variant
     */
    createEntity({ root, origin, rotation, originalRotation, rotationVariant, variant }) {
        const entity = new Entity(root);
        entity.layer = this.getLayer();
        const blueprintSprite = this.getBlueprintSprite(rotationVariant, variant);
        entity.addComponent(
            new StaticMapEntityComponent({
                spriteKey:
                    "sprites/buildings/" +
                    this.id +
                    (variant === defaultBuildingVariant ? "" : "-" + variant) +
                    ".png",
                origin: new Vector(origin.x, origin.y),
                rotation,
                originalRotation,
                tileSize: this.getDimensions(variant).copy(),
                silhouetteColor: this.getSilhouetteColor(),
                blueprintSpriteKey: blueprintSprite ? blueprintSprite.spriteName : "",
            })
        );
        this.setupEntityComponents(entity, root);
        this.updateVariants(entity, rotationVariant, variant);
        return entity;
    }

    /**
     * Should compute the optimal rotation variant on the given tile
     * @param {object} param0
     * @param {GameRoot} param0.root
     * @param {Vector} param0.tile
     * @param {number} param0.rotation
     * @param {string} param0.variant
     * @param {string} param0.layer
     * @return {{ rotation: number, rotationVariant: number, connectedEntities?: Array<Entity> }}
     */
    computeOptimalDirectionAndRotationVariantAtTile({ root, tile, rotation, variant, layer }) {
        if (!this.isRotateable(variant)) {
            return {
                rotation: 0,
                rotationVariant: 0,
            };
        }
        return {
            rotation,
            rotationVariant: 0,
        };
    }

    /**
     * Should update the entity to match the given variants
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {}

    // PRIVATE INTERFACE

    /**
     * Should setup the entity components
     * @param {Entity} entity
     * @param {GameRoot} root
     */
    setupEntityComponents(entity, root) {
        abstract;
    }
}
