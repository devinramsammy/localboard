import Datastore from 'nedb-promises';
import { DatabaseTypes } from './types';

export default class Database {
  constructor() {}

  private db: Datastore | null = null;
  private isLoaded: boolean = false;
  private fileName: string = '';

  private loadDatabase(filename: string): void {
    this.isLoaded = false;
    this.fileName = filename;

    this.db = Datastore.create({
      filename: filename,
      timestampData: true,
      autoload: true,
    });
    this.isLoaded = true;
  }

  public getLoaded(): boolean {
    return this.isLoaded;
  }

  public getFileName(): string {
    return this.fileName;
  }

  public setupDatabase(filename: string): void {
    if (!this.getLoaded()) {
      this.loadDatabase(filename);
    }
  }

  public async getBoards(): Promise<DatabaseTypes.DataRecord[]> {
    try {
      const boards:
        | DatabaseTypes.DataRecord[]
        | undefined = await this.db?.find({});
      if (boards !== undefined) {
        return boards;
      } else {
        return [];
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBoard(id: string): Promise<DatabaseTypes.DataRecord[]> {
    try {
      const board:
        | DatabaseTypes.DataRecord[]
        | undefined = await this.db?.find({ _id: id });
      if (board !== undefined) {
        return board;
      } else {
        return [];
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAllItems(): Promise<DatabaseTypes.BoardItemProps[]> {
    try {
      const boards:
        | DatabaseTypes.DataRecord[]
        | undefined = await this.db?.find({});
      const items: DatabaseTypes.BoardItemProps[] = [];
      boards?.forEach((board) => {
        let keys = Object.keys(board.items);
        keys.forEach((key) => {
          if (board.items[key].date !== null) {
            board.items[key].boardId = board._id;
            items.push(board.items[key]);
          }
        });
      });
      return items;
    } catch (err) {
      throw err;
    }
  }

  public async getUpcomingItems(
    limit: number
  ): Promise<DatabaseTypes.BoardItemProps[]> {
    const items = await this.getAllItems();
    items.sort((a, b): number => {
      let date1 = new Date(a.date);
      let date2 = new Date(b.date);
      return date1.getTime() - date2.getTime();
    });
    let index = limit > items.length ? 0 : items.length - limit;
    return items.slice(index, items.length);
  }

  public async translateAllItems(): Promise<DatabaseTypes.Calendar[]> {
    const items = await this.getAllItems();
    const translate: DatabaseTypes.Calendar[] = [];
    items.forEach((item) => {
      let newTranslate: DatabaseTypes.Calendar = {
        id: item.id,
        start: new Date(item.date),
        end: new Date(item.date),
        title: item.content,
        allDay: true,
        boardId: item.boardId,
      };
      translate.push(newTranslate);
    });
    return translate;
  }

  public async updateBoard(
    board: DatabaseTypes.DataRecord
  ): Promise<DatabaseTypes.Status> {
    try {
      await this.db?.update({ _id: board._id }, board, {});
      return { status: true };
    } catch (err) {
      return { status: false };
    }
  }

  public async updateItem(
    id: string,
    item: DatabaseTypes.BoardItemProps
  ): Promise<DatabaseTypes.Status> {
    try {
      let dotNotation = `items.${item.id}`;
      await this.db?.update({ _id: id }, { $set: { [dotNotation]: item } }, {});
      return { status: true };
    } catch (err) {
      throw err;
    }
  }

  public async deleteBoard(id: string): Promise<DatabaseTypes.Status> {
    try {
      await this.db?.remove({ _id: id }, {});
      return { status: true };
    } catch (err) {
      throw err;
    }
  }

  public async createBoard(title: string): Promise<DatabaseTypes.DataRecord> {
    try {
      let doc: DatabaseTypes.DataRecord = {
        title: title,
        items: {},
        columns: {},
        columnsOrder: [],
      };
      const res: DatabaseTypes.DataRecord | undefined = await this.db?.insert(
        doc
      );
      if (res !== undefined) {
        return res;
      } else {
        throw new Error('Unable to create board');
      }
    } catch (err) {
      throw err;
    }
  }

  public async destroyAllDatabases(): Promise<DatabaseTypes.Status> {
    try {
      await this.db?.remove({}, { multi: true });
      return { status: true };
    } catch (err) {
      throw err;
    }
  }
}
