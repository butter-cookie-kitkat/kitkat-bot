import { database } from '../database';
import { IThings } from '../database/xivapi/things';
import { IPoints } from '../database/xivapi/points';
import { where, fn, col, Model } from 'sequelize';
import { IThingPoints } from '../database/xivapi/thing_points';

export class XIVService {
  /**
   * Returns the map data for a given item.
   *
   * @param name - the name of the item.
   * @returns the items map data.
   */
  async find(name: string): Promise<(null|MapData)> {
    const { XIV_API } = await database();

    const thing = await XIV_API.Things.findOne({
      where: {
        name: where(fn('LOWER', col('name')), 'LIKE', `%${name.toLowerCase()}%`),
      },
      include: [{
        all: true,
        model: XIV_API.Points,
      }],
      order: [
        [fn('length', col('name')), 'ASC'],
      ],
      plain: true,
    });

    return thing ? thing.toJSON() : null;
  }

  /**
   * Saves a list of points to the database.
   *
   * @param points - the points to save.
   * @returns the updated list of points.
   */
  async createPoints(points: IPoints): Promise<IPoints>
  async createPoints(...points: IPoints[]): Promise<IPoints[]>
  async createPoints(...points: IPoints[]): Promise<IPoints|IPoints[]> {
    try {
      const { XIV_API } = await database();

      const updatedPoints = await this.toJSON(XIV_API.Points.bulkCreate(points));

      return updatedPoints.length === 1 ? updatedPoints[0] : updatedPoints;
    } catch (error) {
      throw error.original ? error.original : error;
    }
  }

  /**
   * Saves a list of things to the database.
   *
   * @param things - the things to save.
   * @returns the updated list of things.
   */
  async createThings(things: IThings): Promise<IThings>
  async createThings(...things: IThings[]): Promise<IThings[]>
  async createThings(...things: IThings[]): Promise<IThings|IThings[]> {
    try {
      const { XIV_API } = await database();

      const updatedThings = await this.toJSON(XIV_API.Things.bulkCreate(things));

      return updatedThings.length === 1 ? updatedThings[0] : updatedThings;
    } catch (error) {
      throw error.original ? error.original : error;
    }
  }

  /**
   * Saves a list of thingPoints to the database.
   *
   * @param thingPoints - the thingPoints to save.
   * @returns the updated list of thingPoints.
   */
  async createThingPoints(thingPoints: IThingPoints): Promise<IThingPoints>
  async createThingPoints(...thingPoints: IThingPoints[]): Promise<IThingPoints[]>
  async createThingPoints(...thingPoints: IThingPoints[]): Promise<IThingPoints|IThingPoints[]> {
    try {
      const { XIV_API } = await database();

      const updatedThingPoints = await this.toJSON(XIV_API.ThingPoints.bulkCreate(thingPoints));

      return updatedThingPoints.length === 1 ? updatedThingPoints[0] : updatedThingPoints;
    } catch (error) {
      throw error.original ? error.original : error;
    }
  }

  private toJSON(items: Promise<Model[]>): Promise<any[]>
  private toJSON(items: Model[]): any[]
  private toJSON(items: (Model[]|Promise<Model[]>)): any[]|Promise<any[]> {
    if (Array.isArray(items)) {
      return items.map((item) => item.get({ plain: true }));
    }

    return items.then(this.toJSON);
  }

  async clear(): Promise<void> {
    const { XIV_API } = await database();

    await XIV_API.ThingPoints.destroy({
      truncate: true,
      cascade: true,
    });

    await Promise.all([
      XIV_API.Points.destroy({
        truncate: true,
        cascade: true,
      }),
      XIV_API.Things.destroy({
        truncate: true,
        cascade: true,
      }),
    ]);
  }
}

export const service = new XIVService();

export interface MapData extends IThings {
  points: IPoints[];
}
